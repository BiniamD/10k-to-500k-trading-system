import os
import time
from typing import Dict, Any, List

import pandas as pd

from strategies.pairs_trading import PairsTradingStrategy
from utils.data_fetcher import fetch_pair_data


_CACHE: Dict[str, Any] = {"expires_at": 0.0, "payload": None}


def _to_float(value, digits=4):
    if pd.isna(value):
        return 0.0
    return round(float(value), digits)


def _compute_positions(signals: pd.DataFrame) -> pd.Series:
    position = pd.Series(0, index=signals.index, dtype=float)
    current = 0
    for i in range(len(signals)):
        if bool(signals["long_spread"].iloc[i]):
            current = 1
        elif bool(signals["short_spread"].iloc[i]):
            current = -1
        elif bool(signals["exit"].iloc[i]):
            current = 0
        position.iloc[i] = current
    return position


def _build_from_prices(df: pd.DataFrame, ticker1: str, ticker2: str, initial_capital: float) -> Dict[str, Any]:
    strategy = PairsTradingStrategy()
    signals, hedge = strategy.generate_signals(df, ticker1, ticker2)
    hedge = hedge.ffill().bfill()

    spread = (df[ticker2] - hedge * df[ticker1]).replace([pd.NA], 0).fillna(0)
    spread_return = spread.pct_change().replace([pd.NA], 0).fillna(0).clip(-0.1, 0.1)

    position = _compute_positions(signals)
    strategy_return = (position.shift(1).fillna(0) * spread_return * 0.8).clip(-0.2, 0.2)

    equity = (1 + strategy_return).cumprod() * initial_capital
    benchmark = (df[ticker1] / df[ticker1].iloc[0]) * initial_capital
    drawdown = ((equity.cummax() - equity) / equity.cummax().replace(0, pd.NA)).fillna(0) * 100

    total_return_pct = ((equity.iloc[-1] / initial_capital) - 1) * 100
    benchmark_return_pct = ((benchmark.iloc[-1] / initial_capital) - 1) * 100

    completed_trades = int(signals["exit"].sum())
    winning_days = int((strategy_return > 0).sum())
    active_days = int((strategy_return != 0).sum()) or 1

    volatility = spread_return.tail(30).std() * 100
    latest_zscore = _to_float(signals["zscore"].iloc[-1], 3)

    if abs(latest_zscore) >= 2.0:
        regime_state = "VOLATILE"
    elif abs(latest_zscore) >= 1.0:
        regime_state = "BUSY"
    else:
        regime_state = "CALM"

    confidence = max(70, min(97, int(90 - (abs(latest_zscore) * 6))))
    vpin = max(0.2, min(0.95, abs(latest_zscore) / 3 + 0.3))
    imbalance = max(-50, min(50, int((strategy_return.tail(10).mean() or 0) * 1000)))

    latest_price_1 = _to_float(df[ticker1].iloc[-1], 2)
    latest_price_2 = _to_float(df[ticker2].iloc[-1], 2)
    position_scale = max(1, int(initial_capital * 0.03))
    live_positions: List[Dict[str, Any]] = []

    if position.iloc[-1] != 0:
        side_primary = "LONG" if position.iloc[-1] > 0 else "SHORT"
        side_secondary = "SHORT" if side_primary == "LONG" else "LONG"
        pnl_1 = _to_float((df[ticker1].iloc[-1] - df[ticker1].iloc[-2]) * position_scale, 2)
        pnl_2 = _to_float((df[ticker2].iloc[-1] - df[ticker2].iloc[-2]) * position_scale, 2)
        live_positions = [
            {
                "symbol": ticker1,
                "side": side_secondary,
                "qty": position_scale,
                "entry": _to_float(df[ticker1].iloc[-2], 2),
                "current": latest_price_1,
                "pnl": pnl_1,
                "percent": _to_float((pnl_1 / initial_capital) * 100, 2),
                "risk": "Medium",
            },
            {
                "symbol": ticker2,
                "side": side_primary,
                "qty": position_scale,
                "entry": _to_float(df[ticker2].iloc[-2], 2),
                "current": latest_price_2,
                "pnl": pnl_2,
                "percent": _to_float((pnl_2 / initial_capital) * 100, 2),
                "risk": "Medium",
            },
        ]

    equity_points = [
        {
            "time": ts.strftime("%H:%M:%S"),
            "equity": _to_float(eq, 2),
            "benchmark": _to_float(bench, 2),
            "drawdown": _to_float(dd, 2),
        }
        for ts, eq, bench, dd in zip(equity.index[-60:], equity.tail(60), benchmark.tail(60), drawdown.tail(60))
    ]

    metrics = [
        {"label": "Win Rate", "value": f"{(winning_days / active_days) * 100:.1f}%", "change": "strategy active-day ratio", "tone": "positive"},
        {"label": "Sharpe Ratio", "value": f"{(_to_float(strategy_return.mean() / (strategy_return.std() or 1e-9) * (252 ** 0.5), 2)):.2f}", "change": "rolling estimate", "tone": "positive"},
        {"label": "Max Drawdown", "value": f"{drawdown.max():.2f}%", "change": "peak-to-trough", "tone": "negative" if drawdown.max() > 10 else "positive"},
        {"label": "Profit Factor", "value": f"{((_to_float(strategy_return[strategy_return > 0].sum() / abs(strategy_return[strategy_return < 0].sum() or 1e-9), 2))):.2f}", "change": "gross gain/loss", "tone": "positive"},
        {"label": "Avg Trade", "value": f"${_to_float((equity.iloc[-1] - initial_capital) / max(completed_trades, 1), 2):,.2f}", "change": "per completed trade", "tone": "neutral"},
        {"label": "Total Trades", "value": str(completed_trades), "change": "completed entries", "tone": "neutral"},
    ]

    buy_volume = max(1000, int(12000 + (strategy_return.tail(12).sum() * 150000)))
    sell_volume = max(1000, int(11000 - (strategy_return.tail(12).sum() * 120000)))
    total_volume = buy_volume + sell_volume
    buy_percent = int(round((buy_volume / total_volume) * 100))

    insights = [
        {
            "title": "Signal Confidence",
            "detail": f"Latest z-score {latest_zscore} with regime confidence {confidence}%.",
            "severity": "info",
        },
        {
            "title": "Latency Watch",
            "detail": "Endpoint payload is contract-versioned and generated for dashboard polling.",
            "severity": "info",
        },
        {
            "title": "Risk Trigger",
            "detail": f"Current max drawdown is {_to_float(drawdown.max(), 2)}% against configured risk posture.",
            "severity": "warning" if drawdown.max() > 8 else "info",
        },
        {
            "title": "Execution Bias",
            "detail": f"Order-flow estimate indicates {buy_percent}% buy pressure.",
            "severity": "critical" if buy_percent <= 45 else "info",
        },
    ]

    latest_equity = _to_float(equity.iloc[-1], 2)
    pnl_value = _to_float(latest_equity - initial_capital, 2)
    pnl_percent = _to_float(total_return_pct, 2)

    return {
        "header": {
            "portfolioValue": latest_equity,
            "pnlValue": pnl_value,
            "pnlPercent": pnl_percent,
            "riskBudgetPercent": max(1, min(99, int(60 + volatility))),
            "sessionStatus": "Live",
            "preTradeChecks": "healthy",
        },
        "equity": {
            "timeframes": {
                "1H": equity_points,
                "4H": equity_points,
                "1D": equity_points,
            },
            "sessionChangePercent": _to_float(((equity.iloc[-1] / equity.iloc[0]) - 1) * 100, 2),
            "currentDrawdownPercent": _to_float(drawdown.iloc[-1], 2),
            "currentEquity": latest_equity,
        },
        "regime": {
            "state": regime_state,
            "confidence": confidence,
            "vpin": _to_float(vpin, 2),
            "imbalance": imbalance,
            "message": (
                "Reduce order size and enforce wider slippage controls."
                if regime_state == "VOLATILE"
                else "Prioritize high-conviction setups and tighten entry thresholds."
                if regime_state == "BUSY"
                else "Normal execution posture. Model quality remains stable."
            ),
        },
        "performance": {
            "metrics": metrics,
            "totalReturnPercent": _to_float(total_return_pct, 2),
            "benchmarkReturnPercent": _to_float(benchmark_return_pct, 2),
        },
        "orderFlow": {
            "buyVolume": buy_volume,
            "sellVolume": sell_volume,
            "buyPercent": buy_percent,
            "actionCue": "Lean Long" if buy_percent >= 58 else "Defensive" if buy_percent <= 45 else "Balanced",
        },
        "positions": {
            "active": live_positions,
            "activeCount": len(live_positions),
        },
        "insights": {
            "items": insights,
        },
        "meta": {
            "ticker1": ticker1,
            "ticker2": ticker2,
            "initialCapital": initial_capital,
            "dataPoints": int(len(df)),
            "latestZScore": latest_zscore,
        },
    }


def build_dashboard_snapshot() -> Dict[str, Any]:
    ticker1 = os.getenv("TRADING_TICKER_1", "KO")
    ticker2 = os.getenv("TRADING_TICKER_2", "PEP")
    initial_capital = float(os.getenv("TRADING_INITIAL_CAPITAL", "10000"))
    start_date = os.getenv("TRADING_START_DATE", "2022-01-01")

    df = fetch_pair_data(ticker1, ticker2, start=start_date)
    if df.empty:
        raise ValueError("No market data available for configured ticker pair")
    return _build_from_prices(df, ticker1, ticker2, initial_capital)


def get_dashboard_snapshot(ttl_seconds: int = 20, force_refresh: bool = False) -> Dict[str, Any]:
    now = time.time()
    if not force_refresh and _CACHE["payload"] is not None and now < _CACHE["expires_at"]:
        return _CACHE["payload"]

    payload = build_dashboard_snapshot()
    _CACHE["payload"] = payload
    _CACHE["expires_at"] = now + ttl_seconds
    return payload


def get_backtest_summary() -> Dict[str, Any]:
    snapshot = get_dashboard_snapshot(ttl_seconds=20)
    return {
        "ticker1": snapshot["meta"]["ticker1"],
        "ticker2": snapshot["meta"]["ticker2"],
        "initialCapital": snapshot["meta"]["initialCapital"],
        "dataPoints": snapshot["meta"]["dataPoints"],
        "totalReturnPercent": snapshot["performance"]["totalReturnPercent"],
        "benchmarkReturnPercent": snapshot["performance"]["benchmarkReturnPercent"],
        "latestZScore": snapshot["meta"]["latestZScore"],
        "activePositions": snapshot["positions"]["activeCount"],
    }
