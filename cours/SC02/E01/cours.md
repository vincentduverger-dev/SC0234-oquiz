# SC02E01 - Conteneurisation Docker

## Menu du jour

- Théorie : Docker
  - Installation de Docker Engine
  - Motivation et intérêt
  - Rappels : images & conteneurs
  - Rappels : DockerHub
  - Rappels : Dockerfile
  - Rappels : Docker compose

- Pratique : Docker
  - CLI : démarrer un conteneur local
  - Dockerfile : créer un Dockerfile (API)
  - Compose : orchestrer des services

- Challenge : Docker
  - Dockerfile : créer un Dockerfile (Client)
  - Compose : ajouter un service

## Résumé du client
Vite = bundler + live serveur

- **bundler** = ```npm run build``` --> prend les sources et génère un dossier ```dist``` que l'on peut ensuite héberger sur un serveur de fichier statique
- **live serveur** = ```npm run dev``` --> lance un serveur de développement avec ```hot reload```
Svelte = Framework = syntaxe pour écrire du front sous forme de composant :

- template
- script
- style

## Révision sécurité (CORS)

Par défaut, les navigateurs appliquent une règle de sécurité appelée la **Same Origin Policy** (SOP).

Un `domaine A` (ex : `http://oclock.io`) ne peut pas effectuer des requêtes vers un `domaine B` (ex : `http://oquiz.io`) sans l'autorisation explicite du `domaine B`.

Pour autoriser ce type de requêtes, dites **cross-origin**, le domaine B doit ajouter un en-tête HTTP `Access-Control-Allow-Origin`, en précisant les domaines autorisés à accéder à ses ressources.

`CORS` (pour **Cross-Origin Resource Sharing**, ou *partage de ressources entre origines différentes*) est un mécanisme qui vient **assouplir la politique SOP**, celle-ci étant très restrictive par défaut.

📝 **Remarque** : cette restriction est imposée par les **navigateurs web**. Un appel entre deux backends, ou depuis un outil comme Postman, Bruno ou Insomnia, **ne sera pas bloqué par CORS**. Pour véritablement restreindre l'accès à une API, il faut mettre en place un système d'**authentification**, comme par exemple avec des tokens **JWT**.

Pour installer cors dans notre api, il faut installer le packet node ```cors``` :
```npm install cors```
Avec typescript il faut ajouter : ```npm install @types/cors```

## Docker : Command Line Interface (CLI) - Fiche recap'

```bash
# Lister les images
docker images

# Lister les conteneurs
docker ps
docker ps -a  # Lister également les conteneurs qui ne tourne plus

# Créer un conteneur à partir d'une image (téléchargé à la volé depuis le DockerHub)
docker run \                                # Créer un conteneur
--name NOM_POUR_LE_CONTENEUR \              # Choisir le nom du conteneur
--network NOM_NETWORK                       # Choix du network
-p PORT_HOTE:PORT_CONTENEUR \               # Binder un port du conteneur vers notre hôte
-v CHEMIN_DOSSIER_LOCAL:CHEMIN_CONTENEUR \  # Monter un volume dans le conteneur
-d \                                        # DETACH (tâche de fond)
NOM_IMAGE                                   # Image de base

# Créer un conteneur qui tourne en tache de fond
docker run -it -d NOM_IMAGE

# Exécuter une commande à l'intérieur d'un conteneur qui tourne
docker exec -it NOM_OU_ID_CONTENEUR bash

# Lancer un conteneur en exécutant une commande
docker run --it NOM_IMAGE COMMAND

# Supprimer un conteneur
docker rm NOM_OU_ID_CONTENEUR # supprimer un conteneur déjà éteint
docker rm -f NOM_OU_ID_CONTENEUR # supprimer un conteneur qui n'est pas éteint

# Supprimer tous les conteneurs 
docker rm $(docker ps -a -q)
docker rm -f $(docker ps -a -q)

# Éteindre un conteneur
docker stop NOM_OU_ID_CONTENEUR # (arrêter)
docker kill NOM_OU_ID_CONTENEUR # (débrancher)

# Supprimer une image
docker image rm NOM_IMAGE
docker rmi NOM_IMAGE
```

## Démonstration de cours

```bash
# Exemple du Hello-world
docker run hello-world   # qui nous affiche Hello world puis s'éteint car il n'a rien d'autre à faire
docker ps -a             # il est éteint
docker rm ID_CONTENEUR   # on le supprime

# Exemple Ubuntu
docker run -it ubuntu bash # Lancer un conteneur ubuntu et lancer bash dans ce conteneur
uname -a                   # On est bien dans ubuntu
exit                       # On quitte
docker ps -a               # il est éteint également
docker rm ID_CONTENEUR

# Exemple Ubuntu v2
docker run -it -d --name mon-ubuntu ubuntu  # On lance un conteneur Ubuntu en tache de fond, on le nomme
docker exec -it mon-ubuntu bash             # On s'y connecte à posterio !
exit
docker rm mon-ubuntu                        # On essaie de le supprimer mais impossible car il tourne
docker rm -f mon-ubuntu                     # On forme l'extinction

# Supprimer tous mes conteneurs
docker rm -f $(docker ps -a -q)
```

```bash
# Exemple avec Apache
docker run -d -p 8080:80 --name apache httpd  # On bind les ports
curl http://localhost:8080      # On test
docker exec -it apache bash     # On se connecte
cat htdocs/index.html           # On cherche où se trouve le code source ! Dans le dossier htdocs
exit
docker rm -f apache             # On supprime, on va retester

# Bind Mount
npm install --prefix client     # On installe les dependances dans le client
npm run build --prefix client   # On build le client histoire d'avoir des source à monter dans le conteneur
docker run -d -p 8080:80 --name apache -v "$(pwd)/client/dist":/usr/local/apache2/htdocs httpd  # On monte le dossier dist dans Apache !
curl http://localhost:8080      # Incroyable, le client nous est servi par Apache
exit
docker rm -f apache
```

![](./resources/screens/dockerhub.png)

## Et Oquiz dans tout ça ?

On a besoin de créer 3 services (conteneurs) différents :
- Un conteneur Postgres (BDD)
- Un conteneur Node.js (API)
- Un conteneur Nginx (Front)

```sh
  # Étape 1 - Créer un conteneur pour Postgres
  docker run \                  # Créer un conteneur
  -d \                          # Tâche de fond
  --name oquiz-database \       # Nom du conteneur
  -p 5433:5432 \                # Bind le port 5432 (à l'intérieur du conteneur, sur lequel tourne Postgres) vers le port 5433 (de l'hôte, que l'on peut contacter)
  -e POSTGRES_USER=oquiz \      # Nom de l'utilisateur que l'on créé par défaut dans le conteneur
  -e POSTGRES_PASSWORD=oquiz \  # Son mot de passe
  -e POSTGRES_DB=oquiz \        # Nom de la base de données
  postgres:17-alpine                   # Image de laquelle on part

  # Se connecter en passant par bash
  docker exec -it oquiz-database bash
  psql -U oquiz -d oquiz
  \dt
  exit # Sortir de psql
  exit # Sortir du conteneur

  # Se connecter en passant par PSQL de l'hôte
  psql -U oquiz -d oquiz -p 5433 -h localhost
  exit

```

Ici :

- le serveur Postgres tourne sur le port 5432 à l'intérieur du conteneur (pas accessible de l'extérieur)
- on bind les port : on connecte ce port 5432 au port 5433 de notre hôte afin de pouvoir contacter Postgres depuis notre hôte
- (pourquoi 5433 ? car notre 5432 est déjà utilisé par notre Postgres LOCAL, on veut éviter les conflits)

## Création d'image à l'aide de Dockerfile 

```Dockerfile
FROM IMAGE_DE_BASE

RUN commande_a_lancer_lors_de_la_creation_de_l_image

WORKDIR dossier_de_travail

COPY des_fichiers_locaux des_fichiers_dans_l_image

CMD les_instructions_a_lancer_lorsque_qqun_creer_un_conteneur_a_partir_de_cette_image
```


```bash
# Commande pour générer l'image
docker build \                         # Créer une image
-t NOM_IMAGE \                         # Nom de l'image
--build-arg VARIABLE=VALEUR \          # Ajout de variable de build
dossier_ou_se_trouve_le_dockerfile     # comme son nom l'indique

# Exemple 
docker build -t oquiz-api api

# Puis lancer un conteneur
docker run \
-d \
-p 3001:3000 \
-e PORT=3000 \
-e DATABASE_URL=postgres://oquiz:oquiz@localhost:5433/oquiz \
--name oquiz-api \
oquiz-api

# Inspection
docker ps -a # Le conteneur a l'air down ? Pourquoi ? Regardons les logs du conteneur
docker logs oquiz-api

# Error : Error: P1001: Can't reach database server at `localhost:5433`
# ==> Explication : un conteneur n'a pas le droit d'accéder à l'hôte !
# ==> Comment on s'en sort ? On va placer les deux conteneurs (Postgres + API) dans un même docker - NETWORK 
```

A ce stade, ce que je devrais faire :
- supprimer mon conteneur de BDD
- supprimer mon conteneur d'API
- créer un réseau
- recreer le conteneur BDD, DANS le reseau
- recreer le conteneur API, DANS le reseau

MAIS on va faire mieux : docker compose

# Docker compose

Actuellement, pour gérer notre application complète il faut : 
- créer un network
- créer un conteneur Postgres dans le network
- créer une image à partir du Dockerfile pour l'API
- créer un conteneur pour l'API dans le network

==> Beaucoup de commande à taper : automatiser/orchestrer avec un **docker-compose**

==> Un fichier de configuration `docker-compose.yml` (ou `compose.yml`)



```bash
# Pour déclencher le docker-compose
docker compose \
-p oquiz \                 # nom du projet
-f docker-compose.yml  \   # localisation du fichier compose
--env-file=.env.docker     # fournir les variables d'environnement
up  \                      # démarrer les service
-d                         # Tâche de fond


# Pour l'éteindre
docker compose -p oquiz down
```

![](./resources/screens/orchestration-compose.png)