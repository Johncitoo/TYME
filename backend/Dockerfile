# 1) Build stage
FROM node:20 AS builder
WORKDIR /app

# instalar deps y compilar
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# 2) Runtime stage
FROM node:20 AS runner
WORKDIR /app

# sólo deps de producción
COPY package*.json ./
RUN npm install --production --legacy-peer-deps

# copiar el código compilado
COPY --from=builder /app/dist ./dist

# exponer el puerto (coincide con tu ENV en docker-compose)
ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}

# arranca un único proceso
CMD ["node", "dist/main.js"]

