# Oquiz - Installation et lancement

## Environnement local

Pré-requis : 
- `Node.js` (22)
- `Postgres` (17) (ou Docker)

### Installation

#### Avec Docker compose

```bash
# Copier les variables d'environnement et modifier les valeurs si nécessaire
cp .env.docker.dev.example .env

# démarrer les conteneurs docker
docker compose up
```

```bash
# Installer les dépendances
npm install --prefix api
npm install --prefix client

# Copier et ajuster les variables d'environnement pour l'API
# (attention au port de la BDD si vous utilisez Docker)
cp api/.env.example api/.env
code api/.env

# Copier et ajuster les variables d'environnement pour le client
cp client/.env.example client/.env
code client/.env
```


### Base de données

#### Méthode 1 : Postgres installé en local

```bash
# Se connecter à Postgres
sudo -i -u postgres psql

# Créer un utilisateur
CREATE ROLE oquiz WITH LOGIN CREATEDB PASSWORD 'oquiz';

# Créer une base de données
CREATE DATABASE oquiz WITH OWNER oquiz;

# Quitter psql
exit
```

#### Méthode 2 : Postgres dans un conteneur Docker

```bash
# Créer un conteneur Postgres:17 sur le port 5433
docker run \
--name oquiz-postgres \
-e POSTGRES_USER=oquiz \
-e POSTGRES_PASSWORD=oquiz \
-e POSTGRES_DB=oquiz \
-p 5433:5432 \
-d \
postgres:17
```

#### Lancer les migrations

```bash
# Appliquer les migrations
npm run db:migrate:reset --prefix api

# (Si désiré) Échantillonage de la base de données
npm run db:seed --prefix api

# (Si besoin) Générer des migrations lors d'un changement de schéma Prisma
npm run db:migrate:dev --prefix api
```

### Lancer les serveurs de développement

```bash
# Démarrer le serveur API (Node - Express)
npm run dev --prefix api

# Démarrer le serveur Svelte (Vite)
npm run dev --prefix client
```
