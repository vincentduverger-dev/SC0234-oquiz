# SC02E02 - Déploiement

## Menu du jour

- Correction
  - Dockerfile (client)
  - Compose : environnement

- VM Kourou (VPS)
  - Connexion SSH
  - Installation Docker
  - GitHub SSH key

- Déploiement
  - Variables d'environnement
  - Lancement des conteneurs
  - Diagramme de déploiement

  
  ## Comment tuer un port

Voici des commandes pour vérifier et tuer les ports :

```bash
# sous linux
# Outil Commande Usage
lsof sudo lsof -i :PORT # Pour voir qui est là (recommandé).
```

```bash
# sous windows
netstat sudo netstat -tulpn | grep :PORT # Une alternative classique pour lister les ports.
kill sudo kill -9 PID # Pour arrêter un processus par son ID.
```

```bash
# sous mac
fuser sudo fuser -k PORT/tcp # Pour nettoyer un port instantanément.
```