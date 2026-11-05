import express from "express";
import cors from "cors";
import "dotenv/config";

import { hentPatienter, testDatabase } from "./patients.js";
import {
    hentSymptomregistreringer,
    opretSymptomregistrering
} from "./symptomregistreringer.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// GET: Hent alle patienter
app.get("/api/patients", async (req, res) => {
    try{
        const patients = await hentPatienter();
        res.json(patients);
    }catch(fejl){
            console.error("Fejl ved hentning af patienter:", fejl);

        res.status(500).json({ error: "Serverfejl: Kunne ikke hente patienter" });
    }
    });

    app.get("/api/test-db", async (req, res) => {
    try {
        const resultat = await testDatabase();
        res.json({
            besked: "Databaseforbindelsen virker!",
            database: resultat
        });
   } catch (fejl) {
    console.error("Database test fejlede:");
    console.error("Fejlkode:", fejl.code);
    console.error("Fejlbesked:", fejl.message);

    res.status(500).json({
        error: "Databaseforbindelsen fejlede",
        code: fejl.code
    });
}
});


// GET: Hent alle symptomregistreringer
app.get("/api/symptomregistreringer", async (req, res) => {
    try {
        const registreringer = await hentSymptomregistreringer();
        res.json(registreringer);
    } catch (fejl) {
        console.error("Fejl ved hentning:", fejl);
        res.status(500).json({ error: "Kunne ikke hente registreringer" });
    }
});

// POST: Opret en symptomregistrering
app.post("/api/symptomregistreringer", async (req, res) => {
    try {
        const {
            patient_id,
            smertetype,
            beskrivelse,
            smerteniveau,
            dato
        } = req.body ?? {};

        if (
            !patient_id ||
            !smertetype ||
            !beskrivelse ||
            smerteniveau === undefined ||
            smerteniveau === null ||
            !dato
        ) {
            return res.status(400).json({
                error: "Alle felter skal udfyldes"
            });
        }

        const nyRegistrering = await opretSymptomregistrering(
            patient_id,
            smertetype,
            beskrivelse,
            smerteniveau,
            dato
        );

        res.status(201).json(nyRegistrering);

    } catch (fejl) {
        console.error("Fejl ved oprettelse:", fejl);
        res.status(500).json({
            error: "Kunne ikke oprette registrering"
        });
    }
});


// 404: Hvis ruten ikke findes
app.use((req, res) => {
    res.status(404).json({ error: "not found" });
});

// Start serveren
app.listen(PORT, () => {
    console.log(`Serveren kører på port ${PORT}`);
});
