# Commandes Docker

## Comment installer Docker ?

Toutes les informations de l'installation de Docker sont disponible dans la documentation officielle.

- [Lien de la doc ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [Lien de la doc windows](https://docs.docker.com/desktop/setup/install/windows-install/)
- [Lien de la doc mac](https://docs.docker.com/desktop/setup/install/mac-install/)

**Ce qui suit est pour ubuntu uniquement**
Commande à lancer pour gérer les éventuels conflits :
```sh
sudo apt remove $(dpkg --get-selections docker.io docker-compose docker-compose-v2 docker-doc podman-docker containerd runc | cut -f1)
```

Commande pour installer Docker Engine : 
```sh
# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources (À copier ligne par ligne):
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

# Installation de Docker Engine
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Si vous êtes sur **Linux**, il est possible que vous ayez besoin de taper `sudo` devant chaque commande Docker (pour avoir le droit) => pénible. Pour éviter cela :
- créer un groupe de permission Docker (s'il n'existe pas déjà, mais a priori il devrait)
  - `sudo groupadd docker`
- **ajouter l'utilisateur courant au groupe de permission Docker**
  - `sudo usermod -aG docker $USER`
- redemarrer le service docker
  - `sudo systemctl restart docker`
- puis ⚠️ **redemarrer** à la main
- pour tester si ça fonctionne :
  - `docker run hello-world`

Vérifier que Docker est correctement installé :
```sh
docker -v
# ou
docker --version
```

Lancement de notre premier conteneur :
```sh
sudo docker run hello-world
```

Si l'image n'existe pas alors elle sera d'abord téléchargée puis le conteneur sera crée et lancé. Si l'image est déjà présente dans notre docker alors le conteneur sera crée à partir de celle-ci.

## Commandes de base Docker

### GLOBAL

Faire le ménage : Supprimer les conteneurs, networks, caches inutilisés...
```sh
sudo docker system prune
```

### Images

Voir toutes les images installée sur notre docker:
```sh
sudo docker image ls
# ou
sudo docker images
```

Supprimer une image
```sh
sudo docker image rm <nom de l'image>
```
*Une image ne peut être supprimée que s'il n'y a aucun conteneur rattaché*

### Conteneurs

Lancer un conteneur:
```sh
sudo docker run <nom de l'image>
```
- ``` -d ``` : lancer le conteneur en tâche de fond
- ``` -p <port de notre host>:<port du conteneur> ``` : lancer le conteneur avec un mapping du port
- ``` --name <nom du conteneur> ``` : Donner un nom au conteneur
- ``` --network <nom du réseau> ``` : Ajouter le conteneur à un réseau

Créer/lancer un conteneur
```sh
sudo docker run <nom de l'image>
```

Voir tous les conteneurs
```sh
sudo docker container ls -a
# ou
sudo docker ps -a
```

Voir les conteneurs actif
```sh
sudo docker container ls
# ou
sudo docker ps
```

Stopper un conteneur actif
```sh
sudo docker stop <nom du conteneur>
# ou
sudo docker stop <id du conteneur>
```

Supprimer un conteneur
```sh
sudo docker container rm <id du conteneur>
# ou
sudo docker container rm <nom du conteneur>
```

Rentrer et intéragir avec le conteneur
```sh
sudo docker exec -it <nom du conteneur> bash
```
- ``` -it ```: Contraction de ``` -i ``` et ``` -t ``` (permet une session interactive avec un terminal)
- ``` -i ```: *interactive*, garde l’entrée standard (STDIN) ouverte pour pouvoir envoyer des commandes au conteneur
- ``` -t ```: *tty*, alloue un pseudo-terminal (TTY), ce qui permet un affichage et une interaction comme dans un vrai terminal (prompts, couleurs, etc.)
- ``` bash ```: Avec quoi vous allez interagir (ça peut-être aussi avec "sh" par exemple)
*Cette commande ne peut fonctionner que sur des conteneurs actif*

### Networks

Un réseau est un ensemble de machine qui peuvent communiquer entre-elles. Dans le cadre de Docker, un réseau s'est un regroupement de conteneurs.

Afficher tous les réseaux
```sh
sudo docker network ls
```

Créer un réseau
```sh
sudo docker network create <nom du réseau>
```

Supprimer un réseau
```sh
sudo docker network rm <nom du réseau> 
```

## Dockerfile

### Concept de base du Dockerfile

C'est un fichier qui déroule différentes étape que la commande ``` docker build ``` devra effectuée pour créer l'image.

### Exemple de Dockerfile

On va créer une conteneur qui expose sur le port 3000 une application nodeJS

```Dockerfile
# On part d'une image
FROM node:24

# On place le répertoire de travail du conteneur
WORKDIR /usr/src/app

# On copie les fichiers de notre application dans l'image
COPY ./app ./

# On installer nos dépendances
RUN npm install

# On exposer le port 3000
EXPOSE 3000

# On lance l'application
CMD ["node", "app.js"]
```

### Créer l'image à partir du Dockerfile

```sh
sudo docker build . -t <nom souhaité de l'image>:<nom de version>
```
- ``` build ```: Commande qui sert à lancer la création de l'image à partir d'un Dockerfile
- ``` . ```: Ici, on cible le dossier du Dockerfile. Si le Dockerfile est à un autre endroit de là où nous nous trouvons avec notre terminal, alors il faudra soit cibler l'endroit en question (à la place du .) soit se déplacer avec le terminal (commande ``` cd ```) dans le bon dossier.
- ``` -t <nom de l'image> ```: Permet de nommer l'image que l'on va créer. Le :v1 de l'exemple c'est pour spécifier un numéro de version de l'image.