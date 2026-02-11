---
title: "Docker Multi-Stage Builds: Optimizing Your Container Images"
slug: "docker-multi-stage-builds-optimization"
excerpt: "Reduce your Docker image sizes by up to 90% using multi-stage builds. Learn practical patterns for Node.js, Go, and Python applications."
author: "Ranjithprabhu K"
date: 2026-02-08
updated: 2026-02-08
category: "DevOps"
tags: ["docker", "containers", "devops", "optimization"]
featuredImage: "./assets/hero.jpg"
readingTime: 6
draft: false
seo:
  ogImage: "./assets/hero.jpg"
  canonicalUrl: ""
---

# Docker Multi-Stage Builds: Optimizing Your Container Images

Large Docker images slow down deployments, waste storage, and increase your attack surface. Multi-stage builds let you use multiple `FROM` statements in a single Dockerfile, copying only the artifacts you need into the final image. The result? Dramatically smaller, more secure containers.

## The Problem with Single-Stage Builds

A typical Node.js Dockerfile might look like this:

```dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

This image includes everything: Node.js, npm, dev dependencies, source files, build tools — easily **1GB+** for a simple app. Your production container only needs the compiled output and production dependencies.

## Multi-Stage Build Pattern

Here's the same app with multi-stage builds:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]
```

The key difference: the final image only contains production dependencies and the compiled output. Everything else — TypeScript compiler, dev dependencies, source code — stays in the builder stage.

## Real-World Example: Go Application

Go is where multi-stage builds really shine because Go compiles to a static binary:

```dockerfile
# Stage 1: Build
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/server

# Stage 2: Minimal runtime
FROM scratch
COPY --from=builder /app/server /server
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
EXPOSE 8080
ENTRYPOINT ["/server"]
```

Starting from `scratch` (an empty image) gives you a final image that's often **under 10MB**. Compare that to the ~300MB Go build image.

## Python Multi-Stage Pattern

Python is trickier because it needs a runtime, but you can still save significant space:

```dockerfile
# Stage 1: Build dependencies
FROM python:3.12-slim AS builder
WORKDIR /app
RUN pip install --no-cache-dir poetry
COPY pyproject.toml poetry.lock ./
RUN poetry export -f requirements.txt --output requirements.txt
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Runtime
FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /install /usr/local
COPY . .
USER nobody
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0"]
```

## Size Comparison

Here's what multi-stage builds can achieve:

| Application | Single-Stage | Multi-Stage | Reduction |
|-------------|-------------|-------------|-----------|
| Node.js API | 1.2 GB | 180 MB | **85%** |
| Go API | 300 MB | 8 MB | **97%** |
| Python API | 900 MB | 150 MB | **83%** |
| React SPA | 1.1 GB | 25 MB (nginx) | **98%** |

## Advanced: Build Arguments and Caching

Use build arguments to make your multi-stage builds flexible:

```dockerfile
ARG NODE_VERSION=20
ARG ALPINE_VERSION=3.19

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder
# ... build steps

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS production
# ... production steps
```

Leverage Docker's layer caching by ordering your `COPY` commands from least to most frequently changed:

```dockerfile
# These change rarely - cached
COPY package*.json ./
RUN npm ci

# This changes often - invalidates cache
COPY . .
RUN npm run build
```

## Security Benefits

Multi-stage builds improve security by:

1. **Reducing attack surface** — fewer packages, fewer vulnerabilities
2. **No build tools in production** — compilers and dev tools can't be exploited
3. **No source code in final image** — only compiled artifacts
4. **Running as non-root** — easier to enforce with minimal images

## Best Practices

1. **Always use Alpine or slim base images** for the final stage
2. **Copy only what's needed** with explicit `COPY --from=` commands
3. **Use `.dockerignore`** to prevent unnecessary files from entering the build context
4. **Pin your base image versions** for reproducible builds
5. **Run as a non-root user** in the final stage
6. **Scan your images** with `docker scout` or `trivy` for vulnerabilities

Multi-stage builds should be your default approach for any production Docker image. The initial setup takes minutes, but the benefits compound every time you build, push, or deploy.
