# =========================
# Etapa 1 - Builder
# =========================
FROM node:20-alpine AS builder
WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala todas as dependências (dev + prod)
RUN npm ci

# Copia todo o código do projeto
COPY . .

# Gera Prisma Client
RUN npx prisma generate

# Compila o TypeScript para a pasta 'dist'
RUN npm run build

# =========================
# Etapa 2 - Runner
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

# Copia apenas dependências de produção
COPY package*.json ./
RUN npm ci --omit=dev

# Copia artefatos do builder
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder /app/dist ./dist/      
COPY --from=builder /app/prisma ./prisma/    

# Expõe a porta da API
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
