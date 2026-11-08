
"use strict";

// ======================================================
// PATIENTDETALJER
// ======================================================

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

    // Samler patienternes navne og tilhørende ID'er.
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


// Henter og viser alle registreringer for en bestemt patient fra databasen.
async function visPatientRegistreringer(patientID) {

    const område = document.getElementById("patientRegistreringer");
    område.replaceChildren();

    // Kobler login-ID til patientens ID i databasen.
    const databasePatientID = {
        "01": 6,
        "02": 7
    }[patientID];

    try {
        // Henter patientens registreringer fra backend.
        const response = await fetch(
            `/api/symptomregistreringer?patient_id=${databasePatientID}`
        );

        if (!response.ok) {
            throw new Error("Registreringerne kunne ikke hentes.");
        }

        const registreringer = await response.json();

        // Viser en besked, hvis patienten ikke har registreringer.
        if (registreringer.length === 0) {
            område.textContent = "Ingen smerteregistreringer endnu.";
            return;
        }

        // Gennemgår alle registreringerne.
        registreringer.forEach((registrering, index) => {

            const boks = document.createElement("article");
            boks.className = "registration-item";

            const overskrift = document.createElement("h4");
            overskrift.textContent = "Registrering " + (index + 1);
            boks.appendChild(overskrift);

            // Hjælpefunktion til at vise oplysninger om registreringen.
            function tilføjOplysning(tekst, værdi) {
                const linje = document.createElement("p");

                linje.textContent =
                    tekst + ": " +
                    (værdi !== null && værdi !== undefined && værdi !== ""
                        ? værdi
                        : "Ikke angivet");

                boks.appendChild(linje);
            }

            tilføjOplysning(
                "Smertebeskrivelse",
                registrering.beskrivelse
            );

            tilføjOplysning(
                "Smerteintensitet",
                registrering.smerteniveau + "/10"
            );

            tilføjOplysning(
                "Smertetype",
                Array.isArray(registrering.smertetyper)
                    ? registrering.smertetyper.join(", ")
                    : registrering.smertetype
            );

            if (registrering.anden_smertetype_beskrivelse) {
                tilføjOplysning(
                    "Andet",
                    registrering.anden_smertetype_beskrivelse
                );
            }

            tilføjOplysning(
                "Placering",
                registrering.smertelokation
            );

            tilføjOplysning("Startdato", registrering.dato);
            tilføjOplysning("Starttidspunkt", registrering.starttid);

            if (registrering.igangvaerende) {
                tilføjOplysning(
                    "Status",
                    "Smerterne er ikke stoppet endnu"
                );
            } else {
                tilføjOplysning("Slutdato", registrering.slutdato);
                tilføjOplysning("Sluttidspunkt", registrering.sluttid);
            }

            område.appendChild(boks);
        });

    } catch (fejl) {

        console.error("Fejl ved hentning af registreringer:", fejl);

        område.textContent =
            "Registreringerne kunne ikke hentes. Prøv igen.";
    }
}
