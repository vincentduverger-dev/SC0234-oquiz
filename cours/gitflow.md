# Gitflow

Objectif : 
- Accepter le `ochallenge` le premier jour pour générer son propre dépôt à son nom, et le cloner.
- À partir du deuxième jour, et **jusqu'à la fin du projet**, mettre à jour chaque jour son dépôt à partir du code "prof" avant d'entamer le challenge.
- Coder chaque challenge sur une **branche dédiée**, afin de créer des Pull Request et se (faire) relire facilement.

Avantage :
- un seul dépôt pour tout le projet plutôt que de multiple ochallenge redondant
- apprendre à gérer ses branches et sauvegarder son code sur des branches dédiées
- possibilité de créer des Pull Request pour se relire

## 1. Ouvrir votre dépôt

- Ouvrir **votre dépôt** dans VSCode (pas celui du prof) avec un terminal à disposition.
- Fermer éventuellement les onglets ouverts (ça va switcher chéri !).

## 2. (⚠️ À faire une seule fois) Ajouter le remote du prof

A faire **une seul fois pour la saison**, ajouter le remote `prof` :
- Trouver l'URL (SSH !) du dépôt du/de la formatrice (correction/cours) via GitHub ou Kourou.
- Puis, depuis n'importe quelle branche : `git remote add prof URL_SSH_DEPOT_PROF` , ici : `git remote add prof git@github.com:O-clock-Selkie/SC01234-OQUIZ.git`

## 3. (⚠️ Si besoin) Retourner sur `master`

L'objectif ici est de s'assure d'avoir bien sauvegardé le code du challenge de la veille :

- Si vous êtes sur une autre branche que `master` :
  - le `git status` doit être "clean", sinon `commit` & `push` comme d'habitude
    - pour le premier push, il peut être necessaire d'avoir à `git push --set-upstream origin <mabranche>`
  - puis retourner sur `master` : `git checkout master`.

- Si vous aviez codé votre challenge directement sur `master` (par inadvertance, bien sûr 😉) :
  - le `git status` doit être "clean", sinon `commit` & `push` comme d'habitude ;
  - créer et sauvegarder votre travail sur une branche à part : 
    - `git checkout -b <mabranche>` puis `git push --set-upstream origin <mabranche>` ;
  - puis retourner ensuite sur `master` : `git checkout master`.
  

## 4. Récupérer les modifications du prof sur `master`

- S'assurer d'être bien sur la branche `master` :
  - `git branch --show-current`
- Récupèrer le code du prof en local, sans l'intégrer à la branche courante :
  - `git fetch prof`
- Enfin, on écrase la branche courante (`master`) par la branche `main` du dépôt `prof` (d'où l'intérêt d'avoir sauvegarder son code sur une branche à part):
  - `git reset --hard prof/main`
- On push le code du prof sur Github sur notre branche `master`
  - `git push --force`
  
## 4. Créer une nouvelle branche pour un nouveau challenge

Normalement, vous devriez maintenant avoir le code du prof sur votre branche `master` en local !

Il ne reste plus qu'à créer une nouvelle branche pour l'atelier de la journée : 
- `git checkout -b SC0XE0X-challenge` (choisir un nom adapté à la journée, à l'activité...)


## 5. Visuellement

![](../resources/screens/gitflow.png)

