# JSON Web Token

Un jeton JWT (JSON Web Token) est un standard ouvert (RFC 7519) utilisé pour échanger des informations de manière sécurisée entre deux parties (typiquement un client et un serveur). Ces informations sont encapsulées dans un format compact et autoportant, souvent utilisé pour l'authentification et l'autorisation dans des applications web.

## Structure d’un JWT

Un JWT est composé de trois parties, séparées par des points (`.`) et ressemble généralement à ceci :

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

- **Header(En-tête)** : contient des métadonnées sur le jeton. Typiquement, il indique le type de jeton (JWT) et l’algorithme de signature utilisé (par exemple HS256).

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- **Payload (Charge utile)** : contient les données ou les "claims" que vous voulez transmettre. Les claims peuvent inclure des informations standard (comme iss, sub, exp) ou des informations spécifiques à votre application.

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "exp": 1700000000
}
```

- **Signature :** garantit l’intégrité et l’authenticité du jeton. Elle est générée en combinant le header et le payload, puis en les signant avec une clé secrète ou une paire de clés privée/publique. Un backend qui reçoit un JWT peut savoir, grâce à au secret, que c'est bien lui qui l'a généré et que le payload n'a pas été falsifié.

```js
HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret);
```

## Utilisations courantes des JWT

- **Authentification** : Après qu'un utilisateur se connecte, le serveur génère un JWT contenant des informations comme l'identité de l'utilisateur et des permissions. Le client stocke le JWT (souvent dans les cookies ou le stockage local) et l'envoie avec chaque requête (par exemple, dans l’en-tête Authorization).
- **Autorisation** : Le serveur décode et vérifie le JWT pour déterminer si l'utilisateur est autorisé à accéder à une ressource ou à effectuer une action.

## Avantages des JWT

- **Compact** : Peut être transmis facilement dans les en-têtes HTTP ou les URL.
- **Stateless** : Les JWT sont autoportants, ce qui signifie que le serveur n’a pas besoin de stocker l’état de chaque utilisateur.
- **Sécurisé** : La signature garantit l’intégrité et empêche la falsification.

## Limites des JWT

- **Non révocable** : Une fois émis, un JWT reste valide jusqu’à son expiration, à moins qu’un mécanisme externe (comme une liste noire) ne soit utilisé.
- **Taille** : Les données encodées augmentent la taille du jeton, ce qui peut avoir un impact sur les performances si elles sont trop volumineuses.
- **Expiration** : Nécessite une gestion rigoureuse des durées de validité.

## Que stocker dans la charge utile d'un JWT (payload) ?

Les JWT (JSON Web Tokens) sont conçus pour transporter des revendications (informations) sur un utilisateur. Les informations couramment stockées incluent :

### ✅ Données sûres et utiles à stocker

- **Identifiant utilisateur (User ID)** : Un identifiant unique (par ex., `userId`).
- **Rôles/Permissions** : Pour autoriser rapidement les actions d'un utilisateur (par ex., `role: "admin"`).
- **Expiration** : (`exp` claim) La date et l'heure d'expiration du jeton.
- **Date d'émission** : (`iat` claim) La date et l'heure de création du jeton.

### ❌ Données sensibles à éviter

- **Mots de passe** : Ne jamais stocker de mots de passe ou de hachages de mots de passe.
- **Informations personnelles identifiables (PII)** : Adresse e-mail, adresse postale, numéro de téléphone, etc., sauf si c'est absolument nécessaire.
- **Secrets** : Clés privées, jetons ou autres identifiants sensibles d'application.

Remarque : les JWT ne sont pas chiffrés par défaut (seulement encodés et signés). Toute donnée dans la charge utile peut être décodée par quiconque a accès au jeton.
