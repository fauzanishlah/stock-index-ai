# Build stage
FROM node:23-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install 
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production stage - use lightweight HTTP server
FROM node:23-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/dist /app 
EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]