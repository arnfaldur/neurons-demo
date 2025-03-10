FROM node:23-slim AS build

WORKDIR /app

# Define build arguments
ARG VITE_API_BASE_URL

# Set environment variables
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy package files
COPY app/package.json app/pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY app/ ./

# Build website
run pnpm build


# Production stage
FROM nginx:alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add nginx configuration for SPA routing
RUN echo 'server { \
    listen 3000; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
