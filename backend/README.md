# 🚀 Price Pulse — Intelligent Pricing Engine

## 📌 Overview

Price Pulse is a full-stack pricing intelligence dashboard that provides:
- **AI-powered price recommendations** based on competitor pricing and market demand
- **Competitor price tracking** with visual analytics
- **Price simulation** with adjustable demand sensitivity
- **Price history logging** with trend analysis
- **Multi-currency support** (INR, USD, EUR, GBP)

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite + TailwindCSS 4 |
| **Backend** | Flask + Gunicorn |
| **Database** | PostgreSQL (Neon Cloud) |
| **Charts** | Recharts + Chart.js |
| **Deployment** | Render (API) + Vercel (Frontend) |

## ⚙️ Local Development Setup

### 1. Clone & Install

```bash
git clone <repo_url>
cd price-pulse
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file (see `.env.example`):
```
DATABASE_URL=postgresql://...your_neon_url...
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
FLASK_ENV=development
PORT=5000
```

Run:
```bash
python app.py
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and connects to the backend at `http://127.0.0.1:5000`.

### 4. Database Seeding

To seed the database with sample data:
```bash
cd backend
python import_csv.py
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/dashboard` | All products with pricing data |
| GET | `/competitors/<id>` | Competitors for a product |
| GET | `/comparison/<id>` | Price comparison for a product |
| GET | `/recommendation/<id>` | AI price recommendation |
| GET | `/history/<id>` | Price history for a product |
| POST | `/simulate` | Simulate pricing with custom inputs |

## 📤 Response Format

```json
{ "status": "success", "data": { ... } }
```

Error:
```json
{ "status": "error", "message": "Error description" }
```

## 🧠 Pricing Engine (V5.1)

The deterministic pricing formula:
```
recommended = min_competitor_price × (0.97 + 0.06 × demand)
```

- **demand = 0.0** → 3% below competitor (aggressive undercut)
- **demand = 0.5** → match competitor price
- **demand = 1.0** → 3% above competitor (premium surge)
- **Floor**: Never drops below 85% of your base price

## 🚀 Production Deployment

- **Backend**: Deploy `backend/` to [Render](https://render.com) (see `render.yaml`)
- **Frontend**: Deploy `frontend/` to [Vercel](https://vercel.com) (see `vercel.json`)
- **Database**: Already hosted on [Neon](https://neon.tech)

See the deployment guide for step-by-step instructions.

## 📁 Project Structure

```
price-pulse/
├── backend/
│   ├── app.py              # Flask API server
│   ├── db.py               # Database connection
│   ├── pricing.py          # Pricing engine (V5.1)
│   ├── import_csv.py       # Database seeding script
│   ├── products.csv        # Sample product data
│   ├── competitors.csv     # Sample competitor data
│   ├── requirements.txt    # Python dependencies
│   ├── Procfile            # Render deployment
│   └── .env.example        # Environment template
├── frontend/
│   ├── src/
│   │   ├── Pagess/         # Page components
│   │   ├── components/     # Reusable components
│   │   ├── utils/          # Currency utilities
│   │   ├── api.js          # API client
│   │   └── App.jsx         # Root component
│   ├── vercel.json         # Vercel deployment config
│   └── package.json
├── ml-model/               # ML training scripts (offline)
│   ├── train.py
│   ├── evaluate.py
│   └── predict.py
└── render.yaml             # Render blueprint
```