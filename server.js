import express from "express";
import cors from "cors";
import {hentPatienter} from "./patients.js";
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
        res.status(500).json({ error: "Serverfejl: Kunne ikke hente patienter" });
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
