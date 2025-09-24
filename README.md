# My Monorepo

A full-stack application with server and web components using Bun, React, and Hono.

## Prerequisites

- Docker and Docker Compose
- A PostgreSQL database (connection string required)

## Environment Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your database connection and other required values:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `AUTH_SECRET`: A secure random string for authentication
   - Other values can remain as defaults for local development

## Running with Docker

1. Build and start the services:

   ```bash
   docker-compose up --build
   ```

2. For detached mode (running in background):

   ```bash
   docker-compose up -d --build
   ```

3. Stop the services:
   ```bash
   docker-compose down
   ```

## Services

- **Next.js**: React fullstack running on port 3000

## Development

For local development without Docker:

1. Install dependencies:

   ```bash
   bun install
   ```

2. Start development servers:

   ```bash
   # Start all services
   bun run dev
   ```

## Environment Variables

See `.env.example` for all required environment variables.
