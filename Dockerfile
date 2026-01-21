# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY tsconfig.json ./
COPY src/ ./src/
COPY domains/ ./domains/

# Build
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm for production dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built files and domains
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/domains ./domains

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcp -u 1001

USER mcp

# Health check (for container orchestrators)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "console.log('healthy')" || exit 1

# Set environment
ENV NODE_ENV=production

# Entry point
ENTRYPOINT ["node", "dist/index.js"]

# Labels
LABEL org.opencontainers.image.title="MCP SSDLC Security Toolkit"
LABEL org.opencontainers.image.description="Domain-agnostic SSDLC Planning MCP Server"
LABEL org.opencontainers.image.version="2.0.0"
LABEL org.opencontainers.image.source="https://github.com/vuongdat67/mcp_ssdlc"
LABEL org.opencontainers.image.licenses="MIT"
