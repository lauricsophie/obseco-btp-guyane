# OBSECO Guyane — Plateforme de recensement des projets d'investissement BTP

Formulaire en ligne gratuit et open source pour la campagne ponctuelle de recensement des projets d'investissement en travaux auprès des mairies, EPCI, CTG, DGTM et CHU de Guyane, pour la CERC Guyane (dispositif SPOT/OBSECO).

## Fonctionnement

- Front-end statique (HTML/CSS/JS) hébergé gratuitement sur **GitHub Pages**.
- Sauvegarde des réponses dans un **Google Sheet**, via un Web App **Google Apps Script** qui reçoit les envois en `POST`.
- Sauvegarde locale (`localStorage`) permettant à chaque répondant d'interrompre et reprendre sa saisie sans compte ni mot de passe.
- Gamification individuelle uniquement : barre de progression, compteur personnel, messages de valorisation — aucun classement entre structures.

## Démarrage rapide

1. Suivre `docs/PLAN_DEPLOIEMENT.md` pour créer le Google Sheet, déployer le Web App Apps Script et publier le site sur GitHub Pages.
2. Renseigner l'URL du Web App dans `js/config.js` (`WEBAPP_URL`).
3. Adapter si besoin les listes déroulantes dans `js/config.js`.
4. Diffuser le lien du site avec le modèle `docs/EMAIL_LANCEMENT.md`.

## Licence

MIT — réutilisation libre, y compris à des fins commerciales, avec attribution.
