# Ultimate Trading System: 10k to 500k Growth Blueprint

## Overview
This is a complete, production-ready algorithmic trading system designed to demonstrate a path from $10,000 to $500,000 through disciplined, data-driven trading. 

**WARNING**: Trading involves substantial risk of loss. Past performance is not indicative of future results. This is for educational purposes. No guarantees. Use at your own risk. Consult professionals.

### Core Strategy: Enhanced Pairs Trading with Momentum Filter + Risk Management
- Market-neutral pairs trading (stat arb)
- Augmented with momentum and volatility filters
- Strict risk controls (1-2% per trade risk)
- Dynamic position sizing
- Walk-forward optimization

### Features
- Data fetching with yfinance
- Backtesting with Backtesting.py + custom vectorized
- Comprehensive risk management
- Performance metrics (Sharpe, Sortino, Max DD, CAGR)
- Visualization dashboard
- Unit tests
- Logging and configuration

### Goal Path
To achieve 50x:
- Target ~40-60% annualized with compounding over 5-8 years (realistic with leverage/risk)
- Or higher risk options/leveraged for faster (but dangerous)

## Installation
```bash
pip install -r requirements.txt
```

## Usage
See `main.py` and notebooks.

## Structure
- `strategies/`: Strategy implementations
- `backtests/`: Backtest scripts
- `utils/`: Helpers
- `tests/`: Tests
- `data/`: Cached data
