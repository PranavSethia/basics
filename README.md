# Project

Full-stack web application built with React (Vite), Node.js/Express, and PostgreSQL.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Vite, React Router, Axios |
| Backend  | Node.js, Express.js                 |
| Database | PostgreSQL                          |
| Auth     | JWT, bcrypt                         |
| Files    | Multer                              |

## Project Structure

```
.
├── client/                 # React (Vite) frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── pages/          # Page-level components
│       ├── components/     # Reusable UI components
│       ├── routes/         # React Router configuration
│       ├── context/        # React Context providers
│       └── services/       # Axios API service layer
│
├── server/                 # Express backend
│   ├── index.js
│   ├── package.json
│   ├── .env.example
│   ├── config/             # DB connection
│   ├── controllers/        # Route handler logic
│   ├── routes/             # Express routers
│   ├── middleware/         # Auth, error handling, etc.
│   ├── models/             # Database query functions
│   └── uploads/            # Multer file storage
│
└── database/
    ├── schema.sql          # Table definitions
    └── seed.sql            # Initial data
```

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14

### Database Setup

```bash
psql -U postgres -c "CREATE DATABASE your_database;"
psql -U postgres -d your_database -f database/schema.sql
psql -U postgres -d your_database -f database/seed.sql
```

### Backend

```bash
cd server
cp .env.example .env   # fill in your values
npm install
npm run dev            # starts on http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev            # starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000`.

## API

| Method | Path         | Description  |
|--------|--------------|--------------|
| GET    | /api/health  | Health check |
