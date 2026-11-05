
import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on("error", (fejl) => {
    console.log("Fejl i databasen:", fejl);
});

// GET: Hent alle symptomregistreringer
export async function hentSymptomregistreringer() {
    const resultat = await pool.query(
        "SELECT id, patient_id, smertetype, beskrivelse, smerteniveau, dato FROM symptomregistreringer ORDER BY id"
    );

    return resultat.rows;
}

// POST: Opret en symptomregistrering
export async function opretSymptomregistrering(patient_id, smertetype, beskrivelse, smerteniveau, dato) {
    const resultat = await pool.query(
        `INSERT INTO symptomregistreringer
        (patient_id, smertetype, beskrivelse, smerteniveau, dato)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, patient_id, smertetype, beskrivelse, smerteniveau, dato`,
        [patient_id, smertetype, beskrivelse, smerteniveau, dato]
    );

    return resultat.rows[0];
}
