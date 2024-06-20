# Étape 1
FROM node:20.14.0 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Étape 2
FROM node:20-alpine

WORKDIR /app

# Installation postgresql-client
RUN apk add --no-cache postgresql-client

COPY package*.json ./
RUN npm install --only=development

COPY --from=build /app/dist ./dist

# Copie du script wait-for.sh et entrypoint.sh
COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copie du dossier prisma
COPY prisma ./prisma
COPY tsconfig.json ./

EXPOSE 3000

# Run le projetj
ENTRYPOINT ["/entrypoint.sh"]