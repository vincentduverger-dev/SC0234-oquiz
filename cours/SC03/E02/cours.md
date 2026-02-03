# SC03E02 - Autorisation

## Menu du jour

- Correction

  - Pull Request (`/refresh` & `/logout`)
  - Live Code (`/me`)

- Gestion des rôles et permissions

  - Vocabulaire
  - Différentes approches (`RBAC`, `ABAC`, `ACL`, ...)
  - Design Pattern `URP` (dépôt annexe)

- Pratique
  - Middleware d'accès `checkRole`
  - (bonus) Tests associés (`axios`)

## *NEW* GlobalErrorHandler

[globalErrorHandler MW](../../../api/src/middlewares/globalError.middleware.ts)

C'est un middleware avec 4 paramètres (err, req, res, next) - Express reconnaît cette signature comme un gestionnaire d'erreurs.

**Fonctionnement**

- Une erreur est lancée quelque part (`throw new Error(...)`)
- Express la propage automatiquement au global error handler
- Le handler formate et renvoie une réponse JSON cohérente

```js
app.get('/user/:id', (req, res, next) => {
  const user = findUser(req.params.id);
  if (!user) {
    const error = new Error('Utilisateur non trouvé');
    error.status = 404;
    throw error; // ← Propagé au globalErrorHandler
  }
  res.json(user);
});
```

**Avantages**

- *Centralisation* : un seul endroit pour gérer toutes les erreurs
- *Cohérence* : format de réponse uniforme pour le client
- *Simplicité* : dans les routes, il suffit de throw l'erreur
- *Convention* : depuis Express v5



## Rappels des deux tokens manipulés ici

**AccessToken**

- prouver l'authentification
- porteur d'informations (userId et role)
- accéder à certaines ressources de l'api (via rôle)
- ne peut pas être invalidé (expiration 1h)
- stocké dans les cookies
- transmis au serveur à chaque requête du client sur `/api`
  - soit via le cookies automatiquement
  - soit possible aussi dans les headers `"Authorization" : "Bearer xxxxxxxx"`

**RefreshToken**

- permet de regénérer un AccessToken
- prouve que le client s'est déjà login auparavant
- stocké en BDD
- possible de l'invalider si on le supprime de la BDD
- s'envoie automatiquement via les cookies sur `/api/auth`

## Autorisation

// TODO

### Sur Oquizz ?