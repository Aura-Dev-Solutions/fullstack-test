# Aura CRM - Fullstack Technical Assessment

## Start Here

This repository is both a working CRM application and a technical assessment. Before touching any code, read these three documents in order:

| # | Document | What you'll find |
|---|----------|-----------------|
| 1 | [`TECHNICAL_TEST.md`](./TECHNICAL_TEST.md) | What we're evaluating, the rules, and how to submit |
| 2 | [`POINT_SYSTEM.md`](./POINT_SYSTEM.md) | Point values, minimum requirements, and **recommended approach** |
| 3 | [`challenges/`](./challenges/) | The 10 challenges, starting with `01_code_audit.md` |

**The order matters.** The challenges are numbered intentionally — start with Challenge 1 before looking at the others. Reading the codebase before implementing is part of what we're evaluating.

Once you've read those documents, come back here for setup instructions.

---

## Project Structure

The project is organized as a monorepo with two main directories:

- `frontend/`: React application built with Vite, TypeScript, and TailwindCSS
- `backend/`: Node.js API built with Express, TypeScript, TypeORM, and PostgreSQL

## Features

- **Authentication**: User registration and login with JWT
- **Organizations**: Multi-organization support
- **Contacts**: Contact management system
- **Workflows**: Customizable sales pipeline workflows with stages
- **Deals**: Deal tracking through different pipeline stages

## Prerequisites

- Node.js (v18 or higher)
- pnpm (package manager)
- PostgreSQL database

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
PORT=4000
JWT_SECRET=your-secret-key-change-in-production
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=fullstack_db
NODE_ENV=development
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd aura-fullstack-test
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up the database:

Make sure PostgreSQL is running and create a database named `fullstack_db` (or the name specified in your environment variables).

4. Run database migrations:

```bash
pnpm --filter backend migration:run
```

5. (Optional) Seed the database with sample data:

```bash
pnpm seed
```

## Development

To run both frontend and backend in development mode:

```bash
pnpm dev
```

To run only the frontend:

```bash
pnpm dev:frontend
```

To run only the backend:

```bash
pnpm dev:backend
```

The frontend will be available at: http://localhost:5173
The backend will be available at: http://localhost:4000

## Testing

Run tests for both frontend and backend:

```bash
pnpm test
```

Run tests for frontend only:

```bash
pnpm test:frontend
```

Run tests for backend only:

```bash
pnpm test:backend
```

## Building for Production

Build both frontend and backend:

```bash
pnpm build
```

## Tech Stack

### Frontend
- React 18
- TypeScript
- React Router
- TailwindCSS
- Vite (build tool)
- Vitest (testing)

### Backend
- Node.js
- Express
- TypeScript
- TypeORM (database ORM)
- PostgreSQL
- JWT Authentication
- Bcrypt (password hashing)

## Architecture

The backend follows a clean architecture approach with:

- **Domain Layer**: Core business logic and interfaces
- **Application Layer**: Use cases that orchestrate domain objects
- **Infrastructure Layer**: Implementation details (database, authentication)
- **HTTP Layer**: Controllers and routes

The frontend uses a component-based architecture with:
- Context API for state management
- Service modules for API communication
- React Router for navigation

## API Endpoints

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Users**: `/api/users`
- **Organizations**: `/api/organizations`
- **Contacts**: `/api/contacts`
- **Workflows**: `/api/workflows`
- **Deals**: `/api/deals`
- **Health Check**: `/api/health`
