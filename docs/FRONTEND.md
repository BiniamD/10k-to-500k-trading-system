# Frontend Documentation

> **10K → 500K Trading System** — Bloomberg-style algorithmic trading dashboard built with Next.js 14, React 18, TypeScript, Recharts, and Tailwind CSS.

---

## Table of Contents

1. [How It Works](#how-it-works)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Workstation Layout](#workstation-layout)
5. [Panels & Features](#panels--features)
   - [Header](#1-header)
   - [Equity Curve](#2-equity-curve)
   - [Market Regime Monitor](#3-market-regime-monitor)
   - [Order Flow Panel](#4-order-flow-panel)
   - [Performance Metrics](#5-performance-metrics)
   - [Live Positions](#6-live-positions)
   - [Signals (FintechTrendsPanel)](#7-signals-fintechtrends-panel)
6. [Data Flow](#data-flow)
7. [API Hook — `useApiData`](#api-hook--useapidata)
8. [API Client — `fetchApi`](#api-client--fetchapi)
9. [TypeScript Types](#typescript-types)
10. [UI Primitives](#ui-primitives)
11. [Design Tokens (CSS Variables)](#design-tokens-css-variables)
12. [Testing](#testing)
13. [Dev Commands](#dev-commands)
14. [Adding a New Panel](#adding-a-new-panel)

---

## How It Works

The frontend is a **Next.js App Router** application. On first load it renders a Bloomberg-style Workstation layout. Each panel independently polls its own backend API endpoint on a configurable interval using the `useApiData` hook.

```
Browser
  └── app/page.tsx  (Workstation layout)
        ├── Header              → polls /api/portfolio   every 5 s
        ├── RegimeMonitor       → polls /api/regime      every 5 s
        ├── OrderFlowPanel      → polls /api/order_flow  every 5 s
        ├── EquityCurve         → polls /api/equity      every 5 s
        ├── PerformanceMetrics  → polls /api/performance every 30 s
        ├── LivePositions       → polls /api/positions   every 10 s
        └── FintechTrendsPanel  → polls /api/insights    every 15 s
```

Every response from the backend is a **versioned JSON envelope**:

```json
{
  "schemaVersion": "1.0.0",
  "generatedAt": "2025-01-15T10:30:00Z",
  "data": { ... }
}
```

The `fetchApi` utility unwraps the envelope automatically, so each component only sees the typed `data` field.

If a request fails (network error, 5xx, etc.) the hook retries after 2 seconds and surfaces a human-readable error message inside the panel — the rest of the dashboard continues working normally.

---

## Tech Stack

| Layer | Library | Version |
|-------|---------|---------|
| Framework | Next.js (App Router) | 14.x |
| UI | React | 18.x |
| Language | TypeScript | 5.x |
| Charts | Recharts | 2.x |
| Icons | Lucide React | 0.441.x |
| Animation | Framer Motion | 11.x |
| Date utils | date-fns | 3.x |
| Styling | CSS variables + Tailwind CSS | 3.x |
| Testing | Jest + React Testing Library | 29/16 |
| Linting | ESLint (next/core-web-vitals) | 8.x |

---

## Folder Structure

```
.
├── app/
│   ├── page.tsx          ← Main Workstation page (entry point)
│   ├── layout.tsx        ← Root HTML shell, metadata
│   └── globals.css       ← Design tokens + all layout CSS
│
├── components/           ← Dashboard panels (React)
│   ├── Header.tsx
│   ├── EquityCurve.tsx
│   ├── RegimeMonitor.tsx
│   ├── OrderFlowPanel.tsx
│   ├── PerformanceMetrics.tsx
│   ├── LivePositions.tsx
│   ├── FintechTrendsPanel.tsx
│   └── ui/               ← Shared UI primitives
│       ├── Panel.tsx
│       ├── StatusBadge.tsx
│       └── MetricTile.tsx
│
└── frontend/             ← Frontend-only TypeScript modules
    ├── hooks/
    │   └── useApiData.ts ← Generic polling + retry hook
    ├── utils/
    │   └── api.ts        ← Envelope-aware fetch wrapper
    ├── types/
    │   └── dashboard.ts  ← All API shape definitions
    └── __tests__/        ← Jest + RTL unit tests
        ├── PerformanceMetrics.test.tsx
        └── RegimeMonitor.test.tsx
```

> **Note:** The `.gitignore` `lib/` rule would hide files in `frontend/lib/`. Shared code lives in `frontend/utils/` instead.

---

## Workstation Layout

The main page (`app/page.tsx`) uses the **Workstation** layout — a Bloomberg-style split screen:

```
┌─────────────────────────────────────────────────────────────────┐
│  Header  (sticky — portfolio equity, P&L, risk budget, status)  │
├──────────────────┬──────────────────────────────────────────────┤
│                  │  Equity Curve  (area chart + benchmark line)  │
│  Market Regime   ├──────────────────────────────────────────────┤
│  (30% width)     │  [ Performance ] [ Positions ] [ Signals ]   │
│                  │  ─────────── tab content ──────────────────  │
│  Order Flow      │                                               │
│                  │                                               │
└──────────────────┴──────────────────────────────────────────────┘
```

- **Left column (30%)** — always-visible `RegimeMonitor` above `OrderFlowPanel`.
- **Right column (70%)** — `EquityCurve` fills the top; a tab bar switches the bottom between `PerformanceMetrics`, `LivePositions`, and `FintechTrendsPanel`.
- On screens narrower than 768 px the columns stack vertically.

---

## Panels & Features

### 1. Header

**File:** `components/Header.tsx`  
**API:** `GET /api/portfolio` — refresh every **5 s**

Sticky top bar that shows the live account state at a glance.

| Field | Description |
|-------|-------------|
| **Equity** | Current total portfolio value in USD |
| **Session P&L** | Dollar and percentage change since session open |
| **Risk Budget** | What percentage of the risk budget has been consumed |
| **Status badges** | Risk level (OK / MED / HIGH), session status (Live / Connecting), live indicator dot |

Color logic:
- Risk budget ≥ 85% → **red** (critical)
- Risk budget ≥ 65% → **amber** (warning)
- Otherwise → **green** (healthy)

---

### 2. Equity Curve

**File:** `components/EquityCurve.tsx`  
**API:** `GET /api/equity` — refresh every **5 s**

Recharts `AreaChart` with three data series drawn over the selected timeframe.

**Features:**
- **Timeframe selector** — toggle between `1H`, `4H`, and `1D` views.
- **Stat bar** — shows current Equity ($), Session change (%), and current Drawdown (%).
- **Three chart lines:**
  - Cyan area — strategy equity curve
  - Dashed grey line — buy-and-hold benchmark (KO/PEP reference)
  - Red line — rolling drawdown
- **Reference line** — horizontal dashed line at opening equity.
- **Custom tooltip** — formats equity as `$xx,xxx.xx` and drawdown as `xx.xx%`.
- **Legend** — colour-coded line labels below the chart.
- Drawdown turns **red** when it exceeds 5%.

---

### 3. Market Regime Monitor

**File:** `components/RegimeMonitor.tsx`  
**API:** `GET /api/regime` — refresh every **5 s**

Reads current market regime from the pairs-trading z-score model.

**Features:**
- **State display** — large monospace label: `CALM`, `BUSY`, or `VOLATILE`.
  - CALM → green; BUSY → amber; VOLATILE → red.
- **Confidence bar** — animated progress bar showing model confidence (0–100%).
- **VPIN tile** — Volume-Synchronised Probability of Informed Trading (0–1 scale).
- **Imbalance tile** — signed order-flow imbalance percentage (green if positive, red if negative).
- **Strategy message** — plain-English instruction derived from the current regime, e.g. _"Reduce order size and enforce wider slippage controls."_
- Live `aria-live` region so screen readers announce regime changes.

---

### 4. Order Flow Panel

**File:** `components/OrderFlowPanel.tsx`  
**API:** `GET /api/order_flow` — refresh every **5 s**

Visualises buy vs. sell pressure from the rolling order-flow estimate.

**Features:**
- **BUY pressure bar** — green progress bar with volume count and percentage.
- **SELL pressure bar** — red progress bar with volume count and percentage.
- **Total Flow tile** — combined buy + sell volume.
- **Imbalance tile** — deviation from 50/50 neutral (green if buy-heavy, red if sell-heavy).
- **Action Cue tile** — one of three values:
  - `Lean Long` — buy pressure ≥ 58%
  - `Defensive` — buy pressure ≤ 45%
  - `Balanced` — otherwise
- Header badge changes tone: positive (lean long), critical (defensive), warning (balanced).

---

### 5. Performance Metrics

**File:** `components/PerformanceMetrics.tsx`  
**API:** `GET /api/performance` — refresh every **30 s**

A responsive grid of metric tiles showing the strategy's risk/return statistics.

**Features:**

| Metric | Description |
|--------|-------------|
| **Win Rate** | % of active days where the strategy returned > 0 |
| **Sharpe Ratio** | Annualised risk-adjusted return (rolling estimate) |
| **Max Drawdown** | Peak-to-trough percentage decline |
| **Profit Factor** | Gross gains ÷ gross losses |
| **Avg Trade** | Average P&L per completed trade |
| **Total Trades** | Number of completed entry→exit cycles |

Each tile shows a label, a bold monospace value, and a colour-coded sub-label (green = positive, red = negative, grey = neutral).

The grid is automatically sized: up to 6 equal columns on wide screens, wrapping on narrow screens.

---

### 6. Live Positions

**File:** `components/LivePositions.tsx`  
**API:** `GET /api/positions` — refresh every **10 s**

A sortable table of currently open positions. Shows "No open positions" when the model is flat.

**Table columns:**

| Column | Description |
|--------|-------------|
| **Symbol** | Ticker and side (LONG / SHORT in green / red) + risk label |
| **Qty** | Number of shares/units held |
| **Entry** | Price at which the position was opened |
| **Mark** | Latest market price |
| **P&L** | Unrealised P&L in dollars (`+$xx` / `-$xx`) and as a percentage |

Header badge shows the open position count with a pulsing dot when positions are live.

---

### 7. Signals (FintechTrendsPanel)

**File:** `components/FintechTrendsPanel.tsx`  
**API:** `GET /api/insights` — refresh every **15 s**

An auto-grid of signal/alert cards generated by the backend from the live strategy state.

**Features:**
- Cards are colour-coded by **severity**:
  - Cyan left border → `INFO`
  - Amber left border → `WARNING`
  - Red left border → `CRITICAL`
- Each card shows a **title**, a **detail** sentence, and a severity badge.
- Typical signals include:
  - Signal Confidence — current z-score and regime confidence %
  - Latency Watch — API contract health
  - Risk Trigger — current max drawdown vs. risk posture
  - Execution Bias — order-flow buy pressure direction
- Panel adapts to any number of signals with `auto-fill` grid columns.

---

## Data Flow

```
Backend Python
  └─ dashboard_service.py  builds full snapshot (20 s TTL cache)
        │
        ▼
Vercel Serverless Functions (/api/*.py)
  └─ api_response.py  wraps payload in { schemaVersion, generatedAt, data }
        │
        ▼ HTTP GET (JSON)
frontend/utils/api.ts  (fetchApi)
  └─ unwraps envelope → returns typed data, or throws Error
        │
        ▼
frontend/hooks/useApiData.ts  (useApiData)
  └─ manages loading / error / data state, polling interval, 2-s retry
        │
        ▼
React Component
  └─ renders live data, loading skeleton, or error message
```

---

## API Hook — `useApiData`

**File:** `frontend/hooks/useApiData.ts`

A generic React hook for polling any JSON API endpoint.

```ts
const { data, loading, error } = useApiData<T>(path, refreshMs);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `string` | API URL path, e.g. `'/api/regime'` |
| `refreshMs` | `number` (optional) | Poll interval in milliseconds. `0` = fetch once only. |

| Return | Type | Description |
|--------|------|-------------|
| `data` | `T \| null` | The unwrapped typed payload, or `null` on first load |
| `loading` | `boolean` | `true` while the first request is in flight |
| `error` | `string \| null` | Human-readable error message, or `null` |

**Behaviour:**
- Uses `AbortController` to cancel in-flight requests when the component unmounts.
- On failure, waits 2 seconds then retries automatically.
- Cleans up poll intervals and retry timers on unmount — no memory leaks.

---

## API Client — `fetchApi`

**File:** `frontend/utils/api.ts`

```ts
const data = await fetchApi<T>(path, signal?);
```

Handles the versioned envelope protocol:

1. `fetch(path)` with `Accept: application/json`.
2. If HTTP status is not OK → throws with the error message from the envelope (or a generic status code message).
3. If JSON parse fails → throws `'Invalid JSON response from API'`.
4. If the response contains an `error` key → throws with `payload.error.message`.
5. If the response contains a `data` key → returns `payload.data` as `T`.
6. Otherwise → throws `'Unexpected API response shape'`.

This means components **never see the envelope wrapper** — they only deal with the clean typed data.

---

## TypeScript Types

**File:** `frontend/types/dashboard.ts`

All API payload shapes are declared here and imported by both hooks and components.

| Type | Used by |
|------|---------|
| `ApiEnvelope<T>` | `fetchApi` — wraps any successful data payload |
| `ApiErrorEnvelope` | `fetchApi` — error response shape |
| `HeaderData` | `Header` component |
| `EquityData` / `EquityPoint` | `EquityCurve` component |
| `RegimeData` | `RegimeMonitor` component |
| `PerformanceData` / `PerformanceMetric` | `PerformanceMetrics` component |
| `OrderFlowData` | `OrderFlowPanel` component |
| `PositionsData` / `PositionItem` | `LivePositions` component |
| `InsightsData` / `InsightItem` | `FintechTrendsPanel` component |
| `Tone` | `StatusBadge`, `MetricTile`, `PerformanceMetric` |

---

## UI Primitives

### `Panel`

**File:** `components/ui/Panel.tsx`

A `<section>` wrapper that every dashboard panel uses. Provides a consistent header row and body area.

```tsx
<Panel title="My Panel" actions={<StatusBadge ... />}>
  {/* panel content */}
</Panel>
```

Props:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✅ | Heading text (also sets `aria-label`) |
| `actions` | `ReactNode` | — | Right-side content (badges, buttons) |
| `children` | `ReactNode` | ✅ | Panel body content |
| `className` | `string` | — | Extra CSS classes (e.g. grid span) |

---

### `StatusBadge`

**File:** `components/ui/StatusBadge.tsx`

A small inline pill used to show live status, severity, or metric delta.

```tsx
<StatusBadge label="LIVE" tone="positive" dot />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Badge text |
| `tone` | `'positive' \| 'warning' \| 'critical' \| 'info'` | `'info'` | Colour theme |
| `dot` | `boolean` | `false` | Shows a small filled circle before the label |

Tone colours:
- `positive` → green (`--green`)
- `warning` → amber (`--amber`)
- `critical` → red (`--red`)
- `info` → cyan (`--cyan`)

---

### `MetricTile`

**File:** `components/ui/MetricTile.tsx`

A card for a single metric with a label, value, and optional delta line.

```tsx
<MetricTile label="Sharpe" value="2.41" delta="+0.12" tone="positive" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Metric name |
| `value` | `string` | — | Formatted value |
| `delta` | `string` | — | Optional change annotation |
| `tone` | `'positive' \| 'negative' \| 'neutral'` | `'neutral'` | Delta colour |

---

## Design Tokens (CSS Variables)

All colours, fonts, and spacing units are defined as CSS custom properties in `app/globals.css`. Use them in inline styles and CSS classes instead of hardcoded values.

### Backgrounds

| Variable | Value | Use |
|----------|-------|-----|
| `--bg-page` | `#07090f` | Full-page background |
| `--bg-surface` | `#0d1117` | Panel/card surfaces |
| `--bg-raised` | `#111827` | Slightly elevated elements |
| `--bg-inset` | `#0a0e18` | Inset stats, metric tiles |

### Borders

| Variable | Value | Use |
|----------|-------|-----|
| `--border` | `#1f2d45` | Primary borders |
| `--border-muted` | `#152030` | Subtle separators |

### Text

| Variable | Value | Use |
|----------|-------|-----|
| `--text` | `#dce8ff` | Primary text |
| `--text-dim` | `#7a90b0` | Secondary/muted text |
| `--text-muted` | `#3d5070` | Labels, placeholders |

### Signal Colours

| Variable | Value | Use |
|----------|-------|-----|
| `--green` | `#00d97e` | Positive / LONG / profit |
| `--red` | `#ff3355` | Negative / SHORT / loss / VOLATILE |
| `--amber` | `#f5a623` | Warning / BUSY |
| `--cyan` | `#00b8ff` | Brand / equity line / INFO / links |
| `--purple` | `#7c6cff` | Accent |

### Typography

| Variable | Use |
|----------|-----|
| `--font-mono` | Numbers, tickers, prices (`JetBrains Mono`, `Fira Code`, `ui-monospace`) |
| `--font-ui` | Labels and UI text (`Inter`, system-ui) |

---

## Testing

Tests live in `frontend/__tests__/` and use **Jest** with **React Testing Library**.

```bash
npm run test
```

### What is tested

| File | Component | Tests |
|------|-----------|-------|
| `PerformanceMetrics.test.tsx` | `PerformanceMetrics` | Renders all 4 key metric labels from mocked API data |
| `RegimeMonitor.test.tsx` | `RegimeMonitor` | Renders without crashing; shows Confidence label |

All tests mock `useApiData` via `jest.mock(...)` so no real HTTP calls are made.

### Running with coverage

```bash
npx jest --coverage
```

### Adding a test

Create a new file in `frontend/__tests__/` following the existing pattern:

```tsx
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';
import { useApiData } from '@/frontend/hooks/useApiData';

jest.mock('@/frontend/hooks/useApiData', () => ({ useApiData: jest.fn() }));

describe('MyComponent', () => {
  beforeEach(() => {
    (useApiData as jest.Mock).mockReturnValue({
      loading: false, error: null, data: { /* mock data */ },
    });
  });

  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText(/My Panel Title/i)).toBeInTheDocument();
  });
});
```

---

## Dev Commands

```bash
# Start dev server (hot reload)
npm run dev           # http://localhost:3000

# Production build
npm run build

# Serve production build locally
npm run start

# Lint (ESLint next/core-web-vitals)
npm run lint

# Run all frontend tests
npm run test
```

---

## Adding a New Panel

Follow these steps to add a new panel to the Workstation:

1. **Create the API endpoint** — add `api/my_panel.py` following the pattern in `api/regime.py`.

2. **Add a TypeScript type** — in `frontend/types/dashboard.ts`:
   ```ts
   export interface MyPanelData {
     someField: number;
   }
   ```

3. **Create the component** — in `components/MyPanel.tsx`:
   ```tsx
   'use client';
   import Panel from '@/components/ui/Panel';
   import { useApiData } from '@/frontend/hooks/useApiData';
   import { MyPanelData } from '@/frontend/types/dashboard';

   export default function MyPanel() {
     const { data, loading, error } = useApiData<MyPanelData>('/api/my_panel', 10000);
     return (
       <Panel title="My Panel">
         {error   ? <p>{error}</p> :
          loading ? <p>Loading…</p> :
                    <div>{data?.someField}</div>}
       </Panel>
     );
   }
   ```

4. **Add to the Workstation layout** — import and place the component in `app/page.tsx`.

5. **Write a test** — add a file in `frontend/__tests__/MyPanel.test.tsx`.
