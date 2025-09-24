FROM oven/bun:1

ARG NEXT_PUBLIC_BASE_URL
ARG DATABASE_URL
ARG AUTH_SECRET

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV AUTH_SECRET=$AUTH_SECRET

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

# Start both services using PM2
CMD ["bun", "start"]
