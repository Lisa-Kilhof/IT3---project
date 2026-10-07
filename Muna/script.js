function goToPatient() {
    window.location.href = "patientliste.html";
}

function goToProfessional() {
    window.location.href = "patientliste.html";
}

function goToDetails() {
    window.location.href = "detalje.html";
}

function goToLogin() {
    window.location.href = "index.html";
}

function showOtherPain() {
    const checkbox = document.getElementById("otherPain");
    const otherBox = document.getElementById("otherPainBox");

    if (checkbox.checked) {
        otherBox.style.display = "block";
    } else {
        otherBox.style.display = "none";
    }
}

function saveRegistration() {
    alert("Registrering gemt!");
    window.location.href = "detalje.html";
}

function goToPatientList() {
    window.location.href = "patientliste.html";
}

function goToNewRegistration() {
    window.location.href = "indtast-data.html";
}


// Log ud
const logoutButton = document.getElementById("logout-button");

if (logoutButton) {
    logoutButton.addEventListener("click", goToLogin);
}


// Login
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        goToPatient();
    });
}

// Patientliste
const patient1Button = document.getElementById("patient1-button");
const patient2Button = document.getElementById("patient2-button");
const patient3Button = document.getElementById("patient3-button");

if (patient1Button) {
    patient1Button.addEventListener("click", goToDetails);
}

if (patient2Button) {
    patient2Button.addEventListener("click", goToDetails);
}

if (patient3Button) {
    patient3Button.addEventListener("click", goToDetails);
}

// Patientdetaljer
const backButton = document.getElementById("back-button");
const newRegistrationButton = document.getElementById("new-registration-button");

if (backButton) {
    backButton.addEventListener("click", goToPatientList);
}

if (newRegistrationButton) {
    newRegistrationButton.addEventListener("click", goToNewRegistration);
}

// Ny smerteregistrering
const otherPain = document.getElementById("otherPain");

if (otherPain) {
    otherPain.addEventListener("change", showOtherPain);
}

const cancelButton = document.getElementById("cancel-button");

if (cancelButton) {
    cancelButton.addEventListener("click", goToPatientList);
}

const saveButton = document.getElementById("save-button");

if (saveButton) {
    saveButton.addEventListener("click", saveRegistration);
}
