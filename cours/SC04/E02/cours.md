# SC04E02 - Logger & microservice

## Objectifs de la journée

- Pratique
- Requête avec mongodb


## MongoDB

MongoDB = Document Database 

- NoSQL = Not Only SQL
- Pas de relations (= tables) mais des collections
- Pas de colonnes = pas de structure
- Pas de jointure = bdd non relationnelle (possibilité d'imbriquer les documents mais pas opti)
- Pas d'enregistrements, mais des documents

- Mongo -> Humongous -> gigantissime = optimisé pour gérer de grandes quantités de données

**Pertinent pour nos logs ?**
- bcp de logs sur le long terme
- la structure des logs n'est pas fixe (`...meta`)
- pas de lien entre les logs et une autre collection

## Service (couche logicielle)

`/log-service/src/log.service.ts` 

- séparation des responsabilité
- controller = logique métier
- service = logique de communication avec la DB
- méthodes qu'on va appeler dans le controller
- code BDD dans service


- fournit une *interface* -> contrat implicite -> controller appelle `createLog(log)` le service doit fournir une méthode `createLog(log)` qui prend en paramètre un log et qui l'insère dans la db

Le service permet également de masquer les détails d'implémentation dans le controller : le code dédié à requêter la DB se trouvera dans `service`

Si demain je décide d'utiliser Prisma plutôt que mongoDB pour faire les requêtes BDD, je n'aurai pas à modifier le code du controller, uniquement du service.
