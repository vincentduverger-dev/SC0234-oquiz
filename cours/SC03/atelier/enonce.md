# SC03E03/4 - Atelier

## Késako ?

Pour cet atelier, l'objectif est d'implémenter un maximum de routes API, ainsi que quelques tests pour chaque route. L'architecture a déjà été mise en place pendant les semaines précédentes. Ainsi, c'est comme en entreprise : on rajoute des fonctionnalités sur une base existante.

Sentez-vous libre d'ajuster les spécifications au besoin : 
- en cas d'imprécision/d'oubli dans la spécification initiale
- pour simplifier l'implémentation tout en restant fonctionnel
- mais également pour améliorer ce qui est proposé si vous le souhaitez
- ⚠️ attention à veiller à documenter les changements de spécification

## Branches et Pull Request

Pour chaque endpoint (ou pour chaque demi-journée), penser à créer une **nouvelle branche** puis soumettre et merger celle-ci via l'interface Github. On reste dans l'esprit entreprise ! 

Une fois la **Pull Request** créée et les tests validées par la pipeline CI (ie, les tests passent tous), vous pouvez : 
- ajouter votre reviewer assigné
- ajouter le formateur (ou helper) au reviewer également
- puis merger la PR (malgré qu'il n'y ait pas encore eu de review, histoire de ne pas vous bloquer)
- puis mettre à jour votre branche `master` et tirer une nouvelle branche pour la prochaine feature !

## API

Implémenter les [endpoints](../../conception/api-rest.md), en suivant les recommandations de sécurités et de testing et la [matrice des droits](../../conception/rbac.md).

Base de données : 
- penser à modifier votre schéma `Prisma` avec les nouvelles entités sur lesquels vous travaillez.

Sécurité : 
- valider les entrées avec `zod`
- rajouter le controle d'authentification/autorisation pour les routes dont c'est nécessaire.

Tests :
- n'oubliez pas de tester avec un outil graphique (`Postman`, `Insomnia`, `ThunderClient`...)
- ajout d'un (minimum) test d'intégration par endpoint.

Ordre (suggéré) pour les endpoints : 
- finir les routes des `/levels` (si non terminé en cours)
- routes des `/tags` 
- routes des `/quizzes` (et questions, choices, attempts)
- routes des `/users`

**Note : on prefèrera 3-4 routes propres, bien codées, bien testées, sécurisées plutôt que d'essayer de produire toute l'API (mais baclée) sur cet atelier**

**Note : la correction fournie le dernier jour contiendra uniquement le code des routes des `tags`.** Le reste, c'est du bonus pour les plus rapides et courageux ! 

## Rappels lancement de l'application

Pour installer et lancer l'application, voir la [documentation](../../../INSTALL.md)

## Bonus : sécurité

- Mettre en place un middleware permettant d'éviter les attaques XSS. Celui-ci doit filtrer les chaines de caractère du `body` des requêtes qui contiendrait des potentielles injections.
- Mettre en place [Helmet](https://www.npmjs.com/package/helmet)
- Rajouter du [rate limiting](https://www.npmjs.com/package/express-rate-limit) sur la route `register`, `refresh`, et `login`

## Bonus : documentation

- Ajouter de la documentation Swagger pour améliorer la discoverabilité de votre API
  - [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc)  pour  générer  automatiquement  les  spécifications  à  partir  de 
commentaires JSDoc dans le code, 
  - [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) pour exposer l’interface web de la documentation.
  - ajouter les commentaires JSDoc directement dans les routeurs pour faciliter le maintient 
