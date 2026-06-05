# 10K → 500K Trading System

Algorithmic pairs-trading dashboard designed to grow a $10 000 account to $500 000 through a systematic, compounding strategy. The system ships a Bloomberg-style **Workstation** UI and a Python backend that can connect to live sandbox (paper) trading via Alpaca or Polygon.io.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Environment Variables](#environment-variables)
5. [Backend – Python](#backend--python)
6. [Frontend – Next.js](#frontend--nextjs)
7. [API Endpoints](#api-endpoints)
8. [Sandbox Trading Setup](#sandbox-trading-setup)
9. [Strategy Overview](#strategy-overview)
10. [Backtesting](#backtesting)
11. [Running Tests](#running-tests)
12. [Project Structure](#project-structure)

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Browser  (Next.js 14 – App Router)             │
│                                                 │
│  Workstation Layout                             │
│  ┌──────────┐  ┌───────────────────────────┐   │
│  │ Regime   │  │  Equity Curve (Recharts)  │   │
│  │ Monitor  │  ├───────────────────────────┤   │
│  ├──────────┤  │  Tabs: Performance /      │   │
│  │ Order    │  │        Positions / Trends │   │
│  │ Flow     │  └───────────────────────────┘   │
│  └──────────┘                                   │
└───────────────────┬─────────────────────────────┘
                    │ REST JSON (versioned envelope)
┌───────────────────▼─────────────────────────────┐
│  Vercel Serverless Functions  (/api/*)           │
│                                                 │
│  dashboard.py · portfolio.py · positions.py     │
│  equity.py · regime.py · performance.py         │
│  order_flow.py · insights.py · backtest.py      │
└───────────────────┬─────────────────────────────┘
                    │ Python imports
┌───────────────────▼─────────────────────────────┐
│  backend/                                       │
│  dashboard_service.py  – core computation       │
│  api_response.py       – versioned envelopes    │
│  api_contract.py       – schema version         │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│  strategies/pairs_trading.py  – z-score model   │
│  utils/data_fetcher.py        – yfinance / API  │
│  backtests/backtest_pairs.py  – vectorised BT   │
└─────────────────────────────────────────────────┘
```

All API responses are wrapped in a versioned envelope:

```json
{
  "schemaVersion": "1.0.0",
  "generatedAt": "2025-01-15T10:30:00Z",
  "data": { ... }
}
```

---

## Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | 18 LTS |
| npm | 9 |
| Python | 3.10 |
| pip | 23 |

---

## Quick Start

```bash
# 1. Clone and enter the repo
git clone https://github.com/BiniamD/10k-to-500k-trading-system.git
cd 10k-to-500k-trading-system

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Install Node dependencies
npm install

# 4. Copy and edit environment variables
cp .env.example .env.local   # then fill in your keys (see below)

# 5. Start the development server
npm run dev          # http://localhost:3000
```

---

## Environment Variables

Create `.env.local` (for local Next.js dev) or set these in your Vercel project settings.

| Variable | Default | Description |
|----------|---------|-------------|
| `TRADING_TICKER_1` | `KO` | Primary ticker symbol |
| `TRADING_TICKER_2` | `PEP` | Paired ticker symbol |
| `TRADING_INITIAL_CAPITAL` | `10000` | Starting capital in USD |
| `TRADING_START_DATE` | `2022-01-01` | Historical data start date |
| `ALPACA_API_KEY` | – | Alpaca Markets paper-trading API key |
| `ALPACA_API_SECRET` | – | Alpaca Markets paper-trading API secret |
| `ALPACA_BASE_URL` | `https://paper-api.alpaca.markets` | Use paper URL for sandbox |
| `POLYGON_API_KEY` | – | Polygon.io API key (real-time data) |

> **Never commit real API keys.** `.env.local` is already in `.gitignore`.

---

## Backend – Python

### Install

```bash
pip install -r requirements.txt
```

### Key modules

| Module | Purpose |
|--------|---------|
| `backend/dashboard_service.py` | Builds the full dashboard snapshot; caches with 20-second TTL |
| `backend/api_response.py` | `success_envelope()` / `error_envelope()` helpers |
| `strategies/pairs_trading.py` | Rolling OLS hedge ratio + z-score signal generation |
| `utils/data_fetcher.py` | `fetch_pair_data()` – downloads closing prices via yfinance |
| `backtests/backtest_pairs.py` | Vectorised walk-forward simulation |
| `main.py` | CLI entry-point; runs the full backtest and prints a summary |

### Run the CLI backtest

```bash
python main.py
```

### Run a custom backtest

```python
from backtests.backtest_pairs import run_full_backtest

df, signals, trades = run_full_backtest(
    ticker1='MSFT',
    ticker2='AAPL',
    initial_capital=10_000,
)
```

### Fallback data

When `yfinance` returns no data (offline, rate-limited, etc.), the service
automatically falls back to deterministic synthetic prices so the dashboard
never shows blank panels.

---

## Frontend – Next.js

### Install

```bash
npm install
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run test` | Jest unit tests |

### Layout – Workstation (Bloomberg-style)

The main dashboard at `/` uses the Workstation layout:

- **Left 30%** — `RegimeMonitor` (market state + z-score) and `OrderFlowPanel` (buy/sell pressure).
- **Right 70%** — `EquityCurve` on top; tabbed area below switches between `PerformanceMetrics`, `LivePositions`, and `FintechTrendsPanel`.

### Data hooks

`frontend/hooks/useApiData.ts` — generic hook that polls any API endpoint,
handles loading/error states, and retries on failure:

```ts
const { data, loading, error } = useApiData<RegimeData>('/api/regime', 5000);
```

### API client

`frontend/utils/api.ts` — unwraps the versioned envelope and throws typed errors.

### TypeScript types

All API shapes are declared in `frontend/types/dashboard.ts`.

---

## API Endpoints

All endpoints are Vercel serverless functions under `/api/`.

| Endpoint | Data returned |
|----------|--------------|
| `GET /api/dashboard` | Full dashboard snapshot (all panels) |
| `GET /api/portfolio` | Header stats (equity, P&L, risk budget) |
| `GET /api/equity` | Equity curve + drawdown time-series |
| `GET /api/regime` | Market regime state + VPIN + imbalance |
| `GET /api/performance` | Win rate, Sharpe, drawdown, profit factor |
| `GET /api/positions` | Live open positions |
| `GET /api/order_flow` | Buy/sell volume + action cue |
| `GET /api/insights` | Alert items (info / warning / critical) |
| `GET /api/backtest` | Backtest summary (returns, trades) |

---

## Sandbox Trading Setup

The system is pre-wired for **Alpaca paper trading** (zero real money at risk).

### 1. Get Alpaca credentials

1. Sign up at <https://alpaca.markets> (free).
2. In the dashboard select **Paper Trading**.
3. Copy your **API Key** and **Secret**.

### 2. Configure environment

```bash
ALPACA_API_KEY=PKxxxxxxxxxxxxxxxxxxxxx
ALPACA_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ALPACA_BASE_URL=https://paper-api.alpaca.markets
```

### 3. Install the Alpaca SDK (already in `requirements.txt`)

```bash
pip install alpaca-py
```

### 4. Example paper order

```python
from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce
import os

client = TradingClient(
    api_key=os.environ['ALPACA_API_KEY'],
    secret_key=os.environ['ALPACA_API_SECRET'],
    paper=True,
)

order = client.submit_order(
    MarketOrderRequest(
        symbol='KO',
        qty=10,
        side=OrderSide.BUY,
        time_in_force=TimeInForce.DAY,
    )
)
print(order)
```

### Polygon.io (real-time market data)

```python
from polygon import RESTClient
import os

client = RESTClient(api_key=os.environ['POLYGON_API_KEY'])
aggs = client.get_aggs('KO', 1, 'minute', '2024-01-01', '2024-01-02')
```

---

## Strategy Overview

**Pairs Trading with Z-Score Mean Reversion**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `lookback` | 100 | Rolling window (days) for hedge ratio + spread stats |
| `entry_z` | 2.0 | Z-score threshold to open a position |
| `exit_z` | 0.5 | Z-score threshold to close a position |
| `risk_per_trade` | 2% | Maximum capital risked per trade |

**Signal logic:**

1. Compute rolling OLS hedge ratio between `ticker1` and `ticker2`.
2. Calculate spread = `price2 − hedge × price1`.
3. Normalise spread to z-score using a rolling mean/std.
4. **Long spread** when `z < −2.0` → long `ticker2`, short `ticker1`.
5. **Short spread** when `z > +2.0` → short `ticker2`, long `ticker1`.
6. **Exit** when `|z| < 0.5` (spread mean-reverts).

**Goal:** 50× return ($10 K → $500 K) through consistent edge + compounding.

---

## Backtesting

```bash
# Quick CLI run (KO / PEP, from 2018)
python main.py

# Custom pair and capital
python -c "
from backtests.backtest_pairs import run_full_backtest
run_full_backtest('MSFT', 'AAPL', initial_capital=25000)
"
```

---

## Running Tests

### Python

```bash
python -m unittest discover -s tests -p 'test*.py'
```

Tests live in `tests/` and cover:

- `test_api_contracts.py` — dashboard snapshot schema, serialisation, fallback data.
- `test_strategy.py` — signal generation, cointegration test.

### Frontend

```bash
npm run test
```

Tests live in `frontend/__tests__/` (Jest + React Testing Library).

---

## Project Structure

```
.
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root HTML shell + metadata
│   ├── page.tsx                # Main Workstation dashboard
│   └── globals.css             # Design tokens + layout CSS
├── api/                        # Vercel serverless functions
│   ├── dashboard.py
│   ├── portfolio.py
│   ├── equity.py
│   ├── regime.py
│   ├── performance.py
│   ├── positions.py
│   ├── order_flow.py
│   ├── insights.py
│   └── backtest.py
├── backend/                    # Core Python computation layer
│   ├── dashboard_service.py
│   ├── api_response.py
│   └── api_contract.py
├── components/                 # React dashboard panels
│   ├── Header.tsx
│   ├── EquityCurve.tsx
│   ├── RegimeMonitor.tsx
│   ├── PerformanceMetrics.tsx
│   ├── OrderFlowPanel.tsx
│   ├── LivePositions.tsx
│   ├── FintechTrendsPanel.tsx
│   └── ui/                     # Shared UI primitives
├── frontend/                   # Frontend-only TypeScript modules
│   ├── hooks/useApiData.ts     # Generic polling hook
│   ├── utils/api.ts            # Envelope-aware fetch wrapper
│   └── types/dashboard.ts     # API shape definitions
├── strategies/
│   └── pairs_trading.py        # Z-score pairs trading strategy
├── utils/
│   └── data_fetcher.py         # yfinance download helpers
├── backtests/
│   └── backtest_pairs.py       # Vectorised backtest runner
├── tests/                      # Python unit tests
├── main.py                     # CLI entry-point
├── requirements.txt            # Python dependencies
├── package.json                # Node dependencies + scripts
├── next.config.js
├── tailwind.config.js
└── vercel.json
```
