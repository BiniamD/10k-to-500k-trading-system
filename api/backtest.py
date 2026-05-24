import sys
import os

# Ensure repo root is on the path so strategy/utils modules resolve
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from http.server import BaseHTTPRequestHandler
import json

from utils.data_fetcher import fetch_pair_data
from strategies.pairs_trading import PairsTradingStrategy


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            ticker1 = "KO"
            ticker2 = "PEP"
            initial_capital = 10_000

            df = fetch_pair_data(ticker1, ticker2, start="2018-01-01")
            strategy = PairsTradingStrategy()
            signals, hedge = strategy.generate_signals(df, ticker1, ticker2)

            # Vectorized backtest
            in_position = False
            trades = []
            for i in range(1, len(df)):
                idx = str(df.index[i].date())
                if not in_position:
                    if signals["long_spread"].iloc[i]:
                        in_position = True
                        trades.append({"type": "LONG_SPREAD", "date": idx})
                    elif signals["short_spread"].iloc[i]:
                        in_position = True
                        trades.append({"type": "SHORT_SPREAD", "date": idx})
                else:
                    if signals["exit"].iloc[i]:
                        in_position = False
                        trades.append({"type": "EXIT", "date": idx})

            result = {
                "ticker1": ticker1,
                "ticker2": ticker2,
                "initial_capital": initial_capital,
                "data_points": len(df),
                "total_trades": len(trades),
                "recent_trades": trades[-10:] if trades else [],
                "note": "Demo backtest — equity curve uses simplified simulation.",
            }

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(result, indent=2).encode())

        except Exception as exc:
            self.send_response(500)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            error = {"error": str(exc)}
            self.wfile.write(json.dumps(error).encode())
