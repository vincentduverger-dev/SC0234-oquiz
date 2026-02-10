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