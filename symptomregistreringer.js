import { pool } from "./patients.js";

export async function hentSymptomregistreringer(patientId = null) {
    let resultat;

    if (patientId !== null) {
        resultat = await pool.query(
            `SELECT *
             FROM symptomregistreringer
             WHERE patient_id = $1
             ORDER BY dato DESC, id DESC`,
            [patientId]
        );
    } else {
        resultat = await pool.query(
            `SELECT *
             FROM symptomregistreringer
             ORDER BY dato DESC, id DESC`
        );
    }

    return resultat.rows;
}

export async function opretSymptomregistrering(data) {
    const {
        patient_id,
        smertetype,
        beskrivelse,
        smerteniveau,
        dato,
        smertetyper,
        smertelokation,
        starttid,
        slutdato,
        sluttid,
        igangvaerende,
        anden_smertetype_beskrivelse
    } = data;

    const resultat = await pool.query(
        `INSERT INTO symptomregistreringer (
            patient_id,
            smertetype,
            beskrivelse,
            smerteniveau,
            dato,
            smertetyper,
            smertelokation,
            starttid,
            slutdato,
            sluttid,
            igangvaerende,
            anden_smertetype_beskrivelse
        )
        VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11, $12
        )
        RETURNING *`,
        [
            patient_id,
            smertetype,
            beskrivelse,
            smerteniveau,
            dato,
            smertetyper,
            smertelokation,
            starttid,
            slutdato,
            sluttid,
            igangvaerende,
            anden_smertetype_beskrivelse || null
        ]
    );

    return resultat.rows[0];
}