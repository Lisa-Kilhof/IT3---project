
"use strict";

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


// Logger brugeren ud af systemet og afslutter den aktuelle session.
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
