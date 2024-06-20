# Application de Messagerie Instantanée

## Introduction

Ceci est une application de messagerie instantanée construite avec NestJS pour le backend et React (avec Vite) pour le frontend. L'application utilise PostgreSQL comme base de données et Prisma comme ORM. Toute l'application est containerisée en utilisant Docker pour une configuration et un déploiement faciles.

## Prérequis

- Docker
- Docker Compose

## Configuration

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/KTaclysme/web-project
   cd web-project

2. Créez un fichier .env dans le dossier server avec le contenu suivant :
    ```bash
    DATABASE_URL="postgresql://youruser:yourpassword@db:5432/yourdatabase?schema=public"

## Démarrage du projet

1. Construisez les images Docker :
    ```bash
    docker-compose build

2. Démarrez les conteneurs :
    ```bash
    docker-compose up
