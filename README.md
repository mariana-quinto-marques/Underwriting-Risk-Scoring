# RiskLens — Underwriting & Risk Scoring Platform

A web platform that helps insurers evaluate SME insurance applications and determine pricing through automated risk scoring.

## Features

- **Submission Form** — Capture business details (industry, employees, revenue, claims, location)
- **Risk Scoring Engine** — Rule-based pipeline calculating scores from 0-100
- **Premium Calculator** — Revenue-based pricing adjusted by risk multiplier
- **Underwriting Explanation** — Transparent rule-by-rule breakdown
- **Portfolio Dashboard** — Risk distribution, industry breakdown, KPI cards

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Recharts |
| Backend | Python, FastAPI, SQLAlchemy, SQLite |

## Quick Start

```bash
# Install dependencies
make install

# Seed demo data (45 sample submissions)
make seed

# Start both servers
make dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs

## Prerequisites

- Python 3.9+
- Node.js 18+

## Risk Scoring Rules

| Rule | Impact |
|------|--------|
| Base Score | +50 |
| Industry (construction highest, technology lowest) | -0 to +20 |
| Claims History (0-5+ claims) | -10 to +25 |
| Revenue (>5M favourable) | -10 to +5 |
| Employee Count | -5 to +10 |
| Location Risk | -5 to +20 |

**Thresholds**: Score 0-40 = Approved, 41-70 = Referred, 71-100 = Declined

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/submissions | Create new submission |
| GET | /api/submissions | List submissions (paginated) |
| GET | /api/submissions/:id | Get submission detail |
| GET | /api/portfolio/summary | Portfolio analytics |
| GET | /api/health | Health check |
