
// Logger patienten ind
function logInd() {

    const brugernavn = document.getElementById("username").value;
    const adgangskode = document.getElementById("password").value;

    // Kontrollerer brugernavn og adgangskode
    if (brugernavn === "patient" && adgangskode === "1234") {

        // Gemmer login-status
        localStorage.setItem("loggedIn", "true");

        // Åbner smertedagbogen
        window.location.href = "Smertedagbog.html";

    } else {

        // Viser fejl ved forkert login
        alert("Forkert brugernavn eller adgangskode.");

    }
}


// Gemmer smerteoplysningerne
function gemSmerteLog() {

    // Henter patientens egen beskrivelse
    const beskrivelse = document.getElementById("painDescription").value;

    // Henter smerteintensiteten
    const intensitet = document.getElementById("painIntensity").value;

    // Henter valgte beskrivelser af smerten
    const painTypes = document.querySelectorAll('input[name="painType"]:checked');

    const smertetyper = [];

    painTypes.forEach(function(type) {
        smertetyper.push(type.value);
    });

    // Henter patientens egen beskrivelse ved "Andet"
    const andet = document.getElementById("otherPainDescription").value;

    // Henter hvor smerten sidder
    const placering = document.getElementById("painLocation").value;

    // Henter startdato og starttidspunkt
    const startDato = document.getElementById("painStartDate").value;
    const startTid = document.getElementById("painStartTime").value;

    // Henter slutdato og sluttidspunkt
    const slutDato = document.getElementById("painEndDate").value;
    const slutTid = document.getElementById("painEndTime").value;

    // Henter om smerterne stadig er i gang
    const stadigSmerter = document.getElementById("painOngoing").checked;

    // Finder manglende oplysninger
    const mangler = [];

    // Kontrollerer smertebeskrivelsen
    if (beskrivelse.trim() === "") {
        mangler.push("smertebeskrivelse");
    }

    // Kontrollerer smerteintensiteten
    if (intensitet === "") {
        mangler.push("smerteintensitet");
    }

    // Kontrollerer at mindst én smertetype er valgt
    if (smertetyper.length === 0) {
        mangler.push("hvordan smerten føles");
    }

    // Kontrollerer "Andet"
    if (document.getElementById("otherPainType").checked && andet.trim() === "") {
        mangler.push("beskrivelse af 'Andet'");
    }

    // Kontrollerer hvor smerten sidder
    if (placering.trim() === "") {
        mangler.push("hvor smerten sidder");
    }

    // Kontrollerer startdato og starttid
    if (startDato === "") {
        mangler.push("startdato");
    }

    if (startTid === "") {
        mangler.push("starttidspunkt");
    }

    // Kontrollerer slutdato og sluttid,
    // hvis smerterne ikke stadig er i gang
    if (!stadigSmerter) {

        if (slutDato === "") {
            mangler.push("slutdato");
        }

        if (slutTid === "") {
            mangler.push("sluttidspunkt");
        }
    }

    // Spørger om patienten stadig vil gemme
    if (mangler.length > 0) {

        const besked =
        "Du mangler at udfylde:\n\n" +
        mangler.map(function(felt) {
            return "• " + felt;
        }).join("\n") +
        "\n\nVil du stadig gemme og lukke?";

        const gemAlligevel = confirm(besked);

        if (!gemAlligevel) {
            return;
        }
    }

    // Samler alle oplysningerne i én smertelog
    const smerteLog = {
        beskrivelse: beskrivelse,
        intensitet: intensitet,
        smertetyper: smertetyper,
        andet: andet,
        placering: placering,
        startDato: startDato,
        startTid: startTid,
        slutDato: slutDato,
        slutTid: slutTid,
        stadigSmerter: stadigSmerter
    };

   // Henter ID på patienten, der er logget ind
const patientID = sessionStorage.getItem("patientID");

// Henter patientens tidligere registreringer
const registreringer = JSON.parse(
    localStorage.getItem("registreringer_" + patientID)
) || [];

// Tilføjer den nye registrering
registreringer.push(smerteLog);

// Gemmer alle patientens registreringer
localStorage.setItem(
    "registreringer_" + patientID,
    JSON.stringify(registreringer)
);
alert("Registrering gemt for patient: " + patientID);

// Går tilbage til login
window.location.href = "index1.html";
}


// Kontrollerer om patienten er logget ind
function tjekLogin() {

    const rolle = sessionStorage.getItem("rolle");
    const patientID = sessionStorage.getItem("patientID");

    // Kontrollerer at det er en gyldig patient
    if (rolle !== "patient" || (patientID !== "01" && patientID !== "02")) {

        window.location.href = "index1.html";
        return;

    }
}


// Opdaterer tallet for smerteintensiteten
function opdaterIntensitet() {

    const slider = document.getElementById("painIntensity");
    const tal = document.getElementById("intensityValue");

    tal.textContent = slider.value;
}


// Viser eller skjuler tekstfeltet ved "Andet"
const otherPainType = document.getElementById("otherPainType");

if (otherPainType) {

    otherPainType.addEventListener("change", function() {

        const otherPainText = document.getElementById("otherPainText");

        if (this.checked) {

            otherPainText.style.display = "block";

        } else {

            otherPainText.style.display = "none";

        }

    });

}


// Viser eller skjuler slutdato og sluttidspunkt
const painOngoing = document.getElementById("painOngoing");

if (painOngoing) {

    painOngoing.addEventListener("change", function() {

        const endDate = document.getElementById("painEndDate");
        const endTime = document.getElementById("painEndTime");

        if (this.checked) {

            endDate.style.display = "none";
            endTime.style.display = "none";

        } else {

            endDate.style.display = "inline-block";
            endTime.style.display = "inline-block";

        }

    });

}