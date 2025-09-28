# check=skip=SecretsUsedInArgOrEnv
# Single container for both web and server
FROM oven/bun:1.2.22

ARG DATABASE_URL
ARG BETTER_AUTH_URL
ARG BETTER_AUTH_SECRET

ENV DATABASE_URL=$DATABASE_URL
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET

# Set working directory
WORKDIR /app

# Copy workspace configuration and lockfile
COPY . .

# Install dependencies (this will install all workspace dependencies)
RUN bun install

# Build all applications
RUN bunx turbo run build

# Expose ports for both services
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start both services
CMD ["bun", "run", "start"]
