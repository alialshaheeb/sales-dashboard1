# Sales Dashboard

A sales dashboard built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Recharts**, structured using **Atomic Design** principles, powered by the real **Superstore Sales dataset** — a widely-used Kaggle retail dataset with 9,994 real orders spanning **2014–2017**.

## Data

Unlike a snapshot dataset, this one has a real `Order Date` field, so the dashboard genuinely supports a **year selector** with **monthly sales/profit/units breakdowns**, plus **category** and **top-product** drill-downs — all from real data, no fabricated time dimension.

| Field | Description |
|---|---|
| Order Date | Real order date (D/M/YYYY in the source file) |
| Category / Sub-Category | Furniture, Office Supplies, Technology (+ 17 sub-categories) |
| Sales, Profit, Quantity, Discount | Real per-order financials |
| Product Name, Product ID | Real product catalog |

Source: the "Superstore" retail dataset (also known as "Sample Superstore"), one of the most commonly used datasets in BI/dashboard tutorials (Tableau, Power BI, Kaggle notebooks). See `src/lib/data/superstore.csv`.

## What this project does

- Loads and cleans the real CSV server-side: validates every row against a Zod schema, parses the day-first `D/M/YYYY` date format (confirmed against Ship Date pairs), and skips (and counts) any malformed rows rather than silently corrupting totals.
- Aggregates 9,994 orders into:
  - **Monthly** sales/profit/units for whichever year is selected
  - **Category** totals (Furniture / Office Supplies / Technology) for that year
  - **Top 5 products per category** for that year
- Renders a `/dashboard` page with:
  - A **Year selector** — years are fetched from the data itself (`/api/sales`), not hardcoded, so the app always reflects what's actually in the dataset
  - A **metric switcher** (Sales / Profit / Units Sold)
  - A **Bar / Line / Pie** chart switcher (Recharts)
  - A **custom threshold filter** — set a minimum monthly value; months below it are dimmed on the bar chart / excluded from the pie chart
  - A **top-products table**, filterable by category
- Serves everything through an internal API route (`/api/sales?year=`) backed by a real data pipeline, consumed via a hook, never imported directly into components.
- Has **unit tests** (Vitest) for both the date-parsing logic and the aggregation logic.

## Project structure (Atomic Design)

```
src/
  app/
    api/sales/route.ts        # API route: loads CSV -> cleans -> aggregates -> JSON
    dashboard/page.tsx        # Dashboard page (composes template + organism)
    page.tsx                  # Landing page
    layout.tsx, globals.css
  components/
    atoms/                    # Button, Input, Card, Label
    molecules/                # YearSelector, ChartTypeSwitcher, MetricSelector, ThresholdFilter, StatCard, ProductRow
    organisms/                # SalesChart, TopProductsTable, SalesDashboard (composition + state)
    templates/                # DashboardTemplate (page shell/layout)
  lib/
    data/superstore.csv       # The real dataset
    domain/
      types.ts                # Order / MonthlyMetric / CategorySummary / YearSummary types
      parsing.ts               # Date + number parsing (pure, unit-tested)
      loadOrders.ts             # Server-only: reads + validates + cleans the CSV (cached)
      aggregate.ts               # Pure aggregation functions (unit-tested)
      aggregate.test.ts, parsing.test.ts
      chartColors.ts             # Shared chart color palette
    hooks/useSalesData.ts      # Client hooks: useAvailableYears, useYearSales
    utils.ts                    # Formatting helpers, cn() class merger
```

**Atomic Design mapping used here:**

| Layer | Examples | Responsibility |
|---|---|---|
| Atoms | `Button`, `Input`, `Card`, `Label` | Smallest, unstyled-logic UI primitives |
| Molecules | `YearSelector`, `ChartTypeSwitcher`, `MetricSelector`, `ThresholdFilter`, `StatCard`, `ProductRow` | Small groups of atoms with a single purpose |
| Organisms | `SalesChart`, `TopProductsTable`, `SalesDashboard` | Composed sections with real data/state |
| Templates | `DashboardTemplate` | Page layout/shell, no business logic |
| Pages | `app/dashboard/page.tsx` | Wires a template + organisms together |

## Data pipeline

```
superstore.csv (raw, real data)
   -> Papa Parse (CSV -> rows)
   -> Zod schema validation (RawOrderRowSchema) - malformed rows skipped & counted
   -> parseOrderDate() / parseNumber() - pure, unit-tested cleaning functions
   -> typed Order[] (loadOrders.ts, cached in memory)
   -> summarizeYear() / monthlyBreakdown() / categoryBreakdown() / topProductsInCategory()
      - pure, unit-tested aggregation functions, zero I/O
   -> /api/sales route -> JSON
   -> useAvailableYears() / useYearSales() hooks -> React components
```

## Getting started

### Prerequisites

- Node.js 18.18+ (Node 20+ recommended)
- npm

### Setup

```bash
npm install
npm run dev
```

- Landing page: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard

### Tests

```bash
npm run test
```

### Production build

```bash
npm run build
npm run start
```

## Enhancements included

- ✅ **Custom Filter Input** — "Min. monthly value" dims/excludes months below the threshold, for whichever metric is selected.
- ✅ **Multiple Chart Types** — Bar / Line / Pie buttons switch the Recharts component for the same underlying data.
- ✅ **API Integration** — real dataset served through `/api/sales`, consumed via `useAvailableYears` / `useYearSales`, not imported straight into components.
- ✅ **Real dataset with a real year field** — no fabricated time dimension.
- ✅ **Tests** — Vitest unit tests for both date parsing and aggregation logic (11 tests).

## Code-quality notes

- **Validated inputs**: every raw CSV row is checked against a Zod schema before being trusted; malformed rows are counted and skipped rather than silently breaking totals.
- **Confirmed date format**: the day-first `D/M/YYYY` format was verified by cross-checking Order Date vs Ship Date pairs where the day value exceeds 12 (impossible as a month) — documented in `parsing.ts` and covered by a test.
- **Pure, tested core logic**: `aggregate.ts` and `parsing.ts` have no I/O and are fully unit tested.
- **Separation of concerns**: CSV parsing, domain types, aggregation, API transport, and presentation each live in their own module.
- **No magic numbers/colors**: chart colors and metric labels are named constants (`chartColors.ts`, `CHART_METRIC_LABELS`), not inline arrays repeated across files.
- **Years aren't hardcoded**: the year selector is populated from `/api/sales`'s `availableYears()`, computed from the actual data — if the CSV changed, the UI would adapt automatically.

## Possible next steps

- Add Region/Segment filters (both are real columns in the dataset, not yet surfaced in the UI).
- Add a year-over-year comparison view (overlay multiple years on one chart).
- Add integration tests for the `/api/sales` route.
- Swap the CSV for a real database if this needs to scale beyond a single-file dataset.

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Papa Parse](https://www.papaparse.com/) (CSV parsing)
- [Zod](https://zod.dev/) (schema validation)
- [Vitest](https://vitest.dev/) (unit tests)

## Data source

Superstore Sales dataset — a standard, widely-mirrored retail dataset (9,994 orders, 2014-2017) commonly used across Kaggle notebooks, Tableau tutorials, and BI courses for exactly this kind of sales-dashboard exercise.
