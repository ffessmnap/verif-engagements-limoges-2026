const state = {
  sources: {
    dijon: [],
    rennes: [],
    aix: [],
    jsEntries: [],
    cadetEntries: [],
    bonusEntries: []
  },
  relaySources: {
    jsEntries: [],
    cadetEntries: [],
    bonusEntries: []
  },
  relayTeams: [],
  labels: {},
  athletes: [],
  issues: [],
  bonusChecks: [],
  clubSummary: [],
  eventSummary: [],
  manualIssueReviews: loadStoredIssueReviews(),
  manualIssueComments: loadStoredIssueComments(),
  athleteSort: { key: "club", direction: "asc" }
  ,
  eventSummarySex: "all"
};

const COMPETITION_YEAR = 2026;

const refs = {
  dijonFile: document.querySelector("#dijonFile"),
  rennesFile: document.querySelector("#rennesFile"),
  aixFile: document.querySelector("#aixFile"),
  jsEntriesFile: document.querySelector("#jsEntriesFile"),
  cadetEntriesFile: document.querySelector("#cadetEntriesFile"),
  bonusEntriesFile: document.querySelector("#bonusEntriesFile"),
  folderPicker: document.querySelector("#folderPicker"),
  loadWorkspaceFiles: document.querySelector("#loadWorkspaceFiles"),
  loadDemo: document.querySelector("#loadDemo"),
  runChecks: document.querySelector("#runChecks"),
  toggleImports: document.querySelector("#toggleImports"),
  importsBody: document.querySelector("#importsBody"),
  exportReport: document.querySelector("#exportReport"),
  exportDetailedReport: document.querySelector("#exportDetailedReport"),
  exportClubSummary: document.querySelector("#exportClubSummary"),
  exportEventSummary: document.querySelector("#exportEventSummary"),
  exportClubPdf: document.querySelector("#exportClubPdf"),
  exportViewer: document.querySelector("#exportViewer"),
  datasetMeta: document.querySelector("#datasetMeta"),
  totalAthletes: document.querySelector("#totalAthletes"),
  totalEntries: document.querySelector("#totalEntries"),
  totalIssues: document.querySelector("#totalIssues"),
  nonCompliantIssues: document.querySelector("#nonCompliantIssues"),
  pendingIssues: document.querySelector("#pendingIssues"),
  reviewedIssues: document.querySelector("#reviewedIssues"),
  relayOnlyCount: document.querySelector("#relayOnlyCount"),
  searchInput: document.querySelector("#searchInput"),
  clubFilter: document.querySelector("#clubFilter"),
  eventFilter: document.querySelector("#eventFilter"),
  categoryFilter: document.querySelector("#categoryFilter"),
  sexFilter: document.querySelector("#sexFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  nonCompliantOnly: document.querySelector("#nonCompliantOnly"),
  meetingMissingOnly: document.querySelector("#meetingMissingOnly"),
  resetFilters: document.querySelector("#resetFilters"),
  athletesBody: document.querySelector("#athletesBody"),
  issuesBody: document.querySelector("#issuesBody"),
  bonusBody: document.querySelector("#bonusBody"),
  relaysBody: document.querySelector("#relaysBody"),
  clubsBody: document.querySelector("#clubsBody"),
  eventsBody: document.querySelector("#eventsBody"),
  todoBody: document.querySelector("#todoBody"),
  athletesTable: document.querySelector("#athletesTable"),
  issuesTable: document.querySelector("#issuesTable"),
  bonusTable: document.querySelector("#bonusTable"),
  relaysTable: document.querySelector("#relaysTable"),
  clubsTable: document.querySelector("#clubsTable"),
  eventsTable: document.querySelector("#eventsTable"),
  todoTable: document.querySelector("#todoTable"),
  eventSummaryControls: document.querySelector("#eventSummaryControls"),
  eventSummaryButtons: [...document.querySelectorAll(".event-summary-button")],
  tabButtons: [...document.querySelectorAll(".tab-button")],
  athleteDialog: document.querySelector("#athleteDialog"),
  closeAthleteDialog: document.querySelector("#closeAthleteDialog"),
  athleteDialogClub: document.querySelector("#athleteDialogClub"),
  athleteDialogTitle: document.querySelector("#athleteDialogTitle"),
  athleteDialogMeta: document.querySelector("#athleteDialogMeta"),
  athleteEntriesBody: document.querySelector("#athleteEntriesBody"),
  athleteResultsBody: document.querySelector("#athleteResultsBody")
};

const demo = {
  dijon: `club;licence;nom;prenom;categorie;epreuve
Palmes Limoges;A100;Martin;Lea;junior;100 SF
Cap Ouest;A200;Bernard;Malo;senior;200 BI
Onde Bleue;A300;Petit;Nina;junior;50 AP`,
  rennes: `club;licence;nom;prenom;categorie;epreuve
Palmes Limoges;A100;Martin;Lea;junior;200 SF
Onde Bleue;A300;Petit;Nina;junior;100 SF`,
  aix: `club;licence;nom;prenom;categorie;epreuve
Cap Ouest;A200;Bernard;Malo;senior;400 SF`,
  jsEntries: `club;licence;nom;prenom;categorie;epreuve
Palmes Limoges;A100;Martin;Lea;junior;100 SF
Cap Ouest;A200;Bernard;Malo;senior;200 BI
Onde Bleue;A300;Petit;Nina;junior;4x100 SF
Grand Sud;A400;Robert;Enzo;senior;50 AP`,
  cadetEntries: `club;licence;nom;prenom;categorie;epreuve
Palmes Limoges;C500;Durand;Lise;cadet;100 SF
Cap Ouest;C600;Garcia;Noe;cadet;4x100 SF`,
  bonusEntries: `club;licence;nom;prenom;categorie;epreuve
Palmes Limoges;A100;Martin;Lea;junior;200 SF
Cap Ouest;A200;Bernard;Malo;senior;100 BI
Onde Bleue;A300;Petit;Nina;junior;400 SF`
};

bindUpload(refs.dijonFile, "dijon");
bindUpload(refs.rennesFile, "rennes");
bindUpload(refs.aixFile, "aix");
bindUpload(refs.jsEntriesFile, "jsEntries");
bindUpload(refs.cadetEntriesFile, "cadetEntries");
bindUpload(refs.bonusEntriesFile, "bonusEntries");
refs.folderPicker.addEventListener("change", handleFolderSelection);

refs.loadDemo.addEventListener("click", () => {
  Object.entries(demo).forEach(([key, text]) => {
    state.sources[key] = parseStructuredText(text);
    updateRelaySource(key, text);
    state.labels[key] = `exemple ${key}`;
  });
  summarizeDatasets();
  runChecks();
});

refs.loadWorkspaceFiles.addEventListener("click", loadWorkspaceFiles);
refs.toggleImports.addEventListener("click", toggleImportsPanel);

refs.runChecks.addEventListener("click", runChecks);
refs.searchInput.addEventListener("input", handleFilterChange);
refs.clubFilter.addEventListener("change", handleFilterChange);
refs.eventFilter.addEventListener("change", handleEventFilterChange);
refs.categoryFilter.addEventListener("change", handleFilterChange);
refs.sexFilter.addEventListener("change", handleFilterChange);
refs.statusFilter.addEventListener("change", handleFilterChange);
refs.nonCompliantOnly.addEventListener("change", handleFilterChange);
refs.meetingMissingOnly.addEventListener("change", handleFilterChange);
refs.resetFilters.addEventListener("click", resetFilters);
refs.exportReport.addEventListener("click", exportReport);
refs.exportDetailedReport.addEventListener("click", exportDetailedReport);
refs.exportClubSummary.addEventListener("click", exportClubSummary);
refs.exportEventSummary.addEventListener("click", exportEventSummary);
refs.exportClubPdf.addEventListener("click", exportClubPdf);
refs.exportViewer.addEventListener("click", exportViewer);
refs.eventSummaryButtons.forEach((button) => button.addEventListener("click", () => setEventSummarySex(button.dataset.eventSex)));
refs.tabButtons.forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
refs.athletesBody.addEventListener("click", handleAthleteRowClick);
refs.issuesBody.addEventListener("click", handleAthleteRowClick);
refs.bonusBody.addEventListener("click", handleAthleteRowClick);
refs.todoBody.addEventListener("click", handleAthleteRowClick);
refs.issuesBody.addEventListener("click", handleIssueReviewClick);
refs.issuesBody.addEventListener("input", handleIssueCommentChange);
refs.todoBody.addEventListener("click", handleIssueReviewClick);
refs.athletesTable.querySelector("thead").addEventListener("click", handleAthleteSortClick);
refs.closeAthleteDialog.addEventListener("click", closeAthleteDialog);
refs.athleteDialog.addEventListener("click", (event) => {
  if (event.target.dataset.closeDialog === "true") closeAthleteDialog();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAthleteDialog();
});

function bindUpload(input, key) {
  input.addEventListener("change", async (event) => {
    const [file] = event.target.files;
    if (!file) return;
    state.sources[key] = parseStructuredText(await file.text());
    updateRelaySource(key, await file.text());
    state.labels[key] = file.name;
    summarizeDatasets();
    runChecksIfReady();
  });
}

function parseStructuredText(text) {
  const lines = text.replace(/\r/g, "").split("\n").filter((line) => line.trim());
  if (lines.some((line) => line.startsWith("NAG;") || line.startsWith("REL;") || line.startsWith("CLU;"))) {
    return parseEnapText(lines);
  }
  if (lines.length < 2) return [];
  const delimiter = chooseDelimiter(lines[0]);
  const headers = splitDelimitedLine(lines[0], delimiter).map(normalizeHeader);
  return lines.slice(1).map((line, index) => {
    const values = splitDelimitedLine(line, delimiter);
    const row = { __line: index + 2 };
    headers.forEach((header, columnIndex) => {
      row[header] = (values[columnIndex] || "").trim();
    });
    return normalizeRow(row);
  });
}

async function loadWorkspaceFiles() {
  const manifest = {
    dijon: "Résultats Dijon France Club.txt",
    rennes: "Résultats Meeting Rennes.txt",
    aix: "Résultats meeting Aix.txt",
    jsEntries: "fichiers tct/engagements-txt-limoges-22-05-2026__junior senior.txt",
    cadetEntries: "fichiers tct/engagements-txt-limoges-22-05-2026__cadet.txt",
    bonusEntries: "fichiers tct/engagements-txt-limoges-22-05-2026__bonus.txt"
  };

  const fallbackManifest = {
    dijon: "fichiers tct/Résultats Dijon France Club.txt",
    rennes: "fichiers tct/Résultats Meeting Rennes.txt",
    aix: "fichiers tct/Résultats meeting Aix.txt",
    jsEntries: "fichiers tct/engagements-txt-limoges-22-05-2026_junior senior.txt",
    cadetEntries: "fichiers tct/engagements-txt-limoges-22-05-2026_Cadet.txt",
    bonusEntries: "fichiers tct/engagements-txt-limoges-22-05-2026_Bonus.txt"
  };

  Object.assign(manifest, {
    dijon: "fichiers tct/Résultats Dijon France Club.txt",
    rennes: "fichiers tct/Résultats Meeting Rennes.txt",
    aix: "fichiers tct/Résultats meeting Aix.txt"
  });
  Object.assign(fallbackManifest, {
    dijon: "fichiers tct/Résultats Dijon France Club.txt",
    rennes: "fichiers tct/Résultats Meeting Rennes.txt",
    aix: "fichiers tct/Résultats meeting Aix.txt"
  });

  const loads = await Promise.all(Object.entries(manifest).map(async ([key, filename]) => {
    const primary = await fetch(pathToFetch(filename));
    const fallbackPath = fallbackManifest[key];
    const fallback = primary.ok || !fallbackPath
      ? primary
      : await fetch(pathToFetch(fallbackPath));
    if (!fallback.ok) throw new Error(`Fichier introuvable: ${filename}`);
    return [key, fallbackPath && !primary.ok ? fallbackPath : filename, await fallback.text()];
  }));

  loads.forEach(([key, filename, text]) => {
    state.sources[key] = parseStructuredText(text);
    updateRelaySource(key, text);
    state.labels[key] = filename;
  });
  summarizeDatasets();
  runChecks();
}

function pathToFetch(path) {
  return `./${String(path).split("/").map(encodeURIComponent).join("/")}`;
}

async function handleFolderSelection(event) {
  const files = [...(event.target.files || [])].filter((file) => /\.(txt|csv)$/i.test(file.name));
  const matches = classifyFolderFiles(files);
  const requiredKeys = ["dijon", "rennes", "aix", "jsEntries", "cadetEntries", "bonusEntries"];
  const missing = requiredKeys.filter((key) => !matches[key]);

  await Promise.all(Object.entries(matches).map(async ([key, file]) => {
    if (!file) return;
    const text = await file.text();
    state.sources[key] = parseStructuredText(text);
    updateRelaySource(key, text);
    state.labels[key] = file.webkitRelativePath || file.name;
  }));

  summarizeDatasets();
  runChecks();
  if (missing.length) {
    refs.datasetMeta.textContent += ` | Fichiers non reconnus: ${missing.map(humanSource).join(", ")}`;
  }
}

function runChecksIfReady() {
  const ready = ["dijon", "rennes", "aix", "jsEntries", "cadetEntries", "bonusEntries"]
    .every((key) => state.sources[key].length > 0);
  if (ready) runChecks();
}

function classifyFolderFiles(files) {
  const classified = {
    dijon: null,
    rennes: null,
    aix: null,
    jsEntries: null,
    cadetEntries: null,
    bonusEntries: null
  };

  files.forEach((file) => {
    const name = normalizeText(file.name).replace(/[_-]+/g, " ");
    if (!classified.dijon && name.includes("dijon")) classified.dijon = file;
    else if (!classified.rennes && name.includes("rennes")) classified.rennes = file;
    else if (!classified.aix && name.includes("aix")) classified.aix = file;
    else if (!classified.bonusEntries && name.includes("bonus")) classified.bonusEntries = file;
    else if (!classified.cadetEntries && name.includes("cadet")) classified.cadetEntries = file;
    else if (!classified.jsEntries && isJuniorSeniorFilename(name)) classified.jsEntries = file;
  });

  return classified;
}

function isJuniorSeniorFilename(name) {
  return name.includes("junior senior")
    || (name.includes("junior") && name.includes("senior"));
}

function parseEnapText(lines) {
  const rows = [];
  const clubs = new Map();

  lines.forEach((line, index) => {
    const parts = line.split(";").map((part) => part.trim());
    const type = parts[0];

    if (type === "CLU") {
      const code = parts[1] || "";
      const name = parts[2] || code;
      if (code) clubs.set(code, name);
      return;
    }

    if (type !== "NAG") return;

    const clubCode = parts[5] || "";
    rows.push(normalizeRow({
      __line: index + 1,
      club: clubs.get(clubCode) ? `${clubCode} - ${clubs.get(clubCode)}` : clubCode,
      club_code: clubCode,
      licence: extractLicence(parts),
      nom: parts[1] || "",
      prenom: parts[2] || "",
      naissance: parts[3] || "",
      sexe: parts[4] || "",
      categorie: parts[9] || "",
      epreuve: parts[7] || "",
      temps: extractEnapTime(parts),
      resultatStatut: extractResultStatus(parts),
      resultatMotif: extractResultReason(parts)
    }));
  });

  return rows;
}

function updateRelaySource(key, text) {
  if (!["jsEntries", "cadetEntries", "bonusEntries"].includes(key)) return;
  state.relaySources[key] = parseRelayTeams(text, key);
  state.relayTeams = Object.values(state.relaySources).flat();
}

function parseRelayTeams(text, sourceKey) {
  const lines = text.replace(/\r/g, "").split("\n").filter((line) => line.trim());
  const clubs = new Map();
  const relays = [];

  lines.forEach((line) => {
    const parts = line.split(";").map((part) => part.trim());
    if (parts[0] === "CLU") {
      if (parts[1]) clubs.set(parts[1], parts[2] || parts[1]);
      return;
    }
    if (parts[0] !== "REL") return;
    const clubCode = parts[1] || "";
    relays.push({
      club: clubs.get(clubCode) ? `${clubCode} - ${clubs.get(clubCode)}` : clubCode,
      clubCode,
      categorie: parts[2] || "",
      epreuve: normalizeEvent(parts[3] || ""),
      temps: parts[4] || "",
      sourceKey
    });
  });

  return relays;
}

function extractEnapTime(parts) {
  if (parts.length >= 23) return parts[15] || parts[8] || "";
  return parts[8] || "";
}

function extractResultStatus(parts) {
  return parts.length >= 23 ? normalizeText(parts[10] || "").toUpperCase() : "";
}

function extractResultReason(parts) {
  return parts.length >= 23 ? (parts[16] || "").trim() : "";
}

function extractLicence(parts) {
  for (let index = parts.length - 1; index >= 0; index -= 1) {
    const value = parts[index];
    if (/^[A-Za-z0-9]+$/.test(value || "") && value !== "NAG") {
      return value;
    }
  }
  return "";
}

function chooseDelimiter(header) {
  if (header.includes(";")) return ";";
  if (header.includes("\t")) return "\t";
  return ",";
}

function splitDelimitedLine(line, delimiter) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

function normalizeHeader(header) {
  return String(header || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function normalizeRow(row) {
  const rawCategory = normalizeCategory(firstValue(row, ["categorie", "category", "cat"]));
  return {
    ...row,
    club: firstValue(row, ["club", "structure", "equipe"]),
    licence: firstValue(row, ["licence", "license", "id", "numero_licence"]),
    nom: firstValue(row, ["nom", "name"]),
    prenom: firstValue(row, ["prenom", "first_name"]),
    categorie: rawCategory || categoryFromBirthDate(firstValue(row, ["naissance", "date_naissance", "birth", "dob"])),
    epreuve: normalizeEvent(firstValue(row, ["epreuve", "course", "event", "nage"]))
  };
}

function firstValue(row, keys) {
  for (const key of keys) {
    if (row[key]) return row[key];
  }
  return "";
}

function normalizeCategory(value) {
  const normalized = normalizeText(value);
  if (["fca", "hca"].includes(normalized)) return "cadet";
  if (["fju", "hju", "fje", "hje"].includes(normalized)) return "junior";
  if (["fse", "hse", "xse"].includes(normalized)) return "senior";
  if (normalized.startsWith("cad")) return "cadet";
  if (normalized.startsWith("jun")) return "junior";
  if (normalized.startsWith("sen")) return "senior";
  return normalized;
}

function categoryFromBirthDate(value) {
  const match = String(value || "").match(/(\d{4})$/);
  if (!match) return "";
  const birthYear = Number(match[1]);
  if (!birthYear) return "";
  const age = COMPETITION_YEAR - birthYear;
  if (age >= 19) return "senior";
  if (age >= 17) return "junior";
  if (age >= 15) return "cadet";
  return "";
}

function normalizeEvent(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toUpperCase();
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function athleteKey(row) {
  const personKey = `${normalizePersonName(row.nom)}|${normalizeBirthDate(row.naissance)}`;
  const identityKey = `${row.nom || ""}|${row.naissance || ""}|${row.club_code || row.club || ""}`;
  const fallbackKey = row.licence || `${row.prenom || ""}|${row.nom || ""}|${row.club || ""}`;
  return personKey.replace(/\|/g, "") ? personKey : normalizeText(identityKey.replace(/\|/g, "") ? identityKey : fallbackKey);
}

function normalizePersonName(value) {
  return normalizeText(value).replace(/[^a-z0-9]/g, "");
}

function normalizeBirthDate(value) {
  return String(value || "").replace(/[^0-9]/g, "");
}

function displayName(row) {
  return `${row.prenom || ""} ${row.nom || ""}`.trim() || "Nageur non renseigne";
}

function isRelay(event) {
  return event === "REL" || /(^| )4X|RELAIS/.test(event);
}

function runChecks() {
  const results = mergeRows(["dijon", "rennes", "aix"]);
  const jsEntries = state.sources.jsEntries;
  const cadetEntries = state.sources.cadetEntries;
  const bonusEntries = state.sources.bonusEntries;
  const resultIndex = indexResults(results);
  const grouped = new Map();
  const issues = [];
  const bonusChecks = [];

  mergeRows(["jsEntries", "cadetEntries"]).forEach((entry) => {
    const key = athleteKey(entry);
    if (!grouped.has(key)) {
      grouped.set(key, {
        key,
        club: entry.club || "Club non renseigne",
        clubCode: entry.club_code || "",
        swimmer: displayName(entry),
        nom: entry.nom || "",
        prenom: entry.prenom || "",
        naissance: entry.naissance || "",
        sexe: entry.sexe || "",
        categorie: entry.categorie || "non renseignee",
        entries: [],
        individualEntries: [],
        relayEntries: [],
        bonusEntries: [],
        results: [],
        matchQuality: "certain",
        presentAtRennes: false,
        presentAtDijon: false,
        presentAtAix: false,
        jsStatus: "conforme",
        meetingSummary: "-"
      });
    }
    const athlete = grouped.get(key);
    enrichAthleteFromEntry(athlete, entry);
    athlete.entries.push(entry);
    if (isRelay(entry.epreuve)) athlete.relayEntries.push(entry);
    else athlete.individualEntries.push(entry);
  });

  bonusEntries.forEach((entry) => {
    const athlete = grouped.get(athleteKey(entry));
    if (athlete) enrichAthleteFromEntry(athlete, entry);
  });

  grouped.forEach((athlete) => {
    const resultMatch = matchedResultsForAthlete(athlete, resultIndex);
    const swimmerResults = resultMatch.rows;
    athlete.results = swimmerResults;
    athlete.matchQuality = resultMatch.fragile ? "probable" : athlete.matchQuality;
    athlete.matchDetails = resultMatch.details || athlete.matchDetails || "";
    enrichAthleteFromResults(athlete, swimmerResults);
    athlete.presentAtDijon = swimmerResults.some((row) => row.__source === "dijon");
    athlete.presentAtRennes = swimmerResults.some((row) => row.__source === "rennes");
    athlete.presentAtAix = swimmerResults.some((row) => row.__source === "aix");
    athlete.meetingSummary = athlete.categorie === "cadet"
      ? "Non exige pour les cadets"
      : [
          athlete.presentAtRennes ? "Rennes" : "",
          athlete.presentAtAix ? "Aix" : ""
        ].filter(Boolean).join(" + ") || "Absent de Rennes et Aix";

    if (athlete.categorie === "junior" || athlete.categorie === "senior") {
      if (!athlete.presentAtRennes && !athlete.presentAtAix) {
        athlete.jsStatus = "non-conforme";
        issues.push(issue("non-conforme", "presence-meeting", athlete, "-", "Participation obligatoire a Rennes ou Aix non retrouvee."));
      }
    }
  });

  bonusEntries.forEach((entry) => {
    const key = athleteKey(entry);
    if (!grouped.has(key)) {
      grouped.set(key, {
        key,
        club: entry.club || "Club non renseigne",
        clubCode: entry.club_code || "",
        swimmer: displayName(entry),
        nom: entry.nom || "",
        prenom: entry.prenom || "",
        naissance: entry.naissance || "",
        sexe: entry.sexe || "",
        categorie: entry.categorie || "non renseignee",
        entries: [],
        individualEntries: [],
        relayEntries: [],
        bonusEntries: [],
        results: [],
        matchQuality: "certain",
        presentAtRennes: false,
        presentAtDijon: false,
        presentAtAix: false,
        jsStatus: "a-verifier",
        meetingSummary: "Aucune fiche engagement principale"
      });
    }

    const athlete = grouped.get(key);
    enrichAthleteFromEntry(athlete, entry);
    if (isRelay(entry.epreuve)) {
      athlete.entries.push(entry);
      athlete.relayEntries.push(entry);
      return;
    }

    athlete.bonusEntries.push(entry);
    const resultMatch = matchedResultsForAthlete(athlete, resultIndex);
    const swimmerResults = resultMatch.rows;
    athlete.results = swimmerResults;
    athlete.matchQuality = resultMatch.fragile ? "probable" : athlete.matchQuality;
    athlete.matchDetails = resultMatch.details || athlete.matchDetails || "";
    enrichAthleteFromResults(athlete, swimmerResults);
    athlete.presentAtDijon = athlete.presentAtDijon || swimmerResults.some((row) => row.__source === "dijon");
    athlete.presentAtRennes = athlete.presentAtRennes || swimmerResults.some((row) => row.__source === "rennes");
    athlete.presentAtAix = athlete.presentAtAix || swimmerResults.some((row) => row.__source === "aix");
    const exactTraces = swimmerResults.filter((row) => row.epreuve === entry.epreuve);
    const swumTrace = exactTraces.find(isSwumResult);
    const nonSwumTrace = exactTraces.find((row) => !isSwumResult(row));
    const isCadet = athlete.categorie === "cadet";
    const isJuniorOrSenior = athlete.categorie === "junior" || athlete.categorie === "senior";
    let decision = "a-verifier";
    let note = isJuniorOrSenior && !athlete.presentAtRennes
      ? "Course bonus non retrouvee avec un temps nage dans les resultats de Aix-en-Provence ou Dijon."
      : "Course absente des trois resultats fournis : justificatif regional a verifier.";
    let issueType = isJuniorOrSenior && !athlete.presentAtRennes ? "bonus-course-introuvable" : "bonus-regional";
    let ruleApplied = isJuniorOrSenior && !athlete.presentAtRennes
      ? "Absent Rennes - a retrouver Aix/Dijon"
      : "Justificatif regional a verifier";
    let complianceHint = "";

    if (swumTrace) {
      decision = "conforme";
      note = `Course nagee retrouvee a ${labelSource(swumTrace.__source)}.`;
      ruleApplied = "Temps retrouve";
    } else if (isCadet) {
      decision = "conforme";
      note = "Course regionale acceptee automatiquement pour les cadets.";
      ruleApplied = "Cadet accepte";
    } else if (isJuniorOrSenior && athlete.presentAtRennes) {
      decision = "conforme";
      note = "Course regionale acceptee automatiquement car le nageur etait present a Rennes.";
      complianceHint = "Tolerance Rennes";
      ruleApplied = "Tolerance Rennes";
    } else if (nonSwumTrace) {
      note = `Course retrouvee a ${labelSource(nonSwumTrace.__source)}, mais non nagee (${describeNonSwumResult(nonSwumTrace)}).`;
      issueType = "bonus-course-non-nagee";
      ruleApplied = "Temps non nage";
    }

    bonusChecks.push({
      athleteKey: athlete.key,
      club: athlete.club,
      swimmer: athlete.swimmer,
      event: entry.epreuve || "-",
      presentAtRennes: athlete.presentAtRennes ? "Oui" : "Non",
      exactTrace: swumTrace
        ? labelSource(swumTrace.__source)
        : nonSwumTrace
          ? `${labelSource(nonSwumTrace.__source)} - ${describeNonSwumResult(nonSwumTrace)}`
          : "Non retrouvee",
      ruleApplied,
      decision,
      note,
      complianceHint
    });

    if (decision === "a-verifier") {
      issues.push(issue(
        "a-verifier",
        issueType,
        athlete,
        entry.epreuve || "-",
        note
      ));
    }
  });

  applyRelayInclusionRule(grouped);
  addDuplicateEntryIssues(grouped, issues);
  addMeetingPresenceIssues(grouped, issues);
  addIdentityWarnings(grouped, issues);
  syncAthleteStatusesWithIssues(grouped, issues);
  state.athletes = [...grouped.values()].sort(sortAthletes);
  state.issues = issues;
  state.bonusChecks = bonusChecks;
  state.clubSummary = buildClubSummary(state.athletes, state.issues, state.bonusChecks);
  state.eventSummary = buildEventSummary(state.athletes, state.relayTeams);
  refreshFilters();
  renderAll();
  refs.exportReport.disabled = state.issues.length === 0 && state.bonusChecks.length === 0;
  refs.exportDetailedReport.disabled = state.athletes.length === 0;
  refs.exportClubSummary.disabled = state.clubSummary.length === 0;
  refs.exportEventSummary.disabled = state.eventSummary.length === 0;
  refs.exportClubPdf.disabled = state.athletes.length === 0;
  refs.exportViewer.disabled = state.athletes.length === 0;
}

function applyRelayInclusionRule(grouped) {
  grouped.forEach((athlete) => {
    if (athlete.individualEntries.length === 0 && athlete.bonusEntries.length === 0) return;
    athlete.relayEntries = [];
    athlete.entries = athlete.entries.filter((entry) => !isRelay(entry.epreuve));
  });
}

function addDuplicateEntryIssues(grouped, issues) {
  grouped.forEach((athlete) => {
    const entriesByEvent = new Map();
    [
      ...athlete.individualEntries.map((entry) => ({ entry, type: "principal" })),
      ...athlete.bonusEntries.map((entry) => ({ entry, type: "bonus" }))
    ].forEach(({ entry, type }) => {
      if (!entry.epreuve || isRelay(entry.epreuve)) return;
      if (!entriesByEvent.has(entry.epreuve)) entriesByEvent.set(entry.epreuve, []);
      entriesByEvent.get(entry.epreuve).push({ entry, type });
    });

    entriesByEvent.forEach((items, event) => {
      if (items.length < 2) return;
      const types = [...new Set(items.map((item) => item.type))];
      const sourceLabel = types.length > 1 ? "engagement principal et bonus" : `${types[0]} en double`;
      addIssueOnce(issues, issue(
        "a-verifier",
        "engagement-doublon",
        athlete,
        event,
        `Engagement en double sur ${event} (${sourceLabel}).`
      ));
    });
  });
}

function enrichAthleteFromEntry(athlete, entry) {
  if ((!athlete.categorie || athlete.categorie === "non renseignee") && entry.categorie) {
    athlete.categorie = entry.categorie;
  }
  if (!athlete.nom && entry.nom) athlete.nom = entry.nom;
  if (!athlete.prenom && entry.prenom) athlete.prenom = entry.prenom;
  if (!athlete.naissance && entry.naissance) athlete.naissance = entry.naissance;
  if (!athlete.clubCode && entry.club_code) athlete.clubCode = entry.club_code;
  if (!athlete.sexe && entry.sexe) athlete.sexe = entry.sexe;
}

function enrichAthleteFromResults(athlete, results) {
  if (athlete.categorie && athlete.categorie !== "non renseignee") return;
  const resultCategory = results.find((row) => row.categorie)?.categorie;
  if (resultCategory) athlete.categorie = resultCategory;
}

function mergeRows(keys) {
  return keys.flatMap((key) => state.sources[key].map((row) => ({ ...row, __source: key })));
}

function indexResults(results) {
  const byAthlete = new Map();
  const byLooseIdentity = new Map();
  results.forEach((row) => {
    const key = athleteKey(row);
    if (!byAthlete.has(key)) byAthlete.set(key, []);
    byAthlete.get(key).push(row);

    const looseKey = looseIdentityKey(row);
    if (looseKey) {
      if (!byLooseIdentity.has(looseKey)) byLooseIdentity.set(looseKey, []);
      byLooseIdentity.get(looseKey).push(row);
    }
  });
  return { byAthlete, byLooseIdentity };
}

function matchedResultsForAthlete(athlete, resultIndex) {
  const exact = resultIndex.byAthlete.get(athlete.key) || [];
  const looseKey = looseIdentityKey({
    prenom: athlete.prenom,
    nom: athlete.nom,
    club_code: athlete.clubCode
  });
  const loose = looseKey ? (resultIndex.byLooseIdentity.get(looseKey) || []) : [];
  const rows = [...new Set([...exact, ...loose])];
  const unmatchedLoose = loose.filter((row) => !exact.includes(row));
  return {
    rows,
    fragile: unmatchedLoose.length > 0,
    details: unmatchedLoose.length > 0 ? describeIdentityDivergence(athlete, unmatchedLoose) : ""
  };
}

function isSwumResult(result) {
  const status = result.resultatStatut || "";
  if (status === "DSQ" || status === "ABD") return false;
  return !isZeroResultTime(result.temps);
}

function isZeroResultTime(value) {
  return /^0+(?::0+)?(?:[.,]0+)?$/.test(String(value || "").trim());
}

function describeNonSwumResult(result) {
  const status = result.resultatStatut || "00.00";
  return result.resultatMotif ? `${status} - ${result.resultatMotif}` : status;
}

function describeIdentityDivergence(athlete, results) {
  const differences = [];
  const comparisons = [
    ["nom", "nom", athlete.nom],
    ["prenom", "prenom", athlete.prenom],
    ["date de naissance", "naissance", athlete.naissance],
    ["club", "clubCode", athlete.clubCode || athlete.club]
  ];

  comparisons.forEach(([label, key, athleteValue]) => {
    const normalizedAthlete = normalizeIdentityValue(key, athleteValue);
    const resultValues = uniqueResultValues(results, key);
    const divergentValues = resultValues.filter((value) => normalizeIdentityValue(key, value) !== normalizedAthlete);
    if (normalizedAthlete && divergentValues.length) {
      differences.push(`${label} engagement "${formatIdentityValue(athleteValue)}" / resultats "${divergentValues.map(formatIdentityValue).join(", ")}"`);
    }
  });

  return differences.length
    ? ` Divergence detectee : ${differences.join(" ; ")}.`
    : " Divergence detectee sur l'identite, sans champ different lisible automatiquement.";
}

function uniqueResultValues(results, key) {
  const values = [];
  results.forEach((row) => {
    const value = key === "clubCode" ? (row.club_code || row.club || "") : (row[key] || "");
    if (value && !values.includes(value)) values.push(value);
  });
  return values;
}

function normalizeIdentityValue(key, value) {
  if (key === "naissance") return normalizeBirthDate(value);
  if (key === "clubCode") return normalizeText(value).replace(/[^a-z0-9]/g, "");
  return normalizePersonName(value);
}

function formatIdentityValue(value) {
  return String(value || "non renseigne").trim();
}

function looseIdentityKey(row) {
  const firstName = normalizePersonName(row.prenom);
  const lastName = normalizePersonName(row.nom);
  const clubCode = normalizeText(row.club_code || "");
  return firstName && lastName && clubCode ? `${firstName}|${lastName}|${clubCode}` : "";
}

function issue(level, type, athlete, event, message) {
  const id = `${athlete.key}|${type}|${event}|${message}`;
  return { id, athleteKey: athlete.key, level, type, club: athlete.club, swimmer: athlete.swimmer, event, message };
}

function addIdentityWarnings(grouped, issues) {
  grouped.forEach((athlete) => {
    if (athlete.matchQuality === "probable") {
      issues.push(issue(
        "a-verifier",
        "rapprochement-fragile",
        athlete,
        "-",
        `Rapprochement effectue malgre une divergence probable entre les exports.${athlete.matchDetails || ""}`
      ));
    }
  });

  const byLoosePerson = new Map();
  grouped.forEach((athlete) => {
    const key = `${normalizePersonName(athlete.prenom)}|${normalizePersonName(athlete.nom)}`;
    if (!key.replace(/\|/g, "")) return;
    if (!byLoosePerson.has(key)) byLoosePerson.set(key, []);
    byLoosePerson.get(key).push(athlete);
  });

  byLoosePerson.forEach((athletes) => {
    const distinctBirths = new Set(athletes.map((athlete) => normalizeBirthDate(athlete.naissance)));
    if (athletes.length > 1 && distinctBirths.size > 1) {
      athletes.forEach((athlete) => {
        issues.push(issue(
          "a-verifier",
          "doublon-potentiel",
          athlete,
          "-",
          "Doublon potentiel ou divergence d'identite detectee sur le meme prenom / nom."
        ));
      });
    }
  });
}

function addMeetingPresenceIssues(grouped, issues) {
  grouped.forEach((athlete) => {
    const hasIndividualEntry = athlete.individualEntries.length > 0 || athlete.bonusEntries.length > 0;
    const needsMeetingPresence = (athlete.categorie === "junior" || athlete.categorie === "senior") && hasIndividualEntry;
    athlete.meetingSummary = athlete.categorie === "cadet"
      ? "Non exige pour les cadets"
      : [
          athlete.presentAtRennes ? "Rennes" : "",
          athlete.presentAtAix ? "Aix" : ""
        ].filter(Boolean).join(" + ") || "Absent de Rennes et Aix";

    if (needsMeetingPresence && !athlete.presentAtRennes && !athlete.presentAtAix) {
      addIssueOnce(issues, issue("non-conforme", "presence-meeting", athlete, "-", "Participation obligatoire a Rennes ou Aix non retrouvee."));
    }
  });
}

function addIssueOnce(issues, item) {
  if (!issues.some((existing) => existing.id === item.id)) issues.push(item);
}

function syncAthleteStatusesWithIssues(grouped, issues) {
  grouped.forEach((athlete) => {
    const athleteIssues = issues.filter((item) => item.athleteKey === athlete.key);
    if (athleteIssues.some((item) => item.level === "non-conforme")) {
      athlete.jsStatus = "non-conforme";
    } else if (athleteIssues.some((item) => item.level === "a-verifier")) {
      athlete.jsStatus = "a-verifier";
    } else {
      athlete.jsStatus = "conforme";
    }
  });
}

function buildClubSummary(athletes, issues, bonusChecks) {
  const clubs = new Map();
  athletes.forEach((athlete) => {
    if (!clubs.has(athlete.club)) {
      clubs.set(athlete.club, { club: athlete.club, athletes: 0, entries: 0, issues: 0, bonusReview: 0 });
    }
    const summary = clubs.get(athlete.club);
    summary.athletes += 1;
    summary.entries += athlete.entries.length + athlete.bonusEntries.length;
  });
  issues.forEach((item) => {
    if (clubs.has(item.club)) clubs.get(item.club).issues += 1;
  });
  bonusChecks.forEach((item) => {
    if (item.decision === "a-verifier" && clubs.has(item.club)) clubs.get(item.club).bonusReview += 1;
  });
  return [...clubs.values()].sort((a, b) => a.club.localeCompare(b.club, "fr"));
}

function buildEventSummary(athletes, relays = []) {
  const events = new Map();
  const ensureEventSummary = (event) => {
    if (!events.has(event)) {
      events.set(event, {
        event,
        total: 0,
        women: 0,
        men: 0,
        mixed: 0,
        cadets: 0,
        juniors: 0,
        seniors: 0,
        femaleCadets: 0,
        femaleJuniors: 0,
        femaleSeniors: 0,
        maleCadets: 0,
        maleJuniors: 0,
        maleSeniors: 0,
        mixedCadets: 0,
        mixedJuniors: 0,
        mixedSeniors: 0
      });
    }
    return events.get(event);
  };

  athletes.forEach((athlete) => {
    const seenEvents = new Set();
    [...athlete.entries, ...athlete.bonusEntries].forEach((entry) => {
      if (!entry.epreuve || isRelay(entry.epreuve) || seenEvents.has(entry.epreuve)) return;
      seenEvents.add(entry.epreuve);
      const summary = ensureEventSummary(entry.epreuve);
      summary.total += 1;
      if (athlete.sexe === "F") summary.women += 1;
      if (athlete.sexe === "M") summary.men += 1;
      if (athlete.categorie === "cadet") summary.cadets += 1;
      if (athlete.categorie === "junior") summary.juniors += 1;
      if (athlete.categorie === "senior") summary.seniors += 1;
      if (athlete.sexe === "F" && athlete.categorie === "cadet") summary.femaleCadets += 1;
      if (athlete.sexe === "F" && athlete.categorie === "junior") summary.femaleJuniors += 1;
      if (athlete.sexe === "F" && athlete.categorie === "senior") summary.femaleSeniors += 1;
      if (athlete.sexe === "M" && athlete.categorie === "cadet") summary.maleCadets += 1;
      if (athlete.sexe === "M" && athlete.categorie === "junior") summary.maleJuniors += 1;
      if (athlete.sexe === "M" && athlete.categorie === "senior") summary.maleSeniors += 1;
    });
  });

  relays.forEach((relay) => {
    if (!relay.epreuve) return;
    const summary = ensureEventSummary(relay.epreuve);
    const sex = relaySex(relay.categorie);
    const category = normalizeCategory(relay.categorie);
    summary.total += 1;
    if (sex === "F") summary.women += 1;
    if (sex === "M") summary.men += 1;
    if (sex === "X") summary.mixed += 1;
    if (category === "cadet") summary.cadets += 1;
    if (category === "junior") summary.juniors += 1;
    if (category === "senior") summary.seniors += 1;
    if (sex === "F" && category === "cadet") summary.femaleCadets += 1;
    if (sex === "F" && category === "junior") summary.femaleJuniors += 1;
    if (sex === "F" && category === "senior") summary.femaleSeniors += 1;
    if (sex === "M" && category === "cadet") summary.maleCadets += 1;
    if (sex === "M" && category === "junior") summary.maleJuniors += 1;
    if (sex === "M" && category === "senior") summary.maleSeniors += 1;
    if (sex === "X" && category === "cadet") summary.mixedCadets += 1;
    if (sex === "X" && category === "junior") summary.mixedJuniors += 1;
    if (sex === "X" && category === "senior") summary.mixedSeniors += 1;
  });

  return [...events.values()].sort((a, b) => compareEvents(a.event, b.event));
}

function setEventSummarySex(sex) {
  state.eventSummarySex = sex || "all";
  refs.eventSummaryButtons.forEach((button) => button.classList.toggle("active", button.dataset.eventSex === state.eventSummarySex));
  renderEventSummary();
}

function labelSource(source) {
  if (source === "dijon") return "Dijon";
  if (source === "rennes") return "Rennes";
  if (source === "aix") return "Aix-en-Provence";
  return source;
}

function summarizeDatasets() {
  const imported = Object.entries(state.labels)
    .filter(([, label]) => label)
    .map(([key, label]) => `${humanSource(key)} : ${label}`);
  refs.datasetMeta.textContent = imported.length ? imported.join(" | ") : "Aucune donnee chargee";
  if (imported.length) collapseImportsPanel();
}

function humanSource(key) {
  const labels = {
    dijon: "Dijon",
    rennes: "Rennes",
    aix: "Aix",
    jsEntries: "Engagements JS",
    cadetEntries: "Engagements cadets",
    bonusEntries: "Bonus"
  };
  return labels[key] || key;
}

function toggleImportsPanel() {
  const collapsed = document.querySelector(".controls-panel").classList.contains("collapsed");
  if (collapsed) expandImportsPanel();
  else collapseImportsPanel();
}

function collapseImportsPanel() {
  refs.importsBody.classList.add("hidden");
  refs.toggleImports.textContent = "Afficher";
  document.querySelector(".controls-panel").classList.add("collapsed");
}

function expandImportsPanel() {
  refs.importsBody.classList.remove("hidden");
  refs.toggleImports.textContent = "Reduire";
  document.querySelector(".controls-panel").classList.remove("collapsed");
}

function refreshFilters() {
  fillSelect(refs.clubFilter, uniqueValues(state.athletes.map((athlete) => athlete.club)), "Tous les clubs");
  fillSelect(refs.eventFilter, orderedEvents([
    ...state.athletes.flatMap((athlete) => athlete.entries.map((entry) => entry.epreuve)),
    ...state.bonusChecks.map((bonus) => bonus.event),
    ...state.relayTeams.map((relay) => relay.epreuve)
  ]), "Toutes les epreuves");
  fillSelect(refs.categoryFilter, uniqueValues(state.athletes.map((athlete) => athlete.categorie)), "Toutes les categories");
  fillSelect(refs.sexFilter, uniqueValues([
    ...state.athletes.map((athlete) => athlete.sexe),
    ...state.relayTeams.map((relay) => relaySex(relay.categorie))
  ]), "Tous les sexes");
}

function fillSelect(select, values, placeholder) {
  const current = select.value;
  select.innerHTML = [`<option value="all">${placeholder}</option>`]
    .concat(values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`))
    .join("");
  if (values.includes(current)) select.value = current;
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr"));
}

function orderedEvents(values) {
  return [...new Set(values.filter(Boolean))].sort(compareEvents);
}

function compareEvents(left, right) {
  return eventSortRank(left) - eventSortRank(right) || String(left).localeCompare(String(right), "fr");
}

function eventSortRank(event) {
  const normalized = normalizeEvent(event).replace(/\s+/g, "");
  const sfOrder = ["50SF", "100SF", "200SF", "400SF", "800SF", "1500SF"];
  const isOrder = ["50IS", "100IS", "200IS", "400IS", "800IS", "1500IS"];
  const biOrder = ["50BI", "100BI", "200BI", "400BI", "800BI", "1500BI"];

  const sfIndex = sfOrder.indexOf(normalized);
  if (sfIndex >= 0) return sfIndex;
  if (normalized === "50AP") return 100;
  const isIndex = isOrder.indexOf(normalized);
  if (isIndex >= 0) return 200 + isIndex;
  const biIndex = biOrder.indexOf(normalized);
  if (biIndex >= 0) return 300 + biIndex;
  if (isRelay(normalized)) return 400 + relaySortRank(normalized);
  return 999;
}

function relaySortRank(event) {
  const normalized = normalizeEvent(event).replace(/\s+/g, "");
  const distance = Number((normalized.match(/4X(\d+)/) || [])[1] || 0);
  const relayType = normalized.replace(/^4X\d+/, "");
  const typeOrder = { SF: 0, SB: 1, BI: 2, IS: 3 };
  return (distance || 999) + ((typeOrder[relayType] ?? 9) * 1000);
}

function renderAll() {
  renderSummary();
  renderAthletes();
  renderIssues();
  renderBonus();
  renderRelays();
  renderClubSummary();
  renderEventSummary();
  renderTodo();
}

function renderSummary() {
  const visibleAthletes = state.athletes.filter(matchesAthleteFilters);
  const visibleIssues = state.issues.filter(matchesIssueFilters);
  refs.totalAthletes.textContent = String(visibleAthletes.length);
  refs.totalEntries.textContent = String(visibleAthletes.reduce((sum, athlete) => sum + countVisibleEntries(athlete), 0));
  refs.nonCompliantIssues.textContent = String(visibleIssues.filter((item) => issueDisplayLevel(item) === "non-conforme").length);
  refs.pendingIssues.textContent = String(visibleIssues.filter((item) => issueDisplayLevel(item) === "a-verifier").length);
  refs.reviewedIssues.textContent = String(visibleIssues.filter((item) => issueDisplayLevel(item) === "verifie").length);
  refs.relayOnlyCount.textContent = String(
    countVisibleRelayTeams()
  );
}

function countVisibleEntries(athlete) {
  const eventFilter = refs.eventFilter.value;
  const allEntries = [...athlete.entries, ...athlete.bonusEntries];
  if (eventFilter === "all") return allEntries.length;
  return allEntries.filter((entry) => entry.epreuve === eventFilter).length;
}

function countVisibleRelayTeams() {
  return state.relayTeams.filter(matchesRelayFilters).length;
}

function renderAthletes() {
  const athletes = sortVisibleAthletes(state.athletes.filter(matchesAthleteFilters));
  refs.athletesBody.innerHTML = athletes.length ? athletes.map((athlete) => `
    <tr class="athlete-row" data-athlete-key="${escapeHtml(athlete.key)}">
      <td>${escapeHtml(athlete.club)}</td>
      <td><button class="athlete-link" type="button" data-athlete-key="${escapeHtml(athlete.key)}">${escapeHtml(athlete.swimmer)}</button></td>
      <td>${escapeHtml(athlete.naissance || "-")}</td>
      <td>${escapeHtml(athlete.categorie)}</td>
      <td>${presencePills(athlete)}</td>
      <td>${statusBadge(athlete.jsStatus)}</td>
      <td>${athlete.individualEntries.length}</td>
      <td>${athlete.bonusEntries.length}</td>
    </tr>
  `).join("") : `<tr class="empty-row"><td colspan="8">Aucun nageur ne correspond aux filtres.</td></tr>`;
}

function handleAthleteSortClick(event) {
  const header = event.target.closest("[data-sort]");
  if (!header) return;
  const key = header.dataset.sort;
  if (state.athleteSort.key === key) {
    state.athleteSort.direction = state.athleteSort.direction === "asc" ? "desc" : "asc";
  } else {
    state.athleteSort = { key, direction: "asc" };
  }
  renderAthletes();
}

function sortVisibleAthletes(athletes) {
  const direction = state.athleteSort.direction === "asc" ? 1 : -1;
  return [...athletes].sort((a, b) => {
    const left = athleteSortValue(a, state.athleteSort.key);
    const right = athleteSortValue(b, state.athleteSort.key);
    if (typeof left === "number" && typeof right === "number") return (left - right) * direction;
    return String(left).localeCompare(String(right), "fr") * direction;
  });
}

function athleteSortValue(athlete, key) {
  if (key === "swimmer") return athleteNameSortValue(athlete);
  if (key === "naissance") return athlete.naissance || "";
  if (key === "categorie") return athlete.categorie || "";
  if (key === "status") return athlete.jsStatus || "";
  if (key === "individuals") return athlete.individualEntries.length;
  if (key === "bonus") return athlete.bonusEntries.length;
  return athlete.club || "";
}

function presencePills(athlete) {
  return `
    <div class="presence-list">
      ${presencePill("Dijon", athlete.presentAtDijon)}
      ${presencePill("Rennes", athlete.presentAtRennes)}
      ${presencePill("Aix", athlete.presentAtAix)}
    </div>
  `;
}

function presencePill(label, present) {
  return `<span class="presence-pill ${present ? "present" : "absent"}">${label}</span>`;
}

function renderIssues() {
  const issues = sortIssuesForDisplay(state.issues.filter(matchesIssueFilters));
  refs.issuesBody.innerHTML = issues.length ? issues.map((item) => `
    <tr class="athlete-row" data-athlete-key="${escapeHtml(item.athleteKey)}">
      <td>${statusBadge(issueDisplayLevel(item))}</td>
      <td>${issueTypeLabel(item.type)}</td>
      <td>${escapeHtml(item.club)}</td>
      <td>${athleteButton(item.athleteKey, item.swimmer)}</td>
      <td>${escapeHtml(item.event)}</td>
      <td>${escapeHtml(item.message)}</td>
      <td>${issueCommentInput(item)}</td>
      <td>${issueReviewButton(item)}</td>
    </tr>
  `).join("") : `<tr class="empty-row"><td colspan="8">Aucune anomalie ne correspond aux filtres.</td></tr>`;
}

function renderBonus() {
  const bonuses = state.bonusChecks.filter(matchesBonusFilters);
  refs.bonusBody.innerHTML = bonuses.length ? bonuses.map((bonus) => `
    <tr class="athlete-row" data-athlete-key="${escapeHtml(bonus.athleteKey)}">
      <td>${escapeHtml(bonus.club)}</td>
      <td>${athleteButton(bonus.athleteKey, bonus.swimmer)}</td>
      <td>${escapeHtml(bonus.event)}</td>
      <td>${escapeHtml(bonus.presentAtRennes)}</td>
      <td>${escapeHtml(bonus.exactTrace)}</td>
      <td>${escapeHtml(bonus.ruleApplied || "-")}</td>
      <td>${statusBadge(bonus.decision)}${bonusHint(bonus)}<small>${escapeHtml(bonus.note)}</small></td>
    </tr>
  `).join("") : `<tr class="empty-row"><td colspan="7">Aucune course bonus ne correspond aux filtres.</td></tr>`;
}

function renderRelays() {
  const relays = state.relayTeams
    .filter(matchesRelayFilters)
    .sort((a, b) => `${a.club} ${eventSortRank(a.epreuve)} ${a.epreuve}`.localeCompare(`${b.club} ${eventSortRank(b.epreuve)} ${b.epreuve}`, "fr"));
  refs.relaysBody.innerHTML = relays.length ? relays.map((relay) => `
    <tr>
      <td>${escapeHtml(relay.club)}</td>
      <td>${escapeHtml(relay.categorie || "-")}</td>
      <td>${escapeHtml(relay.epreuve || "-")}</td>
      <td>${escapeHtml(relay.temps || "-")}</td>
      <td>${escapeHtml(humanSource(relay.sourceKey))}</td>
    </tr>
  `).join("") : `<tr class="empty-row"><td colspan="5">Aucun relais ne correspond aux filtres.</td></tr>`;
}

function sortIssuesForDisplay(issues) {
  const severity = { "non-conforme": 0, "a-verifier": 1, verifie: 2 };
  return [...issues].sort((a, b) => {
    const levelDiff = (severity[issueDisplayLevel(a)] ?? 9) - (severity[issueDisplayLevel(b)] ?? 9);
    if (levelDiff) return levelDiff;
    return `${a.club} ${issueAthleteNameSortValue(a)} ${a.event}`.localeCompare(`${b.club} ${issueAthleteNameSortValue(b)} ${b.event}`, "fr");
  });
}

function issueAthleteNameSortValue(issueItem) {
  const athlete = state.athletes.find((item) => item.key === issueItem.athleteKey);
  return athlete ? athleteNameSortValue(athlete) : issueItem.swimmer;
}

function renderClubSummary() {
  refs.clubsBody.innerHTML = state.clubSummary.length ? state.clubSummary.map((item) => `
    <tr>
      <td>${escapeHtml(item.club)}</td>
      <td>${item.athletes}</td>
      <td>${item.entries}</td>
      <td>${item.issues}</td>
      <td>${item.bonusReview}</td>
    </tr>
  `).join("") : `<tr class="empty-row"><td colspan="5">La synthese par club apparaitra ici.</td></tr>`;
}

function renderEventSummary() {
  const rows = state.eventSummary.map((item) => eventSummaryRow(item));
  refs.eventsBody.innerHTML = rows.length ? rows.map((item) => `
    <tr>
      <td>${escapeHtml(item.event)}</td>
      <td>${item.total}</td>
      <td>${item.women}</td>
      <td>${item.men}</td>
      <td>${item.mixed}</td>
      <td>${item.cadets}</td>
      <td>${item.juniors}</td>
      <td>${item.seniors}</td>
    </tr>
  `).join("") : `<tr class="empty-row"><td colspan="8">La synthese courses apparaitra ici.</td></tr>`;
}

function eventSummaryRow(item) {
  if (state.eventSummarySex === "F") {
    return {
      ...item,
      total: item.women,
      men: 0,
      mixed: 0,
      cadets: item.femaleCadets,
      juniors: item.femaleJuniors,
      seniors: item.femaleSeniors
    };
  }
  if (state.eventSummarySex === "M") {
    return {
      ...item,
      total: item.men,
      women: 0,
      mixed: 0,
      cadets: item.maleCadets,
      juniors: item.maleJuniors,
      seniors: item.maleSeniors
    };
  }
  return item;
}

function renderTodo() {
  const issues = sortIssuesForDisplay(state.issues.filter((item) => issueDisplayLevel(item) !== "verifie"));
  refs.todoBody.innerHTML = issues.length ? issues.map((item) => `
    <tr class="athlete-row" data-athlete-key="${escapeHtml(item.athleteKey)}">
      <td>${statusBadge(issueDisplayLevel(item))}</td>
      <td>${issueTypeLabel(item.type)}</td>
      <td>${escapeHtml(item.club)}</td>
      <td>${athleteButton(item.athleteKey, item.swimmer)}</td>
      <td>${escapeHtml(item.event)}</td>
      <td>${escapeHtml(item.message)}</td>
      <td>${issueReviewButton(item)}</td>
    </tr>
  `).join("") : `<tr class="empty-row"><td colspan="7">Aucun element a traiter.</td></tr>`;
}

function athleteButton(key, swimmer) {
  return `<button class="athlete-link" type="button" data-athlete-key="${escapeHtml(key)}">${escapeHtml(swimmer)}</button>`;
}

function matchesAthleteFilters(athlete) {
  return matchesSearch(`${athlete.club} ${athlete.swimmer} ${athlete.entries.map((entry) => entry.epreuve).join(" ")}`)
    && matchesClub(athlete.club)
    && matchesCategory(athlete.categorie)
    && matchesSex(athlete.sexe)
    && matchesStatus(athlete.jsStatus)
    && matchesNonCompliantOnly(athlete.jsStatus)
    && matchesMeetingMissing(athlete.key)
    && matchesEvent(athlete.entries.map((entry) => entry.epreuve).concat(athlete.bonusEntries.map((entry) => entry.epreuve)));
}

function matchesIssueFilters(item) {
  return matchesSearch(`${item.club} ${item.swimmer} ${item.event} ${item.message}`)
    && matchesClub(item.club)
    && matchesStatus(issueDisplayLevel(item))
    && matchesNonCompliantOnly(issueDisplayLevel(item))
    && matchesMeetingMissing(item.athleteKey)
    && matchesEvent([item.event]);
}

function matchesBonusFilters(item) {
  return matchesSearch(`${item.club} ${item.swimmer} ${item.event} ${item.note}`)
    && matchesClub(item.club)
    && matchesStatus(item.decision)
    && matchesNonCompliantOnly(item.decision)
    && matchesMeetingMissing(item.athleteKey)
    && matchesEvent([item.event]);
}

function matchesRelayFilters(relay) {
  return matchesSearch(`${relay.club} ${relay.categorie} ${relay.epreuve} ${relay.temps}`)
    && matchesClub(relay.club)
    && matchesCategory(normalizeCategory(relay.categorie))
    && matchesSex(relaySex(relay.categorie))
    && matchesEvent([relay.epreuve]);
}

function relaySex(category) {
  const normalized = normalizeText(category).toUpperCase();
  if (normalized.startsWith("F")) return "F";
  if (normalized.startsWith("H")) return "M";
  if (normalized.startsWith("X")) return "X";
  return "";
}

function matchesSearch(text) {
  const search = normalizeText(refs.searchInput.value);
  return !search || normalizeText(text).includes(search);
}

function matchesClub(club) {
  return refs.clubFilter.value === "all" || refs.clubFilter.value === club;
}

function matchesCategory(category) {
  return refs.categoryFilter.value === "all" || refs.categoryFilter.value === category;
}

function matchesSex(sex) {
  return refs.sexFilter.value === "all" || refs.sexFilter.value === sex;
}

function matchesEvent(events) {
  return refs.eventFilter.value === "all" || events.includes(refs.eventFilter.value);
}

function matchesStatus(status) {
  return refs.statusFilter.value === "all" || refs.statusFilter.value === status;
}

function matchesNonCompliantOnly(status) {
  return !refs.nonCompliantOnly.checked || status === "non-conforme";
}

function matchesMeetingMissing(athleteKey) {
  return !refs.meetingMissingOnly.checked || hasMissingRennesAixPresence(athleteKey);
}

function hasMissingRennesAixPresence(athleteKey) {
  const athlete = state.athletes.find((item) => item.key === athleteKey);
  return Boolean(athlete && !athlete.presentAtRennes && !athlete.presentAtAix);
}

function resetFilters() {
  refs.searchInput.value = "";
  refs.clubFilter.value = "all";
  refs.eventFilter.value = "all";
  refs.categoryFilter.value = "all";
  refs.sexFilter.value = "all";
  refs.statusFilter.value = "all";
  refs.nonCompliantOnly.checked = false;
  refs.meetingMissingOnly.checked = false;
  renderAll();
}

function handleFilterChange() {
  const view = currentView();
  switchView(view === "relays" ? "relays" : "athletes");
}

function handleEventFilterChange() {
  switchView(isRelay(refs.eventFilter.value) ? "relays" : "athletes");
}

function currentView() {
  return refs.tabButtons.find((button) => button.classList.contains("active"))?.dataset.view || "athletes";
}


function statusBadge(status) {
  const labels = {
    conforme: "Conforme",
    "a-verifier": "A verifier",
    "non-conforme": "Non conforme",
    verifie: "Verifie"
  };
  return `<span class="badge ${status}">${labels[status] || status}</span>`;
}

function issueDisplayLevel(item) {
  return item.level === "a-verifier" && state.manualIssueReviews.has(item.id) ? "verifie" : item.level;
}

function issueReviewButton(item) {
  if (item.level !== "a-verifier") return "-";
  const reviewed = state.manualIssueReviews.has(item.id);
  return `<button class="review-button" type="button" data-issue-review-id="${escapeHtml(item.id)}">${reviewed ? "Repasser a verifier" : "Marquer verifie"}</button>`;
}

function issueCommentInput(item) {
  if (item.level !== "a-verifier") return "-";
  const value = state.manualIssueComments.get(item.id) || "";
  return `<input class="issue-comment" data-issue-comment-id="${escapeHtml(item.id)}" type="text" value="${escapeHtml(value)}" placeholder="Commentaire manuel">`;
}

function handleIssueReviewClick(event) {
  const button = event.target.closest("[data-issue-review-id]");
  if (!button) return;
  const id = button.dataset.issueReviewId;
  if (state.manualIssueReviews.has(id)) state.manualIssueReviews.delete(id);
  else state.manualIssueReviews.add(id);
  storeIssueReviews();
  renderAll();
}

function handleIssueCommentChange(event) {
  const input = event.target.closest("[data-issue-comment-id]");
  if (!input) return;
  const id = input.dataset.issueCommentId;
  const value = input.value.trim();
  if (value) state.manualIssueComments.set(id, value);
  else state.manualIssueComments.delete(id);
  storeIssueComments();
}

function loadStoredIssueReviews() {
  try {
    return new Set(JSON.parse(localStorage.getItem("napReviewedIssues") || "[]"));
  } catch {
    return new Set();
  }
}

function loadStoredIssueComments() {
  try {
    return new Map(Object.entries(JSON.parse(localStorage.getItem("napIssueComments") || "{}")));
  } catch {
    return new Map();
  }
}

function storeIssueReviews() {
  localStorage.setItem("napReviewedIssues", JSON.stringify([...state.manualIssueReviews]));
}

function storeIssueComments() {
  localStorage.setItem("napIssueComments", JSON.stringify(Object.fromEntries(state.manualIssueComments)));
}

function detailStatusBadge(status) {
  const labels = {
    conforme: "Engagement conforme",
    "a-verifier": "Engagement a verifier",
    "non-conforme": "Engagement non conforme"
  };
  return `<span class="detail-status ${status}">${labels[status] || status}</span>`;
}

function issueTypeLabel(type) {
  const labels = {
    "presence-meeting": "Presence meeting",
    "bonus-regional": "Bonus regional",
    "bonus-course-introuvable": "Course bonus",
    "bonus-course-non-nagee": "Bonus course non nagee",
    "engagement-doublon": "Engagement doublon",
    "rapprochement-fragile": "Rapprochement fragile",
    "doublon-potentiel": "Doublon potentiel"
  };
  return `<span class="issue-type">${labels[type] || type || "Controle"}</span>`;
}

function handleAthleteRowClick(event) {
  if (event.target.closest("input, textarea, select, a")) return;
  const clickedButton = event.target.closest("button");
  if (clickedButton && !clickedButton.dataset.athleteKey) return;
  const target = event.target.closest("[data-athlete-key]");
  if (!target) return;
  const athlete = state.athletes.find((item) => item.key === target.dataset.athleteKey);
  if (athlete) openAthleteDialog(athlete);
}

function openAthleteDialog(athlete) {
  refs.athleteDialogClub.textContent = athlete.club;
  refs.athleteDialogTitle.textContent = athlete.swimmer;
  refs.athleteDialogMeta.innerHTML = `
    <div class="dialog-identity">
      <span>${escapeHtml(athlete.naissance || "-")}</span>
      <span>${escapeHtml(athlete.categorie)}</span>
    </div>
    <div class="dialog-presences">
      ${presencePills(athlete)}
    </div>
    <div class="dialog-status">
      ${detailStatusBadge(athlete.jsStatus)}
      ${athlete.matchQuality === "probable" ? `<span class="match-quality">Rapprochement probable</span>` : ""}
    </div>
    ${athleteDecisionBlock(athlete)}
  `;
  refs.athleteEntriesBody.innerHTML = athleteEngagementRows(athlete);
  refs.athleteResultsBody.innerHTML = athleteResultRows(athlete);
  refs.athleteDialog.classList.remove("hidden");
  refs.athleteDialog.setAttribute("aria-hidden", "false");
}

function closeAthleteDialog() {
  refs.athleteDialog.classList.add("hidden");
  refs.athleteDialog.setAttribute("aria-hidden", "true");
}

function athleteDecisionBlock(athlete) {
  const issues = state.issues.filter((item) => item.athleteKey === athlete.key);
  const presenceIssue = issues.find((item) => item.type === "presence-meeting");
  const bonusIssues = issues.filter((item) => item.type === "bonus-course-introuvable" || item.type === "bonus-course-non-nagee" || item.type === "bonus-regional");
  const identityIssues = issues.filter((item) => item.type === "rapprochement-fragile" || item.type === "doublon-potentiel");
  const lines = [];

  if (presenceIssue) lines.push("Non conforme : absent de Rennes/Aix pour un nageur junior ou senior.");
  if (bonusIssues.length) {
    lines.push(`Courses bonus a verifier : ${bonusIssues.map((item) => item.event).join(", ")}.`);
  }
  const duplicateIssues = issues.filter((item) => item.type === "engagement-doublon");
  if (duplicateIssues.length) {
    lines.push(`Doublon d'engagement a verifier : ${duplicateIssues.map((item) => item.event).join(", ")}.`);
  }
  if (identityIssues.length) {
    lines.push("Identite a verifier : divergence probable entre les exports.");
  }
  if (!lines.length && athlete.categorie === "cadet") {
    lines.push("Conforme : controle de presence aux meetings non exige pour les cadets.");
  } else if (!lines.length) {
    lines.push("Conforme : conditions principales validees avec les fichiers charges.");
  }

  return `
    <div class="decision-card ${escapeHtml(athlete.jsStatus)}">
      <strong>Decision</strong>
      ${lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
    </div>
  `;
}

function athleteEngagementRows(athlete) {
  const regularRows = athlete.entries.map((entry) => {
    const type = isRelay(entry.epreuve) ? "Relais" : "Engagement";
    const compliance = regularEntryStatus(athlete);
    return entryRow(type, entry.epreuve || "-", entry.temps || "-", compliance.status, compliance.note);
  });

  const bonusRows = athlete.bonusEntries.map((entry) => {
    const bonus = state.bonusChecks.find((item) => item.athleteKey === athlete.key && item.event === entry.epreuve);
    return entryRow(
      "Bonus",
      entry.epreuve || "-",
      entry.temps || "-",
      bonus?.decision || "a-verifier",
      bonus ? `${bonus.complianceHint ? `[${bonus.complianceHint}] ` : ""}${bonus.note}` : "Controle bonus indisponible."
    );
  });

  const rows = [
    ...groupSectionRows("Engagements principaux", regularRows),
    ...groupSectionRows("Courses bonus", bonusRows)
  ];
  return rows.length ? rows.join("") : `<tr class="empty-row"><td colspan="5">Aucun engagement a afficher.</td></tr>`;
}

function groupSectionRows(label, rows) {
  if (!rows.length) return [];
  return [`<tr class="group-row"><td colspan="5">${escapeHtml(label)}</td></tr>`, ...rows];
}

function regularEntryStatus(athlete) {
  if (athlete.categorie === "cadet") {
    return { status: "conforme", note: "Controle de presence aux meetings non exige pour les cadets." };
  }
  if (athlete.jsStatus === "non-conforme") {
    return { status: "non-conforme", note: "Presence a Rennes ou Aix non retrouvee." };
  }
  return { status: "conforme", note: "Condition de participation validee." };
}

function entryRow(type, event, engagementTime, status, note) {
  return `
    <tr>
      <td>${escapeHtml(type)}</td>
      <td>${escapeHtml(event)}</td>
      <td>${escapeHtml(engagementTime)}</td>
      <td>${statusBadge(status)}</td>
      <td>${escapeHtml(note)}</td>
    </tr>
  `;
}

function athleteResultRows(athlete) {
  const rows = [...(athlete.results || [])]
    .sort((a, b) => `${labelSource(a.__source)} ${a.epreuve}`.localeCompare(`${labelSource(b.__source)} ${b.epreuve}`, "fr"))
    .map((result) => `
      <tr>
        <td>${escapeHtml(labelSource(result.__source))}</td>
        <td>${escapeHtml(result.epreuve || "-")}</td>
        <td>${escapeHtml(result.temps || "-")}</td>
        <td>${escapeHtml(result.resultatStatut || "-")}</td>
        <td>${escapeHtml(isZeroResultTime(result.temps) ? (result.resultatMotif || result.resultatStatut || "-") : "-")}</td>
      </tr>
    `);
  return rows.length ? rows.join("") : `<tr class="empty-row"><td colspan="5">Aucun resultat retrouve dans les trois competitions.</td></tr>`;
}

function switchView(view) {
  refs.tabButtons.forEach((button) => {
    const sameView = button.dataset.view === view;
    button.classList.toggle("active", sameView);
  });
  refs.athletesTable.classList.toggle("hidden", view !== "athletes");
  refs.issuesTable.classList.toggle("hidden", view !== "issues");
  refs.bonusTable.classList.toggle("hidden", view !== "bonus");
  refs.relaysTable.classList.toggle("hidden", view !== "relays");
  refs.clubsTable.classList.toggle("hidden", view !== "clubs");
  refs.eventsTable.classList.toggle("hidden", view !== "events");
  refs.todoTable.classList.toggle("hidden", view !== "todo");
  refs.eventSummaryControls.classList.toggle("hidden", view !== "events");
  renderAll();
}

function sortAthletes(a, b) {
  return `${a.club} ${athleteNameSortValue(a)}`.localeCompare(`${b.club} ${athleteNameSortValue(b)}`, "fr");
}

function athleteNameSortValue(athlete) {
  return `${athlete.nom || ""} ${athlete.prenom || ""} ${athlete.swimmer || ""}`.trim();
}

function exportReport() {
  const lines = [
    ["type", "niveau", "club", "nageur", "epreuve", "detail"],
    ...state.issues.map((item) => ["anomalie", item.level, item.club, item.swimmer, item.event, item.message]),
    ...state.bonusChecks.map((item) => ["bonus", item.decision, item.club, item.swimmer, item.event, `${item.note} Regle: ${item.ruleApplied || "-"}. Presence Rennes: ${item.presentAtRennes}. Trace: ${item.exactTrace}.`])
  ];
  const csv = lines.map((line) => line.map(escapeCsv).join(";")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "controle-engagements-limoges-2026.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function exportDetailedReport() {
  const lines = [
    ["club", "nageur", "date_naissance", "categorie", "sexe", "statut", "presence_dijon", "presence_rennes", "presence_aix", "rapprochement", "individuels", "bonus", "engagements_total", "anomalies_associees"],
    ...state.athletes.map((athlete) => {
      const athleteIssues = state.issues
        .filter((item) => item.athleteKey === athlete.key)
        .map((item) => `${issueTypeText(item.type)} [${issueDisplayLevel(item)}]: ${item.message}${state.manualIssueComments.get(item.id) ? ` | Commentaire: ${state.manualIssueComments.get(item.id)}` : ""}`)
        .join(" | ");
      return [
        athlete.club,
        athlete.swimmer,
        athlete.naissance || "",
        athlete.categorie || "",
        athlete.sexe || "",
        athlete.jsStatus,
        athlete.presentAtDijon ? "oui" : "non",
        athlete.presentAtRennes ? "oui" : "non",
        athlete.presentAtAix ? "oui" : "non",
        athlete.matchQuality,
        athlete.individualEntries.length,
        athlete.bonusEntries.length,
        athlete.entries.length + athlete.bonusEntries.length,
        athleteIssues
      ];
    })
  ];
  downloadCsv(lines, "detail-engagements-limoges-2026.csv");
}

function exportClubSummary() {
  const lines = [
    ["club", "nageurs", "engagements", "anomalies", "bonus_a_verifier"],
    ...state.clubSummary.map((item) => [item.club, item.athletes, item.entries, item.issues, item.bonusReview])
  ];
  downloadCsv(lines, "synthese-clubs-limoges-2026.csv");
}

function exportEventSummary() {
  const lines = [
    ["course", "total_nageurs", "femmes", "hommes", "mixtes", "cadets", "juniors", "seniors"],
    ...state.eventSummary.map((item) => [item.event, item.total, item.women, item.men, item.mixed, item.cadets, item.juniors, item.seniors])
  ];
  downloadCsv(lines, "synthese-courses-limoges-2026.csv");
}

function exportClubPdf() {
  const club = refs.clubFilter.value;
  if (club === "all") {
    alert("Selectionne d'abord un club dans le filtre club pour generer son recap PDF.");
    return;
  }

  const athletes = state.athletes.filter((athlete) => athlete.club === club);
  const issues = sortIssuesForDisplay(state.issues.filter((item) => item.club === club));
  const bonuses = state.bonusChecks.filter((item) => item.club === club);
  const relays = state.relayTeams.filter((relay) => relay.club === club).sort((a, b) => compareEvents(a.epreuve, b.epreuve));
  const summary = {
    athletes: athletes.length,
    entries: athletes.reduce((sum, athlete) => sum + athlete.entries.length + athlete.bonusEntries.length, 0),
    nonCompliant: issues.filter((item) => issueDisplayLevel(item) === "non-conforme").length,
    pending: issues.filter((item) => issueDisplayLevel(item) === "a-verifier").length,
    relays: relays.length
  };

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("La fenetre PDF n'a pas pu s'ouvrir. Autorise les pop-ups pour cet outil.");
    return;
  }

  printWindow.document.write(clubPdfHtml(club, summary, athletes, issues, bonuses, relays));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function exportViewer() {
  const snapshot = {
    generatedAt: new Date().toISOString(),
    labels: state.labels,
    athletes: state.athletes,
    issues: state.issues,
    bonusChecks: state.bonusChecks,
    relayTeams: state.relayTeams,
    clubSummary: state.clubSummary,
    eventSummary: state.eventSummary,
    manualIssueReviews: [...state.manualIssueReviews],
    manualIssueComments: Object.fromEntries(state.manualIssueComments)
  };
  const html = buildViewerHtml(snapshot);
  downloadBlob(html, "controle-engagements-limoges-2026-consultation.html", "text/html;charset=utf-8");
}

function buildViewerHtml(snapshot) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Controle engagements Limoges 2026 - consultation</title>
  <style>${viewerCss()}</style>
</head>
<body>
  <main class="viewer-shell">
    <header>
      <p class="eyebrow">Version consultable</p>
      <h1>Controle des engagements - Limoges 2026</h1>
      <p>Donnees exportees le ${escapeHtml(new Date(snapshot.generatedAt).toLocaleString("fr-FR"))}. Cette version est en lecture seule.</p>
    </header>
    <section class="summary-grid" id="viewerSummary"></section>
    <section class="toolbar">
      <input id="viewerSearch" type="search" placeholder="Filtrer par nageur, club ou epreuve">
      <select id="viewerClub"><option value="all">Tous les clubs</option></select>
      <select id="viewerEvent"><option value="all">Toutes les epreuves</option></select>
      <select id="viewerCategory"><option value="all">Toutes les categories</option></select>
      <select id="viewerSex"><option value="all">Tous les sexes</option></select>
      <select id="viewerStatus"><option value="all">Tous les statuts</option><option value="conforme">Conforme</option><option value="a-verifier">A verifier</option><option value="non-conforme">Non conforme</option><option value="verifie">Verifie</option></select>
    </section>
    <nav class="tabs">
      <button class="active" data-view="athletes" type="button">Nageurs</button>
      <button data-view="issues" type="button">Anomalies</button>
      <button data-view="bonus" type="button">Bonus</button>
      <button data-view="relays" type="button">Relais</button>
      <button data-view="clubs" type="button">Synthese clubs</button>
      <button data-view="events" type="button">Synthese courses</button>
    </nav>
    <section class="table-wrap" id="viewerTable"></section>
  </main>
  <section id="viewerDialog" class="viewer-dialog hidden" aria-hidden="true">
    <article>
      <button id="viewerCloseDialog" type="button">Fermer</button>
      <p id="viewerDialogClub" class="eyebrow"></p>
      <h2 id="viewerDialogTitle"></h2>
      <div id="viewerDialogBody"></div>
    </article>
  </section>
  <script id="viewerData" type="application/json">${safeJsonForScript(snapshot)}</script>
  <script>${viewerScript()}</script>
</body>
</html>`;
}

function safeJsonForScript(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function viewerCss() {
  return `
    :root { --bg:#edf4f7; --surface:#fff; --soft:#f6fafc; --ink:#173242; --muted:#5a7180; --line:#d5e1e8; --accent:#0b6e8a; --ok:#20775a; --warn:#a86d12; --bad:#b24444; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: var(--bg); color: var(--ink); }
    .viewer-shell { width: min(1440px, calc(100vw - 32px)); margin: 0 auto; padding: 28px 0 36px; }
    header, .summary-grid article, .table-wrap { border: 1px solid var(--line); border-radius: 8px; background: var(--surface); }
    header { padding: 20px; margin-bottom: 16px; }
    .eyebrow { margin: 0 0 8px; color: var(--accent); font-size: 12px; font-weight: 700; text-transform: uppercase; }
    h1 { margin: 0 0 8px; font-size: 32px; }
    p { margin: 0; color: var(--muted); }
    .summary-grid { display: grid; grid-template-columns: repeat(6, minmax(130px, 1fr)); gap: 12px; margin-bottom: 16px; }
    .summary-grid article { padding: 14px; }
    .summary-grid span { display: block; color: var(--muted); font-size: 12px; text-transform: uppercase; }
    .summary-grid strong { display: block; margin-top: 6px; font-size: 26px; }
    .toolbar, .tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
    input, select, button { min-height: 38px; border: 1px solid var(--line); border-radius: 8px; background: #fff; padding: 0 10px; color: var(--ink); }
    input { min-width: 280px; }
    button { cursor: pointer; font-weight: 700; }
    button.active { color: #fff; border-color: var(--accent); background: var(--accent); }
    .table-wrap { overflow: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border-bottom: 1px solid var(--line); padding: 10px; text-align: left; vertical-align: top; font-size: 13px; }
    th { color: var(--muted); background: var(--soft); }
    tr[data-athlete-key] { cursor: pointer; }
    tr[data-athlete-key]:hover { background: #f8fbfc; }
    .badge { display: inline-flex; align-items: center; min-height: 26px; padding: 0 10px; border-radius: 999px; color: #fff; font-size: 12px; font-weight: 700; }
    .conforme { background: var(--ok); }
    .a-verifier { background: var(--warn); }
    .non-conforme { background: var(--bad); }
    .verifie { background: var(--muted); }
    small { display:block; margin-top:6px; color:var(--muted); }
    .viewer-dialog { position: fixed; inset: 0; z-index: 10; background: rgba(23,50,66,.28); display: flex; justify-content: flex-end; }
    .viewer-dialog.hidden { display: none; }
    .viewer-dialog article { width: min(760px, calc(100vw - 28px)); height: calc(100vh - 28px); margin: 14px; padding: 20px; overflow: auto; border-radius: 12px; background: #fff; box-shadow: 0 20px 60px rgba(23,50,66,.24); }
    #viewerCloseDialog { float: right; }
    .dialog-meta { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0 14px; }
    .pill { display: inline-flex; align-items: center; min-height: 26px; padding: 0 10px; border-radius: 999px; border: 1px solid var(--line); background: var(--soft); font-size: 12px; font-weight: 700; }
    .pill.present { color: #fff; border-color: var(--ok); background: var(--ok); }
    .decision { border: 1px solid var(--line); border-left: 5px solid var(--accent); border-radius: 8px; padding: 10px 12px; margin: 12px 0; background: var(--soft); }
    .viewer-dialog h3 { margin: 20px 0 8px; color: var(--accent); }
    @media (max-width: 860px) { .summary-grid { grid-template-columns: 1fr 1fr; } input, select, button { width: 100%; } }
  `;
}

function viewerScript() {
  return `
    const data = JSON.parse(document.getElementById("viewerData").textContent);
    let currentView = "athletes";
    const refs = {
      search: document.getElementById("viewerSearch"),
      club: document.getElementById("viewerClub"),
      event: document.getElementById("viewerEvent"),
      category: document.getElementById("viewerCategory"),
      sex: document.getElementById("viewerSex"),
      status: document.getElementById("viewerStatus"),
      summary: document.getElementById("viewerSummary"),
      table: document.getElementById("viewerTable"),
      tabs: [...document.querySelectorAll(".tabs button")],
      dialog: document.getElementById("viewerDialog"),
      closeDialog: document.getElementById("viewerCloseDialog"),
      dialogClub: document.getElementById("viewerDialogClub"),
      dialogTitle: document.getElementById("viewerDialogTitle"),
      dialogBody: document.getElementById("viewerDialogBody")
    };
    const reviewed = new Set(data.manualIssueReviews || []);
    const comments = data.manualIssueComments || {};
    refs.tabs.forEach((button) => button.addEventListener("click", () => { currentView = button.dataset.view; render(); }));
    refs.table.addEventListener("click", (event) => {
      const row = event.target.closest("[data-athlete-key]");
      if (row) openAthlete(row.dataset.athleteKey);
    });
    refs.closeDialog.addEventListener("click", closeAthlete);
    refs.dialog.addEventListener("click", (event) => { if (event.target === refs.dialog) closeAthlete(); });
    [refs.search, refs.club, refs.event, refs.category, refs.sex, refs.status].forEach((control) => control.addEventListener("input", render));
    [refs.club, refs.event, refs.category, refs.sex, refs.status].forEach((control) => control.addEventListener("change", render));
    initFilters();
    render();

    function initFilters() {
      fill(refs.club, unique(data.athletes.map((a) => a.club)), "Tous les clubs");
      fill(refs.event, orderedEvents([...data.athletes.flatMap((a) => [...a.entries, ...a.bonusEntries].map((e) => e.epreuve)), ...data.relayTeams.map((r) => r.epreuve)]), "Toutes les epreuves");
      fill(refs.category, unique(data.athletes.map((a) => a.categorie)), "Toutes les categories");
      fill(refs.sex, unique([...data.athletes.map((a) => a.sexe), ...data.relayTeams.map((r) => relaySex(r.categorie))]), "Tous les sexes");
    }
    function render() {
      refs.tabs.forEach((button) => button.classList.toggle("active", button.dataset.view === currentView));
      const athletes = data.athletes.filter(matchAthlete);
      const issues = data.issues.filter(matchIssue).sort(sortIssues);
      refs.summary.innerHTML = card("Nageurs", athletes.length) + card("Engagements", athletes.reduce((s,a)=>s+a.entries.length+a.bonusEntries.length,0)) + card("Non conformes", issues.filter((i)=>issueLevel(i)==="non-conforme").length) + card("A verifier", issues.filter((i)=>issueLevel(i)==="a-verifier").length) + card("Verifies", issues.filter((i)=>issueLevel(i)==="verifie").length) + card("Relais", data.relayTeams.filter(matchRelay).length);
      if (currentView === "athletes") renderTable(["Club","Nageur","Naissance","Categorie","Sexe","Statut","Ind.","Bonus"], athletes.map((a)=>({ athleteKey:a.key, cells:[a.club,a.swimmer,a.naissance||"-",a.categorie||"-",a.sexe||"-",badge(a.jsStatus),a.individualEntries.length,a.bonusEntries.length] })));
      if (currentView === "issues") renderTable(["Niveau","Type","Club","Nageur","Epreuve","Controle","Commentaire"], issues.map((i)=>({ athleteKey:i.athleteKey, cells:[badge(issueLevel(i)),issueType(i.type),i.club,i.swimmer,i.event,i.message,comments[i.id]||""] })));
      if (currentView === "bonus") renderTable(["Club","Nageur","Epreuve","Rennes","Trace","Regle","Decision"], data.bonusChecks.filter(matchBonus).map((b)=>({ athleteKey:b.athleteKey, cells:[b.club,b.swimmer,b.event,b.presentAtRennes,b.exactTrace,b.ruleApplied||"-",badge(b.decision)+"<small>"+esc(b.note)+"</small>"] })));
      if (currentView === "relays") renderTable(["Club","Categorie","Epreuve","Temps","Fichier"], data.relayTeams.filter(matchRelay).map((r)=>[r.club,r.categorie||"-",r.epreuve||"-",r.temps||"-",sourceName(r.sourceKey)]));
      if (currentView === "clubs") renderTable(["Club","Nageurs","Engagements","Anomalies","Bonus a verifier"], data.clubSummary.map((c)=>[c.club,c.athletes,c.entries,c.issues,c.bonusReview]));
      if (currentView === "events") renderTable(["Course","Total","Femmes","Hommes","Mixtes","Cadets","Juniors","Seniors"], data.eventSummary.map((e)=>[e.event,e.total,e.women,e.men,e.mixed||0,e.cadets,e.juniors,e.seniors]));
    }
    function renderTable(headers, rows) {
      refs.table.innerHTML = "<table><thead><tr>" + headers.map((h)=>"<th>"+esc(h)+"</th>").join("") + "</tr></thead><tbody>" + (rows.length ? rows.map(rowHtml).join("") : "<tr><td colspan='"+headers.length+"'>Aucun element.</td></tr>") + "</tbody></table>";
    }
    function rowHtml(row) { const cells = Array.isArray(row) ? row : row.cells; const attr = row.athleteKey ? " data-athlete-key='"+esc(row.athleteKey)+"'" : ""; return "<tr"+attr+">"+cells.map((cell)=>"<td>"+cell+"</td>").join("")+"</tr>"; }
    function openAthlete(key) {
      const athlete = data.athletes.find((a)=>a.key===key);
      if (!athlete) return;
      refs.dialogClub.textContent = athlete.club;
      refs.dialogTitle.textContent = athlete.swimmer;
      refs.dialogBody.innerHTML = athleteDialogHtml(athlete);
      refs.dialog.classList.remove("hidden");
      refs.dialog.setAttribute("aria-hidden","false");
    }
    function closeAthlete() { refs.dialog.classList.add("hidden"); refs.dialog.setAttribute("aria-hidden","true"); }
    function athleteDialogHtml(a) {
      const issues = data.issues.filter((i)=>i.athleteKey===a.key);
      const regular = (a.entries||[]).map((e)=>["Engagement",e.epreuve||"-",e.temps||"-",badge(a.jsStatus),a.categorie==="cadet"?"Cadet : presence meeting non exigee.":(a.jsStatus==="non-conforme"?"Presence Rennes/Aix non retrouvee.":"Condition principale validee.")]);
      const bonus = (a.bonusEntries||[]).map((e)=>{ const b=data.bonusChecks.find((item)=>item.athleteKey===a.key&&item.event===e.epreuve); return ["Bonus",e.epreuve||"-",e.temps||"-",badge(b?.decision||"a-verifier"),b?.note||"Controle bonus indisponible."]; });
      const results = (a.results||[]).map((r)=>[sourceName(r.__source),r.epreuve||"-",r.temps||"-",r.resultatStatut||"-",r.resultatMotif||"-"]);
      return "<div class='dialog-meta'><span class='pill'>"+esc(a.naissance||"-")+"</span><span class='pill'>"+esc(a.categorie||"-")+"</span><span class='pill'>"+esc(a.sexe||"-")+"</span><span class='pill "+(a.presentAtDijon?"present":"")+"'>Dijon</span><span class='pill "+(a.presentAtRennes?"present":"")+"'>Rennes</span><span class='pill "+(a.presentAtAix?"present":"")+"'>Aix</span>"+badge(a.jsStatus)+"</div>"
        + decisionHtml(a, issues)
        + "<h3>Engagements</h3>" + miniTable(["Type","Epreuve","Temps","Statut","Note"], [...regular,...bonus])
        + "<h3>Anomalies</h3>" + miniTable(["Niveau","Type","Epreuve","Controle","Commentaire"], issues.map((i)=>[badge(issueLevel(i)),issueType(i.type),i.event,i.message,comments[i.id]||""]))
        + "<h3>Temps retrouves</h3>" + miniTable(["Lieu","Epreuve","Temps","Statut","Motif"], results);
    }
    function decisionHtml(a, issues) {
      const lines = [];
      if (issues.some((i)=>i.type==="presence-meeting")) lines.push("Non conforme : absent de Rennes/Aix pour un nageur junior ou senior.");
      const bonusIssues = issues.filter((i)=>["bonus-course-introuvable","bonus-course-non-nagee","bonus-regional"].includes(i.type));
      if (bonusIssues.length) lines.push("Courses bonus a verifier : "+bonusIssues.map((i)=>i.event).join(", ")+".");
      const duplicateIssues = issues.filter((i)=>i.type==="engagement-doublon");
      if (duplicateIssues.length) lines.push("Doublon d'engagement a verifier : "+duplicateIssues.map((i)=>i.event).join(", ")+".");
      if (!lines.length) lines.push(a.categorie==="cadet" ? "Conforme : presence meeting non exigee pour les cadets." : "Conforme : conditions principales validees.");
      return "<div class='decision'><strong>Decision</strong>"+lines.map((l)=>"<p>"+esc(l)+"</p>").join("")+"</div>";
    }
    function miniTable(headers, rows) { return "<table><thead><tr>"+headers.map((h)=>"<th>"+esc(h)+"</th>").join("")+"</tr></thead><tbody>"+(rows.length?rows.map((r)=>"<tr>"+r.map((c)=>"<td>"+c+"</td>").join("")+"</tr>").join(""):"<tr><td colspan='"+headers.length+"'>Aucun element.</td></tr>")+"</tbody></table>"; }
    function card(label, value) { return "<article><span>"+esc(label)+"</span><strong>"+esc(value)+"</strong></article>"; }
    function matchAthlete(a) { return search(a.club+" "+a.swimmer) && select(refs.club,a.club) && select(refs.category,a.categorie) && select(refs.sex,a.sexe) && select(refs.status,a.jsStatus) && eventMatch([...a.entries,...a.bonusEntries].map((e)=>e.epreuve)); }
    function matchIssue(i) { return search(i.club+" "+i.swimmer+" "+i.event+" "+i.message) && select(refs.club,i.club) && select(refs.status,issueLevel(i)) && eventMatch([i.event]); }
    function matchBonus(b) { return search(b.club+" "+b.swimmer+" "+b.event+" "+b.note) && select(refs.club,b.club) && select(refs.status,b.decision) && eventMatch([b.event]); }
    function matchRelay(r) { return search(r.club+" "+r.categorie+" "+r.epreuve) && select(refs.club,r.club) && select(refs.category,normalizeCategory(r.categorie)) && select(refs.sex,relaySex(r.categorie)) && eventMatch([r.epreuve]); }
    function search(text) { return !refs.search.value || normalize(text).includes(normalize(refs.search.value)); }
    function select(ref, value) { return ref.value === "all" || ref.value === value; }
    function eventMatch(events) { return refs.event.value === "all" || events.includes(refs.event.value); }
    function issueLevel(i) { return i.level === "a-verifier" && reviewed.has(i.id) ? "verifie" : i.level; }
    function sortIssues(a,b) { const s = {"non-conforme":0,"a-verifier":1,verifie:2}; return (s[issueLevel(a)]??9)-(s[issueLevel(b)]??9) || (a.club+a.swimmer+a.event).localeCompare(b.club+b.swimmer+b.event,"fr"); }
    function badge(status) { const labels = {conforme:"Conforme","a-verifier":"A verifier","non-conforme":"Non conforme",verifie:"Verifie"}; return "<span class='badge "+esc(status)+"'>"+esc(labels[status]||status)+"</span>"; }
    function issueType(type) { return {"presence-meeting":"Presence meeting","bonus-regional":"Bonus regional","bonus-course-introuvable":"Course bonus","bonus-course-non-nagee":"Bonus course non nagee","engagement-doublon":"Engagement doublon","rapprochement-fragile":"Rapprochement fragile","doublon-potentiel":"Doublon potentiel"}[type] || type || "Controle"; }
    function sourceName(key) { return {jsEntries:"Engagements JS",cadetEntries:"Cadets",bonusEntries:"Bonus"}[key] || key || "-"; }
    function fill(select, values, placeholder) { select.innerHTML = "<option value='all'>"+esc(placeholder)+"</option>" + values.map((v)=>"<option value='"+esc(v)+"'>"+esc(v)+"</option>").join(""); }
    function unique(values) { return [...new Set(values.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),"fr")); }
    function orderedEvents(values) { return unique(values).sort((a,b)=>eventRank(a)-eventRank(b)||String(a).localeCompare(String(b),"fr")); }
    function eventRank(e) { const n=normalizeEvent(e).replace(/\\s+/g,""); const sf=["50SF","100SF","200SF","400SF","800SF","1500SF"]; const is=["50IS","100IS","200IS","400IS","800IS","1500IS"]; const bi=["50BI","100BI","200BI","400BI","800BI","1500BI"]; if(sf.includes(n)) return sf.indexOf(n); if(n==="50AP") return 100; if(is.includes(n)) return 200+is.indexOf(n); if(bi.includes(n)) return 300+bi.indexOf(n); if(/^4X/.test(n)) return 400; return 999; }
    function normalizeCategory(v) { const n=normalize(v); if(["fca","hca"].includes(n)) return "cadet"; if(["fju","hju","fje","hje"].includes(n)) return "junior"; if(["fse","hse","xse"].includes(n)) return "senior"; if(n.startsWith("cad")) return "cadet"; if(n.startsWith("jun")) return "junior"; if(n.startsWith("sen")) return "senior"; return n; }
    function relaySex(c) { const n=normalize(c).toUpperCase(); if(n.startsWith("F")) return "F"; if(n.startsWith("H")) return "M"; if(n.startsWith("X")) return "X"; return ""; }
    function normalizeEvent(v) { return String(v||"").trim().replace(/\\s+/g," ").toUpperCase(); }
    function normalize(v) { return String(v||"").trim().toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,""); }
    function esc(v) { return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }
  `;
}

function clubPdfHtml(club, summary, athletes, issues, bonuses, relays) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Recap club - ${escapeHtml(club)}</title>
  <style>
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { font-family: Arial, Helvetica, sans-serif; margin: 28px; color: #173242; background: #f3f8fa; }
    main { background: #fff; border-radius: 12px; padding: 22px; }
    h1 { margin: 0 0 4px; font-size: 24px; }
    h2 { margin: 24px 0 10px; font-size: 16px; color: #084f64; }
    p { margin: 0 0 12px; color: #5a7180; }
    .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin: 18px 0 20px; }
    .card { border: 1px solid #d5e1e8; border-left: 6px solid #0b6e8a; border-radius: 8px; padding: 10px; background: #ffffff; }
    .card.ok { border-top-color: #20775a; background: #eff9f5; }
    .card.warn { border-top-color: #a86d12; background: #fff7ea; }
    .card.bad { border-top-color: #b24444; background: #fff0f0; }
    .card.ok { border-left-color: #20775a; }
    .card.warn { border-left-color: #a86d12; }
    .card.bad { border-left-color: #b24444; }
    .card span { display: block; font-size: 11px; color: #5a7180; text-transform: uppercase; }
    .card strong { display: block; margin-top: 4px; font-size: 20px; }
    .rules { border: 1px solid #d5e1e8; border-left: 5px solid #0b6e8a; border-radius: 8px; padding: 12px 14px; margin: 18px 0; background: #f6fafc; }
    .rules strong { display: block; margin-bottom: 8px; color: #084f64; }
    .rules ul { margin: 0; padding-left: 18px; }
    .rules li { margin: 4px 0; font-size: 12px; line-height: 1.4; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th, td { border-bottom: 1px solid #d5e1e8; padding: 7px 6px; text-align: left; vertical-align: top; font-size: 12px; }
    th { background: #f6fafc; color: #5a7180; }
    tbody tr:nth-child(even) { background: #fbfdfe; }
    tr.row-conforme { background: #eff9f5; border-left: 5px solid #20775a; }
    tr.row-a-verifier { background: #fff7ea; border-left: 5px solid #a86d12; }
    tr.row-non-conforme { background: #fff0f0; border-left: 5px solid #b24444; }
    tr.row-verifie { background: #f2f5f7; border-left: 5px solid #5a7180; }
    tr.row-conforme td:first-child { border-left: 5px solid #20775a; }
    tr.row-a-verifier td:first-child { border-left: 5px solid #a86d12; }
    tr.row-non-conforme td:first-child { border-left: 5px solid #b24444; }
    tr.row-verifie td:first-child { border-left: 5px solid #5a7180; }
    .badge { display: inline-block; border-radius: 999px; padding: 3px 8px; color: #fff; font-size: 11px; font-weight: 700; }
    .conforme { background: #20775a; }
    .a-verifier { background: #a86d12; }
    .non-conforme { background: #b24444; }
    .verifie { background: #5a7180; }
    @media print {
      .badge { border: 1px solid currentColor; }
      .badge.conforme { color: #20775a; background: #eff9f5; }
      .badge.a-verifier { color: #a86d12; background: #fff7ea; }
      .badge.non-conforme { color: #b24444; background: #fff0f0; }
      .badge.verifie { color: #5a7180; background: #f2f5f7; }
    }
    @media print { body { margin: 14mm; background: #fff; } main { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <main>
    <h1>Recap controle engagements</h1>
    <p>${escapeHtml(club)} - Championnat de France NAP Limoges 2026</p>
    ${pdfRulesBlock()}
    <div class="grid">
      ${pdfCard("Nageurs", summary.athletes)}
      ${pdfCard("Engagements", summary.entries)}
      ${pdfCard("Non conformes", summary.nonCompliant, summary.nonCompliant ? "bad" : "ok")}
      ${pdfCard("A verifier", summary.pending, summary.pending ? "warn" : "ok")}
      ${pdfCard("Relais", summary.relays)}
    </div>
    ${pdfAthletesSection(athletes)}
    ${pdfIssuesSection(issues)}
    ${pdfBonusSection(bonuses)}
    ${pdfRelaysSection(relays)}
  </main>
</body>
</html>`;
}

function pdfRulesBlock() {
  return `
  <div class="rules">
    <strong>Regles controlees</strong>
    <ul>
      <li>Juniors et seniors : participation obligatoire a au moins un des meetings de Rennes ou Aix-en-Provence pour pouvoir s'engager.</li>
      <li>Courses bonus juniors/seniors : si le nageur etait present a Rennes, la course regionale est acceptee avec indication de tolerance Rennes.</li>
      <li>Courses bonus juniors/seniors absents de Rennes : la course doit etre retrouvee avec un temps nage dans les resultats de Dijon ou Aix-en-Provence.</li>
      <li>Cadets : presence a Rennes ou Aix non obligatoire ; les courses regionales sont acceptees automatiquement.</li>
      <li>Relais : les relais clubs sont listes a part et ne sont pas comptes comme engagements individuels des nageurs deja engages.</li>
    </ul>
  </div>`;
}

function pdfCard(label, value, tone = "") {
  return `<div class="card ${escapeHtml(tone)}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function pdfAthletesSection(athletes) {
  const rows = athletes.map((athlete) => `
    <tr class="row-${escapeHtml(athlete.jsStatus)}">
      <td>${escapeHtml(athlete.swimmer)}</td>
      <td>${escapeHtml(athlete.naissance || "-")}</td>
      <td>${escapeHtml(athlete.categorie || "-")}</td>
      <td>${escapeHtml(athlete.sexe || "-")}</td>
      <td>${pdfBadge(athlete.jsStatus)}</td>
      <td>${athlete.individualEntries.length}</td>
      <td>${athlete.bonusEntries.length}</td>
    </tr>`).join("");
  return pdfSection("Nageurs", `<table><thead><tr><th>Nageur</th><th>Naissance</th><th>Categorie</th><th>Sexe</th><th>Statut</th><th>Ind.</th><th>Bonus</th></tr></thead><tbody>${rows || pdfEmptyRow(7)}</tbody></table>`);
}

function pdfIssuesSection(issues) {
  const rows = issues.map((item) => `
    <tr class="row-${escapeHtml(issueDisplayLevel(item))}">
      <td>${pdfBadge(issueDisplayLevel(item))}</td>
      <td>${escapeHtml(issueTypeText(item.type))}</td>
      <td>${escapeHtml(item.swimmer)}</td>
      <td>${escapeHtml(item.event)}</td>
      <td>${escapeHtml(item.message)}</td>
      <td>${escapeHtml(state.manualIssueComments.get(item.id) || "")}</td>
    </tr>`).join("");
  return pdfSection("Anomalies", `<table><thead><tr><th>Niveau</th><th>Type</th><th>Nageur</th><th>Epreuve</th><th>Controle</th><th>Commentaire</th></tr></thead><tbody>${rows || pdfEmptyRow(6)}</tbody></table>`);
}

function pdfBonusSection(bonuses) {
  const rows = bonuses.map((bonus) => `
    <tr class="row-${escapeHtml(bonus.decision)}">
      <td>${escapeHtml(bonus.swimmer)}</td>
      <td>${escapeHtml(bonus.event)}</td>
      <td>${escapeHtml(bonus.presentAtRennes)}</td>
      <td>${escapeHtml(bonus.exactTrace)}</td>
      <td>${escapeHtml(bonus.ruleApplied || "-")}</td>
      <td>${pdfBadge(bonus.decision)}</td>
    </tr>`).join("");
  return pdfSection("Courses bonus", `<table><thead><tr><th>Nageur</th><th>Epreuve</th><th>Rennes</th><th>Trace</th><th>Regle</th><th>Decision</th></tr></thead><tbody>${rows || pdfEmptyRow(6)}</tbody></table>`);
}

function pdfRelaysSection(relays) {
  const rows = relays.map((relay) => `
    <tr>
      <td>${escapeHtml(relay.categorie || "-")}</td>
      <td>${escapeHtml(relay.epreuve || "-")}</td>
      <td>${escapeHtml(relay.temps || "-")}</td>
      <td>${escapeHtml(humanSource(relay.sourceKey))}</td>
    </tr>`).join("");
  return pdfSection("Relais", `<table><thead><tr><th>Categorie</th><th>Epreuve</th><th>Temps engagement</th><th>Fichier</th></tr></thead><tbody>${rows || pdfEmptyRow(4)}</tbody></table>`);
}

function pdfSection(title, content) {
  return `<h2>${escapeHtml(title)}</h2>${content}`;
}

function pdfEmptyRow(colspan) {
  return `<tr><td colspan="${colspan}">Aucun element.</td></tr>`;
}

function pdfBadge(status) {
  const labels = {
    conforme: "Conforme",
    "a-verifier": "A verifier",
    "non-conforme": "Non conforme",
    verifie: "Verifie"
  };
  return `<span class="badge ${escapeHtml(status)}">${escapeHtml(labels[status] || status)}</span>`;
}

function issueTypeText(type) {
  const labels = {
    "presence-meeting": "Presence meeting",
    "bonus-regional": "Bonus regional",
    "bonus-course-introuvable": "Course bonus",
    "bonus-course-non-nagee": "Bonus course non nagee",
    "engagement-doublon": "Engagement doublon",
    "rapprochement-fragile": "Rapprochement fragile",
    "doublon-potentiel": "Doublon potentiel"
  };
  return labels[type] || type || "Controle";
}

function bonusHint(bonus) {
  return bonus.complianceHint ? `<span class="bonus-hint">${escapeHtml(bonus.complianceHint)}</span>` : "";
}

function downloadCsv(lines, filename) {
  const csv = lines.map((line) => line.map(escapeCsv).join(";")).join("\n");
  downloadBlob(csv, filename, "text/csv;charset=utf-8");
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
