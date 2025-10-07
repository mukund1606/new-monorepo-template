# check=skip=SecretsUsedInArgOrEnv
# Single container for both web and server
FROM oven/bun:1.2.22

# Install pnpm alongside bun
RUN bun add -g pnpm

ARG DATABASE_URL
ARG BETTER_AUTH_URL
ARG BETTER_AUTH_SECRET
ARG VITE_SERVER_URL
ARG CLIENT_URL

ENV DATABASE_URL=$DATABASE_URL
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV CLIENT_URL=$CLIENT_URL

# Set working directory
WORKDIR /app

# Copy workspace configuration and lockfile
COPY . .

# Install dependencies (this will install all workspace dependencies)
RUN pnpm install

# Build all applications
RUN pnpm run build

# Set environment
ENV NODE_ENV=production

# Start both services
CMD ["pnpm", "run", "start"]
