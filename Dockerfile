
FROM node:24-slim AS base
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm

# 1. Install dependencies
FROM base as deps
# Copy dependency definitions
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# 2. Build the application
FROM base as builder

# Copy dependencies from the 'deps' stage
COPY --link --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# 3. Run the application
FROM base

# Copy built app from the 'builder' stage
COPY --link --from=builder /app/public ./public
COPY --link --from=builder /app/.next ./.next
COPY --link --from=builder /app/node_modules ./node_modules
COPY --link --from=builder /app/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]
