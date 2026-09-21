# Plan de déploiement — une seule personne, sans développeur

Durée totale estimée : 45 à 60 minutes, une seule fois.

## Étape 1 — Créer le Google Sheet de réception

1. Créez un nouveau Google Sheet, nommez-le par exemple `OBSECO_Guyane_Reponses_2026`.
2. Ne créez pas les onglets manuellement : le script `Code.gs` les crée automatiquement au premier envoi reçu.

## Étape 2 — Créer le projet Apps Script lié

1. Dans le Sheet, allez dans `Extensions > Apps Script`.
2. Collez le contenu du fichier `apps-script/Code.gs`.
3. Créez le fichier manifest `appsscript.json` et collez le contenu fourni.
4. Enregistrez (`Ctrl+S`).

## Étape 3 — Tester avant déploiement

1. Sélectionnez `testDoPost` puis `Exécuter`, autorisez les permissions.
2. Vérifiez l'apparition d'une ligne test dans `Projets` et `Envois`, puis supprimez-la.

## Étape 4 — Déployer le Web App

1. `Déployer > Nouveau déploiement > Application Web`.
2. Exécuter en tant que : Moi. Accès : Tout le monde.
3. Copiez l'URL `/exec` fournie.

## Étape 5 — Configurer le front-end

Remplacez `WEBAPP_URL` dans `js/config.js` par l'URL copiée.

## Étape 6 — Publier sur GitHub Pages

`Settings > Pages > Deploy from a branch > main > /root`.

## Étape 7 — Test de bout en bout puis lancement de la campagne.
