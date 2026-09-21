/**
 * Code.gs — Web App Apps Script pour OBSECO Guyane
 * Reçoit les envois du formulaire GitHub Pages et les écrit
 * dans le Google Sheet lié à ce script.
 */

const SHEET_PROJETS = "Projets";
const SHEET_ENVOIS = "Envois";

const ENTETES_PROJETS = [
  "Horodatage réception", "ID envoi", "Maître d'ouvrage", "Contact nom", "Contact email",
  "Intitulé projet", "Type opération", "Montant estimé (€)", "Phase",
  "Date lancement prévisionnelle", "Durée estimée (mois)", "Commune de localisation",
  "Mode de financement", "ID projet"
];

const ENTETES_ENVOIS = ["Horodatage réception", "ID envoi", "Maître d'ouvrage", "Nb projets"];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const sheetEnvois = getOrCreateSheet(ss, SHEET_ENVOIS, ENTETES_ENVOIS);
    const sheetProjets = getOrCreateSheet(ss, SHEET_PROJETS, ENTETES_PROJETS);

    const envoisExistants = sheetEnvois.getRange(2, 2, Math.max(sheetEnvois.getLastRow() - 1, 0), 1)
      .getValues().flat();
    if (envoisExistants.includes(data.envoiId)) {
      return jsonResponse({ status: "deja_recu", count: data.projets.length });
    }

    const now = new Date();
    const ident = data.identification;

    sheetEnvois.appendRow([now, data.envoiId, ident.maitreOuvrage, data.projets.length]);

    data.projets.forEach(p => {
      sheetProjets.appendRow([
        now,
        data.envoiId,
        ident.maitreOuvrage,
        ident.contactNom,
        ident.contactEmail,
        p.intitule,
        p.typeOperation,
        p.montant,
        p.phase,
        p.dateLancement,
        p.duree,
        p.commune,
        p.financement,
        p.id
      ]);
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
          financement: "État (DSIL, DETR, CPER, contrat de convergence...)"
        }]
      })
    }
  };
  Logger.log(doPost(fauxEvent).getContent());
}
