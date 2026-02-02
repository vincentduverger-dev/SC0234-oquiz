# VM Kourou

Se rendre sur : [https://kourou.oclock.io/ressources/vm-cloud/](https://kourou.oclock.io/ressources/vm-cloud/)

Se connecter en ssh

```bash
# Se connecter en SSH
ssh student@PSEUDO-server.eddi.cloud
# Commande trouvable sur la page de la VM dans "Commande SSH pour se connecter"
```

**Cas d'erreur "potentielle attaque"**

Si le message d'erreur indique : `Offending ECDSA key in /home/student/.ssh/known_hosts:6 remove with:` alors il faut :

```bash
# Sous Linux
# Ouvrir le fichier problématique dans VS Code
code /home/student/.ssh/known_hosts 

# Sous windows
# Déplacez-vous dans votre répertoire d'utilisateur
code .ssh/known_hosts

# Sous mac
code /Users/<username>/.ssh/known_hosts

# Retirer toutes les lignes qui commencent par PSEUDO-server.eddi.cloud

# Enregistrer et fermer VS Code
CTRL + S

# Puis relancer la commande SSH
```

## Commandes complémentaires pour explorer notre VPS

```bash
# Info du système
uname -a

# Notre utilisateur courant
whoami

# Version d'Ubuntu
lsb_release -a

# Nom de l'hôte
hostname

# Espace libre
df -h

# Gestionnaire de tâche (liste des processus)
htop
# Touche 'q' pour quitter

# Informations sur l’architecture CPU.
lscpu

# Afficher informations sur interfaces réseau.
ip -c a
```

Premières choses à faire en arrivant dans notre VPS
```bash
# Mettre à jour la liste des paquets Linux (l'annuaire des paquets)
✅ sudo apt update
# MDP : par dessus les nuages

# Mettre à jour les packages déjà installés
✅ sudo apt upgrade
# Confirmer l'installation avec Y
```

Vocabulaire:
- **APT** = Advanced Package Tool = gestionnaire de paquets pour Linux 
- **Kernel** = Noyau d'un système d'exploitation (le "cœur")
- **sudo** = Super User Do = prendre le rôle `root` pour effectuer une action

```bash
# Mettre à jour le Kernel
# Si un écran VIOLET s'affiche, c'est pour mettre à jour le Kernel d'Ubuntu, donc : 
# - Choisir "OK" en appuyant sur la touche ENTER (1re fois)
# - Choisir "OK" en appuyant sur la touche ENTER (2e fois)

# Puis je vous propose de redémarrer votre VPS
sudo reboot
# On est éjecté de SSH, normal puisque ça redémarre

# On attend une petite minute, puis on se reconnecte en SSH
ssh student@PSEUDO-server.eddi.cloud
```

Deux invites possibles (dans le cas ou vous utilisez le teleporter) : 
- `student@teleporter` : vous êtes sur votre téléporteur
- `student@PSEUDO-server` : vous êtes sur votre VPS

Deux choses à faire : 
- installer Docker
- cloner le dépôt :
  - installer une clé SSH
  - cloner

## Installation de Docker 
[Documentation pour Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

```bash
sudo apt remove $(dpkg --get-selections docker.io docker-compose docker-compose-v2 docker-doc podman-docker containerd runc | cut -f1)
```

```bash
# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
```

```bash
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Pour vous assurer que Docker est bien installé :
```bash
docker -v
```

```bash
# Pour éviter d'avoir à écrire sudo pour toutes les commandes Docker, on peut ajouter l'utilisateur courant (student / `whoami`) dans le groupe de permissions (Linux) "docker"
sudo usermod -aG docker $USER

# Redémarrer le service docker
sudo systemctl restart docker

# Redémarrer le système
sudo reboot # Patienter une minute que votre téléporteur redémarre
```

```bash
# On attend une bonne minute puis on se re-connecte à notre VPS
ssh student@PSEUDO-server.eddi.cloud

# On teste
docker run hello-world # 🎉 Fonctionne sans avoir besoin de sudo !
```

Documentation :
- [Ajout d’une nouvelle clé SSH à votre compte GitHub](https://docs.github.com/fr/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)


```bash
# Générer la clé SSH (⚠️ avec votre e-mail GitHub !)
ssh-keygen -t ed25519 -C ton_email_github@example.com

# Nommer la clé SSH :
/home/student/.ssh/id_ed25519
puis appuyer sur : ENTER # pour choisir la valeur proposée par défaut

# Choix de la passphrase
ENTER # laisser vide

# Confirmer la passphrase
ENTER # laisse vide

# Où est la clé SSH ? 
ls ~/.ssh

# Celle que je dois fournir à GitHub, c'est la clé publique
cat ~/.ssh/id_ed25519.pub

# Ressemble à quelque chose comme (y compris l'e-mail et le ssh-ed25519) : 
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAaVbMTsxJtcayl46reqIeTlUtLlKSHAE4uSZq3iIgWk enzo.testa@oclock.io

# Démarrer l'agent SSH
eval "$(ssh-agent -s)"

# Ajouter la clé privée à l'agent SSH
ssh-add ~/.ssh/id_ed25519
```

## Déclarer notre clé publique auprès du dépôt GitHub à cloner

```bash
# Copier la clé depuis le terminal 
cat ~/.ssh/id_ed25519.pub
# On copie tout ! Y compris ssh-ed25519  et le mail à la fin
```

- La copier dans Photo de profil > Settings > SSH & GPG Keys > New SSH key
- Remplir le formulaire :

- **Title** : `VM Kourou VPS`
  - (peu importe le nom choisi, c'est indicatif)
- **Key** : on colle le contenu de la clé publique
- **Allow write access** : laisser décoché par mesure de sécurité
- `VALIDER`

```bash
# Se placer dans le dossier de l'utilisateur courant
cd ~

# On peut à présent cloner
git clone git@github.com:O-clock-Francfort/SC02-oquiz.git
# On nous demande potentiellement de valider avec "yes"
```

## Déploiement

```bash
# Se déplacer dans le dossier
cd ~/SC02-oquiz

# Ouvrir le fichier `.env.docker` avec nano pour le modifier (nano = éditeur de texte dans le terminal)
nano .env.docker

# On peut changer le mot de passe si on le souhaite ainsi que d'autres variables d'environnement
# On doit changer l'adresse de l'API au niveau de API_URL et mettre <addresse de la machine (vm kourou)>:<port api>/api
```

Puis on sauvegarde : 
- `CTRL + O`

Puis on quitte nano : 
- `CTRL + X` 

Il est temps de lancer l'application : 
- `docker compose --env-file=.env.docker up -d`


À partir de là, on peut tester avec plaisir la connexion sur :
- L'API (3000)
- L'adminer (8080)
- Le client (8000)

Pour éteindre les services : 
- `docker compose --env-file=.env.docker down` 

Si on modifie les variables d'environnement du client : 
- `docker rmi oquiz-client`
- (comme ça le `compose up` sera obligé de re-créer l'image !)

Pour relancer les services en forçant un nouveau build : 
- `docker compose --env-file=.env.docker up -d --build`

Pour ceux qui ont une erreur lié à une limite qui serait atteinte de téléchargement d'image docker, il faut créer un compte.
Pour cela, utilisez la commande :
```bash 
sudo docker login
```
Et se laisse guider