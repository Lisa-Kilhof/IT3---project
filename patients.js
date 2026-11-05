import "dotenv/config";
console.log("DATABASE_URL indlæst:", Boolean(process.env.DATABASE_URL));
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on("error", (fejl) => {
    console.log("Fejl i databasen:", fejl);
});

export async function hentPatienter() {
    const resultat = await pool.query(
        "SELECT id, cpr, navn FROM patients ORDER BY id"
    );

    return resultat.rows;
}
export async function testDatabase() {
    const resultat = await pool.query("SELECT NOW()");
    return resultat.rows[0];
}