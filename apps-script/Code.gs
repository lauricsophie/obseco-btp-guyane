/**
 * Code.gs — Web App Apps Script pour OBSECO Guyane
 * Reçoit les envois du formulaire GitHub Pages et les écrit
 * dans le Google Sheet lié à ce script.
 *
 * Onglets générés automatiquement :
 *  - "Projets"       : une ligne par projet (infos générales + résumés)
 *  - "Financements"  : une ligne par financeur associé à un projet
 *  - "Difficultes"   : une ligne par difficulté signalée sur un projet, avec son explication
 *  - "Envois"        : une ligne par envoi (traçabilité / anti-doublon)
 */

const SHEET_PROJETS = "Projets";
const SHEET_FINANCEMENTS = "Financements";
const SHEET_DIFFICULTES = "Difficultes";
const SHEET_ENVOIS = "Envois";

const ENTETES_PROJETS = [
  "Horodatage réception", "ID envoi", "ID projet", "Maître d'ouvrage", "Contact nom", "Contact email",
  "Intitulé projet", "Type opération", "Montant estimé (€)", "Phase",
  "Date lancement prévisionnelle", "Durée estimée (mois)", "Commune de localisation",
  "Financement (résumé)", "Difficultés (résumé)"
];

const ENTETES_FINANCEMENTS = [
  "Horodatage réception", "ID envoi", "ID projet", "Maître d'ouvrage", "Intitulé projet", "Financeur", "Montant (€)"
];

const ENTETES_DIFFICULTES = [
  "Horodatage réception", "ID envoi", "ID projet", "Maître d'ouvrage", "Intitulé projet", "Difficulté", "Explication"
];

const ENTETES_ENVOIS = ["Horodatage réception", "ID envoi", "Maître d'ouvrage", "Nb projets"];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const sheetEnvois = getOrCreateSheet(ss, SHEET_ENVOIS, ENTETES_ENVOIS);
    const sheetProjets = getOrCreateSheet(ss, SHEET_PROJETS, ENTETES_PROJETS);
    const sheetFinancements = getOrCreateSheet(ss, SHEET_FINANCEMENTS, ENTETES_FINANCEMENTS);
    const sheetDifficultes = getOrCreateSheet(ss, SHEET_DIFFICULTES, ENTETES_DIFFICULTES);

    const envoisExistants = sheetEnvois.getRange(2, 2, Math.max(sheetEnvois.getLastRow() - 1, 0), 1)
      .getValues().flat();
    if (envoisExistants.includes(data.envoiId)) {
      return jsonResponse({ status: "deja_recu", count: data.projets.length });
    }

    const now = new Date();
    const ident = data.identification;

    sheetEnvois.appendRow([now, data.envoiId, ident.maitreOuvrage, data.projets.length]);

    data.projets.forEach(p => {
      const financements = Array.isArray(p.financements) ? p.financements : [];
      const difficultes = Array.isArray(p.difficultes) ? p.difficultes : [];

      const resumeFinancement = financements
        .map(f => f.financeur + " : " + Number(f.montant).toLocaleString("fr-FR") + " €")
        .join(" | ");
      const resumeDifficultes = difficultes.length
        ? difficultes.map(d => d.label).join(" | ")
        : "Aucune difficulté signalée";

      sheetProjets.appendRow([
        now, data.envoiId, p.id, ident.maitreOuvrage, ident.contactNom, ident.contactEmail,
        p.intitule, p.typeOperation, p.montant, p.phase,
        p.dateLancement, p.duree, p.commune,
        resumeFinancement, resumeDifficultes
      ]);

      financements.forEach(f => {
        sheetFinancements.appendRow([now, data.envoiId, p.id, ident.maitreOuvrage, p.intitule, f.financeur, f.montant]);
      });

      if (difficultes.length === 0) {
        sheetDifficultes.appendRow([now, data.envoiId, p.id, ident.maitreOuvrage, p.intitule, "Aucune difficulté signalée", ""]);
      } else {
        difficultes.forEach(d => {
          sheetDifficultes.appendRow([now, data.envoiId, p.id, ident.maitreOuvrage, p.intitule, d.label, d.explication || ""]);
        });
      }
    });

    return jsonResponse({ status: "ok", count: data.projets.length });
  } catch (err) {
    return jsonResponse({ status: "erreur", message: err.message });
  }
}

function getOrCreateSheet(ss, nom, entetes) {
  let sheet = ss.getSheetByName(nom);
  if (!sheet) {
    sheet = ss.insertSheet(nom);
    sheet.appendRow(entetes);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Fonction de test manuel depuis l'éditeur Apps Script (menu Exécuter > testDoPost)
function testDoPost() {
  const fauxEvent = {
    postData: {
      contents: JSON.stringify({
        envoiId: "test-" + Date.now(),
        identification: { maitreOuvrage: "Mairie de Cayenne", contactNom: "Test", contactEmail: "test@test.fr" },
        projets: [{
          id: "p-test-1", intitule: "Réhabilitation groupe scolaire",
          typeOperation: "Bâtiment", montant: "1200000", phase: "APD",
          dateLancement: "2027-01", duree: "18", commune: "Cayenne",
          financements: [
            { financeur: "État (DSIL, DETR, CPER, contrat de convergence...)", montant: 800000 },
            { financeur: "Autofinancement collectivité", montant: 400000 }
          ],
          difficultes: [
            { label: "Difficulté foncière", explication: "Indivision non résolue sur la parcelle concernée." },
            { label: "Réseaux électricité / énergie", explication: "Délai de raccordement EDF estimé à 8 mois." }
          ]
        }]
      })
    }
  };
  Logger.log(doPost(fauxEvent).getContent());
}
