#!/bin/sh

/wait-for.sh db

# Exécution migrations prisma
npm run prisma:migrate

# Démarrage serveur back
npm run start:dev