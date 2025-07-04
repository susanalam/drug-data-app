# Drug Data Application

A full-stack application for managing drug information with a Next.js frontend and FastAPI backend.

## Quick Start (Development)

### Backend
```bash
cd scripts/backend
docker-compose up drug-api-sqlite
```

### Frontend
```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Production Deployment Steps

### 1. Security & Environment Setup

**Create environment files:**
```bash
# Backend
cp scripts/backend/.env scripts/backend/.env.production
# Frontend  
cp .env.local .env.production.local
```

**Update backend config:**
- Set `SECRET_KEY` to a strong 32+ character string
- Set `CORS_ORIGINS` to your frontend domain
- Set `DEBUG=false`

**Update frontend config:**
- Set `NEXT_PUBLIC_API_URL` to your backend domain

### 2. Database Setup

**Use PostgreSQL for production:**
```bash
cd scripts/backend
docker-compose --profile postgres up -d
```

**Or deploy with production compose:**
```bash
# Create production compose file
cp docker-compose.yml docker-compose.prod.yml
# Update with production settings
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Frontend Build & Deploy

**Build for production:**
```bash
npm run build
npm start
```

**Or deploy to Vercel/Netlify:**
```bash
# Add build command to package.json
npm run build
```

## Health Checks

- Backend: `http://localhost:8000/health`
- Frontend: `http://localhost:3000`

## Environment Variables

### Backend (.env.production)
```
SECRET_KEY=your-strong-secret-key-here
CORS_ORIGINS=https://your-frontend-domain.com
DEBUG=false
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### Frontend (.env.production.local)
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_ENVIRONMENT=production
```

## Docker Commands

```bash
# Development
docker-compose up drug-api-sqlite

# Production
docker-compose --profile postgres up -d

# Build image
docker build -t drug-data-api .

# Run container
docker run -p 8000:8000 drug-data-api
```

## Project Structure

```
├── app/                 # Next.js frontend pages
├── components/          # React components
├── lib/                # Frontend utilities
├── scripts/backend/    # FastAPI backend
│   ├── app.py         # Main API
│   ├── models.py      # Database models
│   ├── schemas.py     # Pydantic schemas
│   └── docker-compose.yml
└── package.json       # Frontend dependencies
```

## API Endpoints

- `GET /api/drugs` - List all drugs
- `POST /api/drugs` - Create new drug
- `GET /api/drugs/{id}` - Get drug by ID
- `PUT /api/drugs/{id}` - Update drug
- `DELETE /api/drugs/{id}` - Delete drug
- `GET /api/categories` - List categories
- `GET /health` - Health check

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** FastAPI, SQLAlchemy, Pydantic
- **Database:** SQLite (dev), PostgreSQL (prod)
- **Deployment:** Docker, Docker Compose 