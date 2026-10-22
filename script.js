
"use strict";

// ======================================================
// LOGIN OG VALG AF BRUGERROLLE
// ======================================================

// Henter brugerrollen fra URL'en.
// URL'en indeholder enten "patient" eller "personale".
// Rollen bruges til at bestemme, hvilken type login der vises.
function hentRolleFraUrl() {

    // Opretter et objekt, der kan læse parametre fra URL'en.
    const params = new URLSearchParams(window.location.search);

    // Returnerer værdien af parameteren "rolle".
    return params.get("rolle");
}


// Viser den korrekte loginoverskrift og beskrivelse.
// Funktionen tilpasser loginformularen til den valgte brugerrolle.
function visLoginSide() {

    // Henter den valgte brugerrolle fra URL'en.
    const rolle = hentRolleFraUrl();

    // Kontrollerer, at brugerrollen er gyldig.
    // Hvis rollen mangler eller er ukendt, sendes brugeren tilbage til forsiden.
    if (rolle !== "patient" && rolle !== "personale") {
        window.location.href = "index.html";
        return;
    }

    // Finder de HTML-elementer, der skal tilpasses.
    const titel = document.getElementById("loginTitel");
    const beskrivelse = document.getElementById("loginBeskrivelse");
    const idFelt = document.getElementById("brugerID");

    // Tilpasser teksten, hvis brugeren logger ind som patient.
    if (rolle === "patient") {
        titel.textContent = "Patientlogin";
        beskrivelse.textContent = "Indtast dit patient-ID og din adgangskode.";
        idFelt.placeholder = "Patient-ID";

    // Tilpasser teksten, hvis brugeren logger ind som sundhedspersonale.
    } else {
        titel.textContent = "Login for sundhedspersonale";
        beskrivelse.textContent = "Indtast dit medarbejder-ID og din adgangskode.";
        idFelt.placeholder = "Medarbejder-ID";
    }
}


// Behandler loginformularen, når brugeren forsøger at logge ind.
// Funktionen kontrollerer brugeroplysningerne og sender brugeren
// videre til den side, der passer til brugerrollen.
function haandterLogin(event) {

    // Forhindrer formularen i at genindlæse siden automatisk.
    event.preventDefault();

    // Henter brugerrollen, det indtastede ID og adgangskoden.
    const rolle = hentRolleFraUrl();
    const id = document.getElementById("brugerID").value.trim();
    const kode = document.getElementById("adgangskode").value;

    // Finder området, hvor en eventuel fejlbesked skal vises.
    const fejl = document.getElementById("loginFejl");

    // Fjerner en tidligere fejlbesked, inden login kontrolleres igen.
    fejl.textContent = "";

    // Kontrollerer, om brugeren er en af de to patienter,
    // og om adgangskoden stemmer.
    if (rolle === "patient" && (id === "01" || id === "02") && kode === "1234") {

        // Gemmer brugerrollen i sessionStorage.
        // Oplysningerne bevares, mens browserfanens session er aktiv.
        sessionStorage.setItem("rolle", "patient");

        // Gemmer ID'et, så systemet ved, hvilken patients registreringer
        // der skal gemmes og vises.
        sessionStorage.setItem("patientID", id);

        // Sender patienten videre til smerteformularen.
        window.location.href = "smertedagbog.html";
        return;
    }

    // Kontrollerer, om brugeren er sundhedspersonale
    // med det korrekte medarbejder-ID og den korrekte adgangskode.
    if (rolle === "personale" && id === "2001" && kode === "1234") {

        // Gemmer brugerrollen, så systemet ved,
        // at brugeren har adgang til personalets sider.
        sessionStorage.setItem("rolle", "personale");

        // Fjerner et eventuelt tidligere patient-ID fra sessionen,
        // da sundhedspersonalet ikke skal registreres som en patient.
        sessionStorage.removeItem("patientID");

        // Sender sundhedspersonalet videre til patientlisten.
        window.location.href = "patientliste.html";
        return;
    }

    // Hvis ingen af loginbetingelserne er opfyldt,
    // vises en fejlbesked til brugeren.
    fejl.textContent = "Forkert bruger-ID eller adgangskode.";
}


// ======================================================
// ADGANGSKONTROL
// ======================================================

// Kontrollerer, om den aktuelle bruger er logget ind som patient.
// Funktionen bruges på patientens smerteformular.
function tjekPatientLogin() {

    // Kontrollerer både brugerrollen og patientens ID.
    // Kun patienter med ID 01 eller 02 får adgang.
    if (
        sessionStorage.getItem("rolle") !== "patient" ||
        !["01", "02"].includes(sessionStorage.getItem("patientID"))
    ) {

        // Sender brugeren tilbage til forsiden,
        // hvis loginoplysningerne i sessionen ikke er gyldige.
        window.location.href = "index.html";
    }
}


// Kontrollerer, om den aktuelle bruger er logget ind som sundhedspersonale.
// Funktionen bruges på sider, der kun er beregnet til personalet.
function tjekPersonaleLogin() {

    // Henter den gemte brugerrolle fra sessionStorage.
    if (sessionStorage.getItem("rolle") !== "personale") {

        // Sender brugeren tilbage til forsiden,
        // hvis vedkommende ikke er logget ind som personale.
        window.location.href = "index.html";
    }
}


// Logger brugeren ud af systemet.
function logUd() {

    // Fjerner brugerrollen fra sessionen.
    sessionStorage.removeItem("rolle");

    // Fjerner patientens ID fra sessionen.
    sessionStorage.removeItem("patientID");

    // Fjerner den valgte patient fra sessionen.
    sessionStorage.removeItem("valgtPatient");

    // Sender brugeren tilbage til forsiden.
    window.location.href = "index.html";
}


// ======================================================
// SMERTEFORMULAR
// ======================================================

// Opdaterer tallet ved siden af skyderen for smerteintensitet.
// Funktionen kaldes, når brugeren flytter skyderen.
function opdaterIntensitet() {

    // Finder skyderen, hvor patienten vælger intensitet fra 0 til 10.
    const slider = document.getElementById("painIntensity");

    // Finder feltet, hvor det valgte tal vises.
    const output = document.getElementById("intensityValue");

    // Kontrollerer, at begge HTML-elementer findes på siden.
    if (slider && output) {

        // Opdaterer tallet, så det passer til skyderens aktuelle værdi.
        output.textContent = slider.value;
    }
}


// Viser eller skjuler felterne til slutdato og sluttidspunkt.
// Hvis smerterne stadig er i gang, behøver patienten ikke angive en sluttid.
function visSluttid() {

    // Finder afkrydsningsfeltet, der angiver, om smerterne fortsætter.
    const igangvaerende = document.getElementById("painOngoing");

    // Finder området med felterne til slutdato og sluttid.
    const slutFelter = document.getElementById("slutTidFelter");

    // Finder de enkelte felter til slutdato og sluttid.
    const slutDato = document.getElementById("painEndDate");
    const slutTid = document.getElementById("painEndTime");

    // Stopper funktionen, hvis de nødvendige elementer ikke findes.
    if (!igangvaerende || !slutFelter) return;

    // Skjuler slutfelterne, når smerterne stadig er i gang.
    // Ellers vises felterne igen.
    slutFelter.hidden = igangvaerende.checked;

    // Slutdato og sluttid er kun obligatoriske,
    // når patienten har markeret, at smerterne er stoppet.
    slutDato.required = !igangvaerende.checked;
    slutTid.required = !igangvaerende.checked;
}


// Viser eller skjuler tekstfeltet til valgmuligheden "Andet".
// Hvis patienten vælger "Andet", skal vedkommende også beskrive smerten.
function visAndetFelt() {

    // Finder afkrydsningsfeltet for "Andet".
    const andetValgt = document.getElementById("otherPainType");

    // Finder området, hvor den ekstra beskrivelse skal skrives.
    const andetFelt = document.getElementById("otherPainText");

    // Finder tekstfeltet til den ekstra beskrivelse.
    const beskrivelse = document.getElementById("otherPainDescription");

    // Stopper funktionen, hvis de nødvendige HTML-elementer mangler.
    if (!andetValgt || !andetFelt) return;

    // Viser tekstfeltet, hvis "Andet" er valgt.
    // Skjuler det igen, hvis valget fjernes.
    andetFelt.hidden = !andetValgt.checked;

    // Gør den ekstra beskrivelse obligatorisk,
    // når patienten har valgt "Andet".
    beskrivelse.required = andetValgt.checked;
}


// Henter, kontrollerer og gemmer patientens smerteregistrering.
// Funktionen kaldes, når patienten indsender smerteformularen.
function gemSmerteLog(event) {

    // Forhindrer formularen i at genindlæse siden.
    event.preventDefault();

    // Henter ID'et på den patient, der er logget ind.
    const patientID = sessionStorage.getItem("patientID");

    // Finder området til fejlbeskeder i formularen.
    const fejl = document.getElementById("smerteFejl");

    // Kontrollerer, at brugeren er logget ind som en gyldig patient.
    if (
        sessionStorage.getItem("rolle") !== "patient" ||
        !["01", "02"].includes(patientID)
    ) {

        // Sender brugeren tilbage til forsiden, hvis kontrollen fejler.
        window.location.href = "index.html";
        return;
    }

    // Finder alle afkrydsningsfelter for smertetyper,
    // som patienten har valgt.
    const smertetyper = Array.from(
        document.querySelectorAll('input[name="painType"]:checked')
    ).map(felt => felt.value);

    // Patienten skal vælge mindst én smertetype.
    if (smertetyper.length === 0) {
        fejl.textContent = "Vælg mindst én beskrivelse af smerten.";
        return;
    }

    // Kontrollerer, om smerterne stadig er i gang.
    const stadigSmerter = document.getElementById("painOngoing").checked;

    // Henter patientens eventuelle ekstra beskrivelse af smerten.
    const andet = document.getElementById("otherPainDescription").value.trim();

    // Hvis "Andet" er valgt, skal patienten også skrive en beskrivelse.
    if (document.getElementById("otherPainType").checked && !andet) {
        fejl.textContent = "Beskriv venligst, hvordan smerten føles under 'Andet'.";
        return;
    }

    // Samler oplysningerne fra formularen i ét objekt.
    // Objektet repræsenterer én smerteregistrering.
    const registrering = {

        // Patientens egen beskrivelse af smerterne.
        beskrivelse: document.getElementById("painDescription").value.trim(),

        // Den valgte smerteintensitet fra 0 til 10.
        intensitet: document.getElementById("painIntensity").value,

        // De smertetyper, patienten har valgt.
        smertetyper: smertetyper,

        // Patientens ekstra beskrivelse ved valget "Andet".
        andet: andet,

        // Patientens beskrivelse af, hvor smerten sidder.
        placering: document.getElementById("painLocation").value.trim(),

        // Dato og tidspunkt for smertens begyndelse.
        startDato: document.getElementById("painStartDate").value,
        startTid: document.getElementById("painStartTime").value,

        // Slutdato og sluttid gemmes som tomme værdier,
        // hvis smerterne stadig er i gang.
        slutDato: stadigSmerter ? "" : document.getElementById("painEndDate").value,
        slutTid: stadigSmerter ? "" : document.getElementById("painEndTime").value,

        // Gemmer, om smerterne stadig er i gang.
        stadigSmerter: stadigSmerter,

        // Gemmer tidspunktet, hvor registreringen blev oprettet.
        oprettet: new Date().toISOString()
    };

    // Kontrollerer, at de vigtigste oplysninger er udfyldt.
    // Slutdato og sluttid kræves kun, hvis smerterne er stoppet.
    if (
        !registrering.beskrivelse ||
        !registrering.placering ||
        !registrering.startDato ||
        !registrering.startTid ||
        (!stadigSmerter && (!registrering.slutDato || !registrering.slutTid))
    ) {

        // Viser en fejlbesked og stopper gemningen,
        // hvis der mangler nødvendige oplysninger.
        fejl.textContent = "Udfyld venligst alle de nødvendige felter.";
        return;
    }

    // Opretter en unik nøgle til patientens registreringer.
    // Patient 01 og patient 02 får dermed hver deres liste.
    const nøgle = "registreringer_" + patientID;

    // Opretter en tom liste, som kan bruges til registreringerne.
    let registreringer = [];

    try {

        // Henter patientens tidligere registreringer fra localStorage.
        // Hvis der ikke findes nogen, bruges en tom liste.
        registreringer = JSON.parse(localStorage.getItem(nøgle)) || [];

        // Kontrollerer, at de hentede data faktisk er en liste.
        if (!Array.isArray(registreringer)) {
            registreringer = [];
        }

        // Tilføjer den nye registrering til listen.
        registreringer.push(registrering);

        // Gemmer listen som JSON-tekst i browserens localStorage.
        localStorage.setItem(nøgle, JSON.stringify(registreringer));

    } catch (error) {

        // Viser en fejl, hvis browseren ikke kan læse eller gemme data.
        fejl.textContent = "Registreringen kunne ikke gemmes i denne browser.";
        return;
    }

    // Bekræfter, at registreringen er gemt.
    alert("Din smerteregistrering er gemt.");

    // Sender patienten tilbage til forsiden.
    window.location.href = "index.html";
}


// ======================================================
// PATIENTLISTE OG PATIENTDETALJER
// ======================================================

// Gemmer den valgte patient og åbner patientens detaljeside.
// Funktionen kaldes fra knapperne på patientlisten.
function visRegistreringer(navn) {

    // Samler patienternes navne og tilhørende ID'er.
    const patienter = {
        "Anna Jensen": "01",
        "Mads Hansen": "02"
    };

    // Kontrollerer, at brugeren er personale,
    // og at det valgte navn findes på patientlisten.
    if (
        sessionStorage.getItem("rolle") !== "personale" ||
        !patienter[navn]
    ) {

        // Sender brugeren tilbage til forsiden, hvis kontrollen fejler.
        window.location.href = "index.html";
        return;
    }

    // Gemmer navnet på den valgte patient i sessionen.
    sessionStorage.setItem("valgtPatient", navn);

    // Åbner detaljesiden for den valgte patient.
    window.location.href = "detaljer.html";
}


// Viser oplysninger om den valgte patient.
// Funktionen kaldes, når patientdetaljesiden åbnes.
function visPatientDetaljer() {

    // Kontrollerer, at brugeren er logget ind som sundhedspersonale.
    if (sessionStorage.getItem("rolle") !== "personale") {
        window.location.href = "index.html";
        return;
    }

    // Henter navnet på den patient, der blev valgt på patientlisten.
    const navn = sessionStorage.getItem("valgtPatient");

    // Samler patienternes navne og ID'er.
    const patienter = {
        "Anna Jensen": "01",
        "Mads Hansen": "02"
    };

    // Finder patientens ID ud fra navnet.
    const patientID = patienter[navn];

    // Kontrollerer, at der er valgt en gyldig patient.
    if (!patientID) {
        window.location.href = "patientliste.html";
        return;
    }

    // Viser patientens navn og ID i HTML-elementerne.
    document.getElementById("patientNavn").textContent = navn;
    document.getElementById("patientID").textContent = patientID;

    // Henter og viser patientens smerteregistreringer.
    visPatientRegistreringer(patientID);
}


// Henter og viser alle registreringer for en bestemt patient.
function visPatientRegistreringer(patientID) {

    // Finder området på siden, hvor registreringerne skal vises.
    const område = document.getElementById("patientRegistreringer");

    // Fjerner eventuelt tidligere indhold fra området.
    område.replaceChildren();

    // Opretter en tom liste til patientens registreringer.
    let registreringer = [];

    try {

        // Henter registreringerne fra localStorage og omdanner
        // JSON-teksten til JavaScript-data.
        registreringer = JSON.parse(
            localStorage.getItem("registreringer_" + patientID)
        ) || [];

    } catch (error) {

        // Viser en fejl, hvis registreringerne ikke kan læses.
        område.textContent = "Registreringerne kunne ikke læses.";
        return;
    }

    // Hvis patienten endnu ikke har registreret smerter,
    // vises en besked i stedet for en tom liste.
    if (registreringer.length === 0) {
        område.textContent = "Ingen smerteregistreringer endnu.";
        return;
    }

    // Gennemgår alle registreringer én ad gangen.
    // index bruges til at nummerere registreringerne.
    registreringer.forEach((registrering, index) => {

        // Opretter en ny HTML-boks til registreringen.
        const boks = document.createElement("article");
        boks.className = "registration-item";

        // Opretter en overskrift med registreringens nummer.
        const overskrift = document.createElement("h4");
        overskrift.textContent = "Registrering " + (index + 1);

        // Tilføjer overskriften til registreringsboksen.
        boks.appendChild(overskrift);

        // Hjælpefunktion, der opretter en linje med en overskrift
        // og den tilhørende værdi.
        function tilføjOplysning(tekst, værdi) {

            // Opretter et afsnit til oplysningerne.
            const linje = document.createElement("p");

            // Viser teksten og værdien.
            // Hvis værdien mangler, vises "Ikke angivet".
            linje.textContent = tekst + ": " + (værdi || "Ikke angivet");

            // Tilføjer linjen til registreringsboksen.
            boks.appendChild(linje);
        }

        // Viser patientens egen smertebeskrivelse.
        tilføjOplysning("Smertebeskrivelse", registrering.beskrivelse);

        // Viser smerteintensiteten på en skala fra 0 til 10.
        tilføjOplysning("Smerteintensitet", registrering.intensitet + "/10");

        // Viser de valgte smertetyper.
        // Array.isArray kontrollerer, at værdien er en liste,
        // før de enkelte smertetyper samles til tekst.
        tilføjOplysning(
            "Smertetype",
            Array.isArray(registrering.smertetyper)
                ? registrering.smertetyper.join(", ")
                : "Ikke angivet"
        );

        // Viser den ekstra beskrivelse, hvis patienten har udfyldt den.
        if (registrering.andet) {
            tilføjOplysning("Andet", registrering.andet);
        }

        // Viser, hvor smerten sidder.
        tilføjOplysning("Placering", registrering.placering);

        // Viser dato og tidspunkt for smertens begyndelse.
        tilføjOplysning("Startdato", registrering.startDato);
        tilføjOplysning("Starttidspunkt", registrering.startTid);

        // Viser enten den aktuelle status eller sluttidspunktet.
        if (registrering.stadigSmerter) {

            // Hvis smerterne fortsætter, vises en statusbesked.
            tilføjOplysning("Status", "Smerterne er ikke stoppet endnu");

        } else {

            // Hvis smerterne er stoppet, vises slutdato og sluttid.
            tilføjOplysning("Slutdato", registrering.slutDato);
            tilføjOplysning("Sluttidspunkt", registrering.slutTid);
        }

        // Tilføjer den færdige registreringsboks til siden.
        område.appendChild(boks);
    });
}


// ======================================================
// INITIALISERING AF SIDERNES FUNKTIONER
// ======================================================

// Venter, indtil HTML-dokumentet er indlæst,
// før der tilføjes hændelser til formularerne.
document.addEventListener("DOMContentLoaded", function () {

    // Finder loginformularen.
    const loginForm = document.getElementById("loginForm");

    // Hvis loginformularen findes på siden,
    // vises den korrekte logintekst, og loginfunktionen tilknyttes.
    if (loginForm) {
        visLoginSide();
        loginForm.addEventListener("submit", haandterLogin);
    }

    // Finder patientens smerteformular.
    const smerteForm = document.getElementById("smerteForm");

    // Hvis smerteformularen findes, tilknyttes funktionen,
    // der kontrollerer og gemmer registreringen.
    if (smerteForm) {
        smerteForm.addEventListener("submit", gemSmerteLog);
    }

    // Finder afkrydsningsfeltet for "Andet".
    const andetValgt = document.getElementById("otherPainType");

    // Tilknytter funktionen, der viser eller skjuler tekstfeltet.
    // Funktionen køres også med det samme for at sikre korrekt visning.
    if (andetValgt) {
        andetValgt.addEventListener("change", visAndetFelt);
        visAndetFelt();
    }

    // Finder afkrydsningsfeltet for igangværende smerter.
    const igangvaerende = document.getElementById("painOngoing");

    // Tilknytter funktionen, der viser eller skjuler slutfelterne.
    // Funktionen køres også ved indlæsning, så formularen starter korrekt.
    if (igangvaerende) {
        igangvaerende.addEventListener("change", visSluttid);
        visSluttid();
    }
});
