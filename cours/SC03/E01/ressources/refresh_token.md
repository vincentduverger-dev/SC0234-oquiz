# 🛡️ Access Token vs Refresh Token

## 📘 Définition

| Type de Token     | Définition                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| **Access Token**  | Jeton à courte durée de vie utilisé pour accéder aux ressources protégées (ex: API).               |
| **Refresh Token** | Jeton à longue durée de vie utilisé pour obtenir un nouveau access token sans ré-authentification. |
  

## ⏱️ Durée de vie typique

- **Access Token** : quelques minutes à 1 heure *(ex : 15 min)*
- **Refresh Token** : plusieurs jours/semaines *(ex : 7 jours)*

Pourquoi utiliser le mécanisme ? 
- il n'est pas possible d'invalider un access token JWT. Donc on limite sa durée d'utilisation.
- en revanche il est possible d'invalider un refresh token (car stocké en BDD).

## 🔁 Fonctionnement

1. **Authentification initiale**
- L'utilisateur s'authentifie (ex : login + mot de passe).
- Le serveur renvoie un **access token** + **refresh token**.

1. **Accès aux ressources**
- Le client utilise l’**access token** pour interroger l’API.
- Si l’access token est valide ➜ accès autorisé.

1. **Expiration de l’access token**
- Si expiré ➜ le client envoie le **refresh token** à un endpoint spécial (`/auth/refresh`).
  - note annexe : si le refresh token est stocké dans un cookie, on paramètre celui-ci pour qu'il ne s'envoie automatiquement que sur cette route, limitant ainsi les attaques potentielles
- Le serveur valide le refresh token (ie, celui-ci est toujours en base et n'est pas expiré)
  - ✅ Si valide : envoie un **nouvel access token** (et généralement un nouveau refresh token qui remplace l'ancien, maintenant ainsi la connexion pour quelques jours de plus).
  - ❌ Si invalide : rejet de la requête ➜ l'utilisateur doit se reconnecter.


## 🔒 Sécurité

| Élément           | Recommandations                                                           |
| ----------------- | ------------------------------------------------------------------------- |
| **Access Token**  | Stocké temporairement (ex : `mémoire` ou `sessionStorage` ou `cookie`).   |
| **Refresh Token** | Plus sensible ➜ stocké de manière sécurisée (ex : `HttpOnly cookie`).     |
| **Chiffrement**   | JWT pour l'access token. Jeton en BDD pour le refresh token               |
| **Révocation**    | Prévoir un mécanisme pour invalider un refresh token (logout, vol, etc.). |


## ✅ Bonnes pratiques

- Ne jamais stocker les tokens dans `localStorage` (risque XSS).
- Protéger le endpoint `/auth/refresh` contre les attaques (rate limiting, IP filtering…).
- Associer les tokens à un identifiant d’appareil ou de session.
- En cas de compromission, invalider tous les refresh tokens liés à l’utilisateur.

Bilan : 
- l'approche refresh-token est stateless mais hybride