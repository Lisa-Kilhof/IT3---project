
"use strict";

// ======================================================
// LOGIN OG VALG AF BRUGERROLLE
// ======================================================

// Henter brugerrollen fra URL'ens parameter "rolle".
// Rollen bestemmer, hvilken type login der vises.
function hentRolleFraUrl() {

    // Opretter et objekt, der kan læse parametre fra URL'en.
    const params = new URLSearchParams(window.location.search);

    // Returnerer værdien af parameteren "rolle".
    return params.get("rolle");
}


// Tilpasser loginformularens overskrift, beskrivelse og ID-felt
// til den valgte brugerrolle.
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


// Behandler loginformularen og kontrollerer brugerens loginoplysninger.
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

    // Kontrollerer patientens ID og adgangskode.
    if (rolle === "patient" && (id === "01" || id === "02") && kode === "1234") {

        // Gemmer brugerrollen og patientens ID i sessionStorage.
        sessionStorage.setItem("rolle", "patient");
        sessionStorage.setItem("patientID", id);

        // Sender patienten videre til smerteformularen.
        window.location.href = "smertedagbog.html";
        return;
    }

    // Kontrollerer sundhedspersonalets ID og adgangskode.
    if (rolle === "personale" && id === "2001" && kode === "1234") {

        // Gemmer brugerrollen og fjerner et eventuelt tidligere patient-ID.
        sessionStorage.setItem("rolle", "personale");
        sessionStorage.removeItem("patientID");

        // Sender sundhedspersonalet videre til patientlisten.
        window.location.href = "patientliste.html";
        return;
    }

    // Viser en fejlbesked, hvis loginoplysningerne ikke er korrekte.
    fejl.textContent = "Forkert bruger-ID eller adgangskode.";
}


// Initialiserer loginformularen, når HTML-dokumentet er indlæst.
document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    // Tilpasser loginformularen og tilknytter submit-hændelsen.
    if (loginForm) {
        visLoginSide();
        loginForm.addEventListener("submit", haandterLogin);
    }
});
