
"use strict";

// ======================================================
// SMERTEFORMULAR
// ======================================================

// Opdaterer tallet ved siden af skyderen for smerteintensitet.
function opdaterIntensitet() {

    const slider = document.getElementById("painIntensity");
    const output = document.getElementById("intensityValue");

    // Kontrollerer, at begge HTML-elementer findes på siden.
    if (slider && output) {
        output.textContent = slider.value;
    }
}


// Viser eller skjuler felterne til slutdato og sluttidspunkt.
// Slutfelterne er kun nødvendige, hvis smerterne er stoppet.
function visSluttid() {

    const igangvaerende = document.getElementById("painOngoing");
    const slutFelter = document.getElementById("slutTidFelter");
    const slutDato = document.getElementById("painEndDate");
    const slutTid = document.getElementById("painEndTime");

    // Stopper funktionen, hvis de nødvendige elementer ikke findes.
    if (!igangvaerende || !slutFelter) return;

    // Skjuler slutfelterne, når smerterne stadig er i gang.
    slutFelter.hidden = igangvaerende.checked;

    // Slutdato og sluttid er kun obligatoriske,
    // når patienten har markeret, at smerterne er stoppet.
    slutDato.required = !igangvaerende.checked;
    slutTid.required = !igangvaerende.checked;
}


// Viser eller skjuler tekstfeltet til valgmuligheden "Andet".
function visAndetFelt() {

    const andetValgt = document.getElementById("otherPainType");
    const andetFelt = document.getElementById("otherPainText");
    const beskrivelse = document.getElementById("otherPainDescription");

    // Stopper funktionen, hvis de nødvendige HTML-elementer mangler.
    if (!andetValgt || !andetFelt) return;

    // Viser tekstfeltet, hvis "Andet" er valgt.
    andetFelt.hidden = !andetValgt.checked;

    // Gør den ekstra beskrivelse obligatorisk,
    // når patienten har valgt "Andet".
    beskrivelse.required = andetValgt.checked;
}


// Henter, kontrollerer og gemmer patientens smerteregistrering.
// Hvis der mangler oplysninger, vises en dialogboks,
// hvor patienten kan vælge at gemme registreringen alligevel.
async function gemSmerteLog(event, gemAlligevel = false) {

    // Forhindrer formularen i at genindlæse siden.
    if (event) event.preventDefault();

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

    // Fjerner en tidligere fejlbesked.
    if (fejl) fejl.textContent = "";

    // Henter alle valgte smertetyper fra formularen.
    const smertetyper = Array.from(
        document.querySelectorAll('input[name="painType"]:checked')
    ).map(felt => felt.value);

    // Kontrollerer, om smerterne stadig er i gang.
    const stadigSmerter = document.getElementById("painOngoing").checked;

    // Henter patientens eventuelle ekstra beskrivelse af smerten.
    const andet = document.getElementById("otherPainDescription").value.trim();

    // Samler oplysningerne fra formularen i ét objekt.
    const registrering = {

        // Patientens egen beskrivelse af smerterne.
        beskrivelse: document.getElementById("painDescription").value.trim(),

        // Den valgte smerteintensitet fra 0 til 10.
        intensitet: document.getElementById("painIntensity").value,

        // De smertetyper, patienten har valgt.
        smertetyper: smertetyper,

        // Patientens ekstra beskrivelse ved valget "Andet".
        anden_smertetype_beskrivelse: andet,

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

    // Samler alle manglende oplysninger.
    const mangler = [];

    if (!registrering.beskrivelse) {
        mangler.push("Beskrivelse af smerterne");
    }

    if (smertetyper.length === 0) {
        mangler.push("Beskrivelse af smertetypen");
    }

    if (document.getElementById("otherPainType").checked && !andet) {
        mangler.push("Uddybning af smertetypen under 'Andet'");
    }

    if (!registrering.placering) {
        mangler.push("Placering af smerterne");
    }

    if (!registrering.startDato) {
        mangler.push("Startdato");
    }

    if (!registrering.startTid) {
        mangler.push("Starttidspunkt");
    }

    if (!stadigSmerter && !registrering.slutDato) {
        mangler.push("Slutdato");
    }

    if (!stadigSmerter && !registrering.slutTid) {
        mangler.push("Sluttidspunkt");
    }

    // Hvis der mangler oplysninger, vises dialogboksen.
    // Hvis patienten allerede har bekræftet, springes kontrollen over.
    if (mangler.length > 0 && !gemAlligevel) {

        const overlay = document.getElementById("gemDialogOverlay");
        const besked = document.getElementById("gemDialogBesked");

        // Kontrollerer, at dialogboksen findes i HTML-dokumentet.
        if (!overlay || !besked) {
            if (fejl) {
                fejl.textContent = "Bekræftelsesboksen kunne ikke åbnes.";
            }
            return;
        }

        // Viser de oplysninger, som mangler i registreringen.
        besked.textContent =
            "Du mangler at udfylde følgende oplysninger:\n\n" +
            mangler.map(punkt => "- " + punkt).join("\n") +
            "\n\nVil du gemme registreringen alligevel?";

        besked.style.whiteSpace = "pre-line";

        // Åbner dialogboksen.
        overlay.hidden = false;

        // Flytter fokus til annuller-knappen.
        document.getElementById("annullerGem").focus();
        return;
    }

    // Oversætter patientens login-ID til det tilhørende ID i databasen.
    const databasePatientID = {
        "01": 6,
        "02": 7
    }[patientID];

    try {

        // Sender smerteregistreringen til backend.
        const response = await fetch("/api/symptomregistreringer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                patient_id: databasePatientID,
                smertetype: smertetyper.join(", "),
                beskrivelse: registrering.beskrivelse,
                smerteniveau: Number(registrering.intensitet),
                dato: registrering.startDato,
                smertetyper: registrering.smertetyper,
                smertelokation: registrering.placering,
                starttid: registrering.startTid,
                slutdato: registrering.slutDato || null,
                sluttid: registrering.slutTid || null,
                igangvaerende: registrering.stadigSmerter,
                anden_smertetype_beskrivelse:
                    registrering.anden_smertetype_beskrivelse || null
            })
        });

        if (!response.ok) {
            throw new Error("Registreringen kunne ikke gemmes.");
        }

    } catch (error) {

        console.error("Fejl ved gemning:", error);

        if (fejl) {
            fejl.textContent =
                "Registreringen kunne ikke gemmes. Prøv igen.";
        }

        const overlay = document.getElementById("gemDialogOverlay");
        if (overlay) overlay.hidden = true;

        return;
    }

    // Lukker dialogboksen efter gemning.
    const overlay = document.getElementById("gemDialogOverlay");
    if (overlay) overlay.hidden = true;

    // Sender patienten tilbage til forsiden.
    window.location.href = "index.html";
}


// ======================================================
// INITIALISERING AF SMERTEFORMULAR
// ======================================================

// Tilknytter hændelser til formularens elementer,
// når HTML-dokumentet er indlæst.
document.addEventListener("DOMContentLoaded", function () {

    // Finder patientens smerteformular.
    const smerteForm = document.getElementById("smerteForm");

    // Tilknytter funktionen, der kontrollerer og gemmer registreringen.
    if (smerteForm) {
        smerteForm.addEventListener("submit", gemSmerteLog);
    }

    // Finder afkrydsningsfeltet for "Andet".
    const andetValgt = document.getElementById("otherPainType");

    // Tilknytter funktionen, der viser eller skjuler tekstfeltet.
    // Funktionen køres også ved indlæsning for at sikre korrekt visning.
    if (andetValgt) {
        andetValgt.addEventListener("change", visAndetFelt);
        visAndetFelt();
    }

    // Finder afkrydsningsfeltet for igangværende smerter.
    const igangvaerende = document.getElementById("painOngoing");

    // Tilknytter funktionen, der viser eller skjuler slutfelterne.
    // Funktionen køres også ved indlæsning.
    if (igangvaerende) {
        igangvaerende.addEventListener("change", visSluttid);
        visSluttid();
    }
});


// ======================================================
// BEKRÆFTELSESDIALOG TIL SMERTEREGISTRERING
// ======================================================

// Tilknytter hændelser til dialogboksens knapper.
document.addEventListener("DOMContentLoaded", function () {

    // Finder dialogboksen og dens knapper.
    const overlay = document.getElementById("gemDialogOverlay");
    const annullerKnap = document.getElementById("annullerGem");
    const gemKnap = document.getElementById("bekraeftGem");

    // Stopper, hvis dialogboksen ikke findes på den aktuelle side.
    if (!overlay || !annullerKnap || !gemKnap) {
        return;
    }

    // Lukker dialogboksen uden at gemme registreringen.
    annullerKnap.addEventListener("click", function () {
        overlay.hidden = true;
    });

    // Gemmer registreringen, selvom nogle oplysninger mangler.
    gemKnap.addEventListener("click", function () {
        gemSmerteLog(null, true);
    });

    // Lukker dialogboksen, hvis der klikkes uden for selve boksen.
    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            overlay.hidden = true;
        }
    });

    // Gør det muligt at lukke dialogboksen med Escape.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !overlay.hidden) {
            overlay.hidden = true;
        }
    });
});
