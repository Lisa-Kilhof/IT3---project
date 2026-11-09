import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";

import { hentPatienter } from "./patients.js";
import {
    hentSymptomregistreringer,
    opretSymptomregistrering
} from "./symptomregistreringer.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Serverer frontend-filerne lokalt
if (!process.env.VERCEL) {
    app.use(express.static("public"));
}
// Viser forsiden
app.get("/", (req, res) => {
    res.sendFile(path.join(import.meta.dirname, "public", "index.html"));
});
// GET: Hent alle patienter fra Neon
app.get("/api/patients", async (req, res) => {
    try {
        const patienter = await hentPatienter();
        res.status(200).json(patienter);
    } catch (fejl) {
        console.error("Fejl ved hentning af patienter:", fejl);
        res.status(500).json({ error: "serverfejl" });
    }
});

// GET: Hent smerteregistreringer
// Kan filtreres på patient_id, fx /api/symptomregistreringer?patient_id=1
app.get("/api/symptomregistreringer", async (req, res) => {
    try {
        const patientId = req.query.patient_id
            ? Number(req.query.patient_id)
            : null;

        if (patientId !== null &&
            (!Number.isInteger(patientId) || patientId <= 0)) {
            return res.status(400).json({
                error: "Ugyldigt patient_id"
            });
        }

        const registreringer =
            await hentSymptomregistreringer(patientId);

        res.status(200).json(registreringer);
    } catch (fejl) {
        console.error("Fejl ved hentning af registreringer:", fejl);
        res.status(500).json({ error: "serverfejl" });
    }
});

// POST: Opret en ny smerteregistrering
app.post("/api/symptomregistreringer", async (req, res) => {
    try {
        const data = req.body ?? {};

        const {
            patient_id,
            beskrivelse,
            smerteniveau,
            dato,
            smertelokation,
            starttid
        } = data;

        // Kontroller obligatoriske felter
        if (
            !patient_id ||
            !beskrivelse?.trim() ||
            smerteniveau === undefined ||
            !dato ||
            !smertelokation?.trim() ||
            !starttid
        ) {
            return res.status(400).json({
                error: "Obligatoriske felter mangler"
            });
        }

        const patientId = Number(patient_id);
        const niveau = Number(smerteniveau);

        if (
            !Number.isInteger(patientId) ||
            patientId <= 0 ||
            !Number.isInteger(niveau) ||
            niveau < 0 ||
            niveau > 10
        ) {
            return res.status(400).json({
                error: "Ugyldige værdier"
            });
        }

        const igangvaerende = data.igangvaerende === true;

        const nyRegistrering = await opretSymptomregistrering({
            ...data,
            patient_id: patientId,
            smerteniveau: niveau,
            smertetype: data.smertetype ??
                (data.smertetyper || []).join(", "),
            smertetyper: data.smertetyper || [],
            igangvaerende,
           slutdato: igangvaerende ? null : data.slutdato || null,
           sluttid: igangvaerende ? null : data.sluttid || null,
           anden_smertetype_beskrivelse:
    data.anden_smertetype_beskrivelse || null
        });
        res.status(201).json(nyRegistrering);

    } catch (fejl) {
        console.error("Fejl ved oprettelse af registrering:", fejl);
        res.status(500).json({ error: "serverfejl" });
    }
});

// 404: Ukendt rute
app.use((req, res) => {
    res.status(404).json({ error: "not found" });
});

// Start serveren
app.listen(PORT, () => {
    console.log(`Serveren kører på port ${PORT}`);
});
