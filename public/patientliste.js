
"use strict";

// ======================================================
// PATIENTLISTE
// ======================================================

// Gemmer den valgte patient og åbner patientens detaljeside.
// Funktionen kaldes fra patientknapperne på patientlisten.
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
