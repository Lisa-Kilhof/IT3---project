import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Patienter (midlertidigt i hukommelsen)
let patients = [
    { cpr: "2512489996", navn: "Nancy Ann Test Berggren" },
    { cpr: "0107729995", navn: "Max Test Berggren" }
];

// GET: Hent alle patienter
app.get("/api/patients", (req, res) => {
    res.json(patients);
});
// POST: Opret en ny patient
app.post("/api/patients", (req, res) => {
    const { cpr, navn } = req.body ?? {};

    if (!cpr || !navn) {
        return res.status(400).json({
            error: "CPR og navn skal udfyldes"
        });
    }

    const nyPatient = { cpr, navn };

    patients.push(nyPatient);

    res.status(201).json(nyPatient);
});
// 404: Hvis ruten ikke findes
app.use((req, res) => {
    res.status(404).json({ error: "not found" });
});

// Start serveren
app.listen(PORT, () => {
    console.log(`Serveren kører på port ${PORT}`);
});