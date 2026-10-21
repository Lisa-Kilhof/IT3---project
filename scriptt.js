// Logger patienter og sundhedspersonale ind
function logInd() {

    // Henter bruger-ID og adgangskode
    const id = document.getElementById("brugerID").value.trim();
    const kode = document.getElementById("adgangskode").value;

    // Kontrollerer om det er en patient
    if ((id === "01" || id === "02") && kode === "1234") {

        // Gemmer at brugeren er patient
        sessionStorage.setItem("rolle", "patient");

        // Gemmer patientens unikke ID
        sessionStorage.setItem("patientID", id);

        // Åbner smertedagbogen
        window.location.href = "smerte-dagbog.html";

    }
    // Kontrollerer om det er sundhedspersonale
    else if (id === "2001" && kode === "1234") {

        // Gemmer at brugeren er sundhedspersonale
        sessionStorage.setItem("rolle", "personale");

        // Fjerner eventuelt tidligere patient-ID
        sessionStorage.removeItem("patientID");

        // Åbner patientlisten
        window.location.href = "PatientListe.html";

    }
    // Hvis oplysningerne er forkerte
    else {

        alert("Forkert bruger-ID eller adgangskode.");

    }
}

// PATIENTLISTE// 
// Kontrollerer om sundhedspersonalet er logget ind
function tjekPersonaleLogin() {

    const rolle = sessionStorage.getItem("rolle");

    if (rolle !== "personale") {
        window.location.href = "index1.html";
    }

}

// Åbner den valgte patients detaljeside
function visRegistreringer(navn) {

    sessionStorage.setItem("valgtPatient", navn);

    window.location.href = "Detalje1.html";
}

// PATIENTDETALJER//


// Viser oplysninger om den valgte patient
function visPatientDetaljer() {

    // Kontrollerer login
    if (sessionStorage.getItem("rolle") !== "personale") {
        window.location.href = "index1.html";
        return;
    }

    // Henter patientens navn
    const navn = sessionStorage.getItem("valgtPatient");

    let patientID = "";

    // Finder patientens ID
    if (navn === "Anna Jensen") {

        patientID = "01";

    } else if (navn === "Mads Hansen") {

        patientID = "02";

    } else {

        window.location.href = "PatientListe.html";
        return;
    }

    // Viser patientens navn og ID
    document.getElementById("patientNavn").textContent = navn;

    document.getElementById("patientID").textContent = patientID;
    visPatientRegistreringer(patientID);
}
// LOG UD//
// Logger sundhedspersonalet ud
function logUd() {

    sessionStorage.removeItem("rolle");

    sessionStorage.removeItem("valgtPatient");

    window.location.href = "index1.html";
}
// Viser smerteregistreringer for den valgte patient
function visPatientRegistreringer(patientID) {

    // Henter patientens gemte registreringer
    const registreringer = JSON.parse(
        localStorage.getItem("registreringer_" + patientID)
    ) || [];

    // Finder området hvor registreringerne skal vises
    const område = document.getElementById("patientRegistreringer");

    // Fjerner tidligere indhold
    område.innerHTML = "";

    // Hvis patienten ikke har registreret smerter endnu
    if (registreringer.length === 0) {

        område.textContent = "Ingen smerteregistreringer endnu.";
        return;
    }

    // Gennemgår patientens registreringer
    registreringer.forEach(function(registrering, index) {

        // Opretter en boks til registreringen
        const boks = document.createElement("div");
        boks.className = "registration-item";

        // Opretter overskrift
        const overskrift = document.createElement("h4");
        overskrift.textContent = "Registrering " + (index + 1);
        boks.appendChild(overskrift);

        // Funktion til at vise oplysninger
        function tilføjOplysning(tekst, værdi) {

            const linje = document.createElement("p");
            linje.textContent = tekst + ": " + (værdi || "Ikke angivet");
            boks.appendChild(linje);

        }

        tilføjOplysning("Smertebeskrivelse", registrering.beskrivelse);
        tilføjOplysning("Smerteintensitet", registrering.intensitet + "/10");
        tilføjOplysning("Smertetype", registrering.smertetyper.join(", "));

        if (registrering.andet) {
            tilføjOplysning("Andet", registrering.andet);
        }

        tilføjOplysning("Placering", registrering.placering);
        tilføjOplysning("Startdato", registrering.startDato);
        tilføjOplysning("Starttidspunkt", registrering.startTid);

        if (registrering.stadigSmerter) {

            tilføjOplysning("Status", "Smerterne er ikke stoppet endnu");

        } else {

            tilføjOplysning("Slutdato", registrering.slutDato);
            tilføjOplysning("Sluttidspunkt", registrering.slutTid);

        }

        // Viser registreringen på siden
        område.appendChild(boks);

    });
}