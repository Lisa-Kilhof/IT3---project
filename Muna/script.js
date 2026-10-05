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
function gotoPatientList() {
    window.location.href = "patientliste.html";
}
function goToNewRegistration() {
    window.location.href = "indtast-data.html";
}
