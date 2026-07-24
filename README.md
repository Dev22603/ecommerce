# Ecommerce

A full stack ecommerce application with a React frontend, an Express API, and a PostgreSQL database managed through Prisma.

## Stack

- Frontend: React 18, Vite, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Prisma
- Database: PostgreSQL
- Authentication: JSON Web Tokens

## Prerequisites

Install these tools before starting:

- Git
- Node.js 20 or newer
- npm
- PostgreSQL

Verify the installations:

```bash
git --version
node --version
npm --version
psql --version
```

## Quick start

### 1. Clone the repository

```bash
git clone https://github.com/Dev22603/ecommerce.git
cd ecommerce
```

### 2. Create the PostgreSQL database

Using the PostgreSQL command line:

```bash
createdb ecommerce
```

If `createdb` is unavailable, open `psql` or pgAdmin and create a database named `ecommerce`.

### 3. Set up the backend

```bash
cd Backend
npm install
```

Create a local environment file.

macOS or Linux:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Open `Backend/.env` and update the database credentials and JWT secret:

```env
PORT=5000
NODE_ENV=development
LOG_LEVEL=INFO
DATABASE_URL=postgresql://postgres:your-password@localhost:5432/ecommerce
JWT_SECRET=replace-with-a-long-random-secret
API_URL=http://localhost:5000/api
FRONTEND_URL=http://localhost:5173
```

Apply the database migration and load sample categories and products (seed does not create users):

```bash
npm run db:generate
npm run db:migrate:prod
npm run db:seed
```

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Check it at `http://localhost:5000/health`.

### 4. Set up the frontend

Open a second terminal from the repository root:

```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173`, then create an account with the signup page. The seed data only includes categories and products.

## Common commands

Run backend commands from `Backend`:

```bash
npm run dev              # Start the API with file watching
npm run build            # Compile TypeScript
npm start                # Run the compiled API
npm run db:generate      # Regenerate the Prisma client
npm run db:migrate       # Create and apply a development migration
npm run db:migrate:prod  # Apply existing migrations
npm run db:seed          # Insert sample categories and products
npm run db:studio        # Open Prisma Studio
```

Run frontend commands from `Frontend`:

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build
```

## Project structure

```text
ecommerce/
|-- Backend/
|   |-- prisma/       Database schema, migrations, and seed data
|   `-- src/          Express API, services, repositories, and middleware
|-- Frontend/
|   |-- router/       Application routing
|   `-- src/          React components, pages, context, and API services
`-- README.md
```

## Troubleshooting

### Database connection fails

Confirm PostgreSQL is running and that `DATABASE_URL` in `Backend/.env` contains the correct username, password, host, port, and database name.

### The frontend cannot reach the API

Confirm the backend is running on port `5000` and `FRONTEND_URL` is set to `http://localhost:5173`.

### Prisma reports an outdated client

Run:

```bash
cd Backend
npm run db:generate
```

### Port already in use

Stop the process using port `5000` or `5173`. If you change the backend port, update the frontend API URLs as well.
