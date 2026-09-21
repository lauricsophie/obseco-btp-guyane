// ============================================================
// app.js — Logique du parcours, sauvegarde locale, gamification
// ============================================================

const DRAFT_KEY = "obseco_draft_v1";

let draft = {
  identification: null,
  projets: []
};

function uuid() {
  return 'p-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}

function saveDraft() {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function loadDraft() {
  const raw = localStorage.getItem(DRAFT_KEY);
  return raw ? JSON.parse(raw) : null;
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
  draft = { identification: null, projets: [] };
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function setProgress(pct) {
  document.getElementById("progressFill").style.width = pct + "%";
}

function updateCounter() {
  const n = draft.projets.length;
  document.getElementById("personalCounter").textContent = "Projets renseignés : " + n;
  document.getElementById("confCount").textContent = n;
}

function fillSelect(elId, values) {
  const el = document.getElementById(elId);
  el.innerHTML = '<option value="">-- Sélectionner --</option>' +
    values.map(v => `<option value="${v}">${v}</option>`).join("");
}

function initSelects() {
  fillSelect("maitreOuvrage", MAITRES_OUVRAGE);
  fillSelect("typeOperation", TYPES_OPERATION);
  fillSelect("phase", PHASES);
  fillSelect("commune", COMMUNES);
  fillSelect("financement", MODES_FINANCEMENT);
}

function initAccueil() {
  const existing = loadDraft();
  if (existing && (existing.projets.length > 0 || existing.identification)) {
    document.getElementById("resumeBox").classList.remove("hidden");
    document.getElementById("resumeCount").textContent = existing.projets.length;
  }
}

document.getElementById("btnResume").addEventListener("click", () => {
  draft = loadDraft();
  updateCounter();
  if (draft.identification) {
    document.getElementById("maitreOuvrage").value = draft.identification.maitreOuvrage;
    document.getElementById("contactNom").value = draft.identification.contactNom;
    document.getElementById("contactEmail").value = draft.identification.contactEmail;
    setProgress(20);
    showScreen("screen-projet");
  } else {
    setProgress(10);
    showScreen("screen-identification");
  }
});

document.getElementById("btnRestart").addEventListener("click", () => {
  clearDraft();
  setProgress(10);
  showScreen("screen-identification");
});

document.getElementById("btnStart").addEventListener("click", () => {
  setProgress(10);
  showScreen("screen-identification");
});

document.getElementById("btnIdentSuivant").addEventListener("click", () => {
  const mo = document.getElementById("maitreOuvrage").value;
  const nom = document.getElementById("contactNom").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  if (!mo || !nom || !email) {
    alert("Merci de compléter les trois champs avant de continuer.");
    return;
  }
  draft.identification = { maitreOuvrage: mo, contactNom: nom, contactEmail: email };
  saveDraft();
  setProgress(20);
  showScreen("screen-projet");
});

const CHAMPS_PROJET = ["intitule","typeOperation","montant","phase","dateLancement","duree","commune","financement"];

function progressionSaisie() {
  const remplis = CHAMPS_PROJET.filter(id => document.getElementById(id).value.trim() !== "").length;
  const pct = 20 + Math.round((remplis / CHAMPS_PROJET.length) * 60);
  setProgress(pct);
}

CHAMPS_PROJET.forEach(id => {
  document.getElementById(id).addEventListener("input", progressionSaisie);
  document.getElementById(id).addEventListener("change", progressionSaisie);
});

function resetFormulaireProjet() {
  CHAMPS_PROJET.forEach(id => document.getElementById(id).value = "");
}

document.getElementById("btnAnnulerProjet").addEventListener("click", () => {
  resetFormulaireProjet();
  showScreen("screen-recap");
  renderRecap();
});

document.getElementById("btnEnregistrerProjet").addEventListener("click", () => {
  const valeurs = {};
  for (const id of CHAMPS_PROJET) {
    const val = document.getElementById(id).value.trim();
    if (!val) {
      alert("Merci de compléter tous les champs du projet.");
      return;
    }
    valeurs[id] = val;
  }
  valeurs.id = uuid();
  valeurs.maitreOuvrage = draft.identification.maitreOuvrage;
  draft.projets.push(valeurs);
  saveDraft();
  updateCounter();
  resetFormulaireProjet();
  setProgress(90);
  showScreen("screen-confirmation");
});

document.getElementById("btnAjouterAutre").addEventListener("click", () => {
  setProgress(20);
  showScreen("screen-projet");
});

document.getElementById("btnAllerRecap").addEventListener("click", () => {
  renderRecap();
  showScreen("screen-recap");
});

function renderRecap() {
  const cont = document.getElementById("recapListe");
  if (draft.projets.length === 0) {
    cont.innerHTML = "<p>Aucun projet saisi pour le moment.</p>";
    return;
  }
  cont.innerHTML = draft.projets.map(p => `
    <div class="recap-item">
      <div>
        <strong>${p.intitule}</strong><br>
        <small>${p.typeOperation} — ${p.commune} — ${Number(p.montant).toLocaleString('fr-FR')} € — ${p.phase}</small>
      </div>
      <button data-id="${p.id}">Supprimer</button>
    </div>
  `).join("");

  cont.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      draft.projets = draft.projets.filter(p => p.id !== id);
      saveDraft();
      updateCounter();
      renderRecap();
    });
  });
}

document.getElementById("btnRetourAjout").addEventListener("click", () => {
  setProgress(20);
  showScreen("screen-projet");
});

document.getElementById("btnEnvoyerFinal").addEventListener("click", async () => {
  if (draft.projets.length === 0) {
    alert("Ajoutez au moins un projet avant l'envoi.");
    return;
  }
  const btn = document.getElementById("btnEnvoyerFinal");
  btn.disabled = true;
  btn.textContent = "Envoi en cours...";

  const payload = {
    identification: draft.identification,
    projets: draft.projets,
    envoiId: uuid(),
    horodatage: new Date().toISOString()
  };

  try {
    await fetch(WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    document.getElementById("merciTexte").textContent =
      `Votre contribution (${draft.projets.length} projet(s)) a bien été transmise à l'observatoire OBSECO. Merci pour votre implication dans la connaissance du BTP guyanais.`;
    setProgress(100);
    showScreen("screen-merci");
    clearDraft();
  } catch (err) {
    alert("Une erreur est survenue lors de l'envoi. Vos données restent sauvegardées localement, vous pouvez réessayer.");
    btn.disabled = false;
    btn.textContent = "Envoyer définitivement";
  }
});

initSelects();
initAccueil();
updateCounter();
