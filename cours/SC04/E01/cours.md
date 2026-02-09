# SC04E01 - Logger & microservice

## Contenu de la saison

- Logs
- MongoDB
- Architecture Microservices
- Object Storage
- Pratique API ++

## Objectifs de la journée

- Log
  - Comprendre pourquoi le simple console.log n'est pas suffisant
  - Ce qui est intéressant de log (erreur / http pour les stats / debug pour trouver des erreurs en prod)
- Voir un plan d'ensemble avec des micro services

## Microservices

### Brainstorming ?

- découpage une application en petites fonctionnalités
- plusieurs petites applications (souvent des APIs + leur BDD)
- elles travaillent ensemble
- découpage par responsabilité
- indépendance/isolation : chaque service fonctionne indépendamment des autres
- maintenabilité -> petites applications = plus facile à faire évoluer + debug, on peut assigner 1 équipe par service
- scalabilité -> permet une scalabilité horizontale