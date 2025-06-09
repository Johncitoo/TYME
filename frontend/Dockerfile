FROM node:20

WORKDIR /app

# 1) Copia los lockfiles e instala dependencias con resolución flexible
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# 2) Copia todo el código fuente al contenedor
COPY . .

# 3) Expón el puerto y arranca Vite en todas las interfaces
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
