# SC02E03 - Tests automatisés

## Menu du jour

Tests automatisés
- Motivation
- Nomenclature

Tests unitaires
- Démonstration (API : `node:test`)
- Démonstration (Client : `vitest`)

Tests d'intégration
- Environnement de test
- Quelques routes et pleins de tests

## Nomenclature de tests

Les tests automatisés regroupent plusieurs types de tests : 
- **Tests unitaires** = on test une fonction isolée
  - ex : `function isValidPassword(password)`
- **Tests d'intégration** = on test une sous partie d'un système
  - ou component testing 
  - ou specification testing
  - ex : tester la route `GET /api/users`
- **Tests e2e** = on test l'intégralité d'une fonctionnalité, du point de vu de l'utilisation
  - ou test end-to-end
  - ou test bout-en-bout
  - ex : tester le fonctionnement de la page `/login`
  - ex : On veut tester tout un parcours utilisateur de la connexion à l'achat d'un produit

Vocabulaire : 
- Contract Tests = vérifier que le code respecte le contrat
- Snapshot Testing = vérifier que le rendu actuel est le même que précédemment
- Non-regression Tests = éviter les régressions
- UI Testing = tester des composant UI, à l'aide d'un [storybook](https://storybook.js.org/) par exemple

Beaucoup d'abus de language sur les tests, mais l'idée reste la même : 
- éviter les régressions
- documenter le système
- s'assurer de la qualité logiciel
- faciliter l'intégration continue

## Mise en place de tests

On a besoin de deux choses : 
- **test runner** : l'exécutable qui lance les tests 
  - ex : `node:test` (natif à node mais récent) (`node --test`)
  - ex : `mocha`
  - ex : `jest`
  - ex : `vitest`
- **bibliothèque d'assertion** : librairie qui permet de vérifier que la fonction fait ce qu'on attend d'elle
  - ex : `node:assert` (natif à node mais récent) (`assert.isEqual(result, 42)`)
  - ex : `chai` (+ plugin)
  - ex : `jest`
  - ex : `vitest`

  ## Tests d'intégration

= component tests
= specifications tests (`spec`)

Ils testent une partie du système : l'API.

Mais comment ? Car actuellement pour tester manuellement, on doit :
- créer une base de données (oquiz) de développement
- gérer les migrations
- lancer un serveur pour l'app (port 3000)
- tester à l'aide de postman

Donc :
- quelle BDD doit utiliser nos tests ? la même ? donc on est forcé d'installer Postgres en local pour run les tests ? 
  - si le test en question écris dans la BDD, on fou en l'air le seeding
  - si le test en question lit la BDD de dev, on peut plus modifier la BDD de dev sans casser le test ?
- quel serveur HTTP utilise nos tests ? le port 3000 ? 
  - sous entendu je dois lancer `npm run dev --prefix api` dans un autre terminal AVANT de lancer les tests ?


SOLUTION : on va rajouter un setup, qui doit :
- créer une BDD dédiée au test (que l'on supprime potentiellement une fois les tests lancés)
  - à l'aide d'un conteneur 
- lancer un serveur HTTP de test
  - dans le setup, on lance `app.listen`

Ce travail de setup est à faire une fois, généralement en entreprise, c'est déjà là !
- => c'est un travail d'architecture (pas si évident) 

### Décomposition de la commande

- La commande que nous utilisons pour le projet est la suivante : `npx tsx --test --import ./test/config/global-setup.ts --experimental-test-isolation=none ./**/*.spec.test.ts`
    - `npx tsx`: execute une fonction des node_modules (dans notre cas tsx)
    - `--test`: permet de lancer le test runner
    - `--import`: permet d'importer un fichier, dans notre cas il s'agit de `./test/config/global-setup.ts`
    - `--experimental-test-isolation=none`: Cette option est généralement utilisée dans des scénarios de développement et de test spécifiques, où la flexibilité et la performance sont prioritaires.
    - `./**/*.spec.test.ts`: Permet de cibler tous les fichiers qui se termine par `.spec.test.ts`

### Rappels

#### Spread operator

```js
const person = {
  pseudo: "Bob",
  age: 42
};

const address = {
  numero: 1,
  road: "rue des crustacés",
  city: "Bikini Bottom"
};


const total = {
  ...person,
  ...address
};

console.log(total); // { pseudo, age, numero, road, city }
```

#### Ternary operator

```js
console.log(Math.random() > 0.5 ? "grand" : "petit");
//             ^ si vrai, alors l'ensemble de l'expression vaudra "grand"
//             ^ si faux, alors l'ensemble de l'expression vaudra "petit"
```