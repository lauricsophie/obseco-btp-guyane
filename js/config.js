// ============================================================
// config.js — Listes métier modifiables sans toucher à app.js
// ============================================================

// URL du Web App Apps Script déployé (voir docs/PLAN_DEPLOIEMENT.md étape 4)
const WEBAPP_URL = "COLLEZ_ICI_VOTRE_URL_WEB_APP_APPS_SCRIPT";

// Liste des maîtres d'ouvrage : 22 communes + 4 EPCI + CTG + DGTM + CHU
const MAITRES_OUVRAGE = [
  "Mairie de Apatou",
  "Mairie de Awala-Yalimapo",
  "Mairie de Camopi",
  "Mairie de Cayenne",
  "Mairie de Grand-Santi",
  "Mairie de Iracoubo",
  "Mairie de Kourou",
  "Mairie de Macouria",
  "Mairie de Mana",
  "Mairie de Maripasoula",
  "Mairie de Matoury",
  "Mairie de Montsinéry-Tonnegrande",
  "Mairie de Ouanary",
  "Mairie de Papaïchton",
  "Mairie de Régina",
  "Mairie de Remire-Montjoly",
  "Mairie de Roura",
  "Mairie de Saint-Élie",
  "Mairie de Saint-Georges",
  "Mairie de Saint-Laurent-du-Maroni",
  "Mairie de Saül",
  "Mairie de Sinnamary",
  "CACL — Communauté d'Agglomération du Centre Littoral",
  "CCOG — Communauté de Communes de l'Ouest Guyanais",
  "CCEG — Communauté de Communes de l'Est Guyanais",
  "CCDS — Communauté de Communes des Savanes",
  "CTG — Collectivité Territoriale de Guyane",
  "DGTM — Direction Générale des Territoires et de la Mer",
  "CHU de Guyane"
];

const COMMUNES = [
  "Apatou","Awala-Yalimapo","Camopi","Cayenne","Grand-Santi","Iracoubo","Kourou",
  "Macouria","Mana","Maripasoula","Matoury","Montsinéry-Tonnegrande","Ouanary",
  "Papaïchton","Régina","Remire-Montjoly","Roura","Saint-Élie","Saint-Georges",
  "Saint-Laurent-du-Maroni","Saül","Sinnamary","Ensemble du territoire (projet multi-communes)"
];

const TYPES_OPERATION = [
  "Bâtiment",
  "VRD",
  "Réseaux (eau, assainissement, énergie...)",
  "Logement social",
  "Énergie / production ou distribution",
  "Autre"
];

const PHASES = [
  "Études préalables",
  "APS — Avant-Projet Sommaire",
  "APD — Avant-Projet Détaillé",
  "Consultation / appel d'offres",
  "Travaux en cours"
];

const MODES_FINANCEMENT = [
  "Autofinancement collectivité",
  "État (DSIL, DETR, CPER, contrat de convergence...)",
  "Union Européenne (FEDER, FEADER...)",
  "CTG",
  "Emprunt",
  "Financement mixte",
  "Non déterminé à ce stade"
];
