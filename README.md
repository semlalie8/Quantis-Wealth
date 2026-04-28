# 🧠 Quantis — Quantis Wealth Platform

> An AI-driven, full-stack portfolio management platform that combines **Modern Portfolio Theory**, **Reinforcement Learning**, and **real-time risk analytics** to optimize multi-asset allocations.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

- **Smart Rebalancing** — RL-augmented mean-variance optimization engine
- **Risk Analytics** — VaR, CVaR, Sharpe Ratio, Max Drawdown, Beta, Diversification Score
- **Premium Dashboard** — Glassmorphism dark-mode UI with Recharts & Framer Motion
- **Real-Time Holdings** — Live portfolio tracking with 24h change indicators
- **Allocation Visualization** — Interactive donut charts with asset breakdowns
- **Decision Audit Trail** — Full history of AI allocation decisions with reasoning
- **Type-Safe API** — Zod-validated Express endpoints with Prisma ORM

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** running locally on port 5432

### 1. Clone & Install

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Configure Database

Edit `server/.env` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/smart_portfolio?schema=public"
PORT=5000
NODE_ENV=development
```

### 3. Run Migrations

```bash
cd server
npx prisma migrate dev --name init
```

### 4. Seed Market Data

```bash
# Start the server first, then in another terminal:
curl -X POST http://localhost:5000/api/assets/seed
```

### 5. Run Development Servers

```bash
# Terminal 1 — Backend API
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📐 Architecture

```
client/                          server/
├── src/                         ├── prisma/schema.prisma
│   ├── App.tsx                  ├── src/
│   ├── components/              │   ├── index.ts
│   │   ├── ui/                  │   ├── routes/
│   │   │   ├── GlassCard        │   │   ├── portfolioRoutes
│   │   │   ├── StatCard         │   │   ├── assetRoutes
│   │   │   └── NavItem          │   │   └── userRoutes
│   │   └── charts/              │   ├── controllers/
│   │       ├── PerformanceChart  │   │   ├── PortfolioController
│   │       └── AllocationDonut   │   │   ├── AssetController
│   └── lib/                     │   │   └── UserController
│       ├── api.ts               │   └── services/
│       └── utils.ts             │       ├── OptimizationService
└── tailwind.config.js           │       └── RiskService
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/assets/seed` | Seed 12 assets with 30-day price history |
| `GET` | `/api/assets` | List all assets |
| `GET` | `/api/assets/search?q=` | Search assets |
| `POST` | `/api/portfolios` | Create portfolio |
| `POST` | `/api/portfolios/:id/optimize` | **AI Smart Rebalance** |
| `GET` | `/api/portfolios/:id/risk-analysis` | **MPT Risk Analysis** |

---

## 📊 Financial Algorithms

### Optimization Engine
Combines simulated **Reinforcement Learning** with **Mean-Variance Optimization**:
- Scores assets by `(avgReturn × riskTolerance) / volatility`
- Enforces minimum 5% diversification floor
- Returns Sharpe-optimal weights

### Risk Engine
- **Value at Risk (95%, 99%)** — Parametric VaR
- **Conditional VaR** — Expected Shortfall
- **Sharpe Ratio** — Risk-adjusted returns (4.5% risk-free rate)
- **Max Drawdown** — Peak-to-trough loss measurement
- **Beta** — Systematic risk vs benchmark
- **Risk Grading** — A (Conservative) → D (Speculative)

---

## 📝 License

MIT
