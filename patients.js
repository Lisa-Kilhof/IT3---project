
import pg from "pg";

const { Pool } = pg;

// Opretter en forbindelse til vores PostgreSQL-database i Neon.
export const pool = new Pool({
        connectionString: process.env.DATABASE_URL
});

// Logger fejl, hvis forbindelsen mistes, mens serveren kører.
pool.on("error", (fejl) => {
    console.error("Uventet fejl i databaseforbindelsen:", fejl);
});

// Henter alle patienter fra patients-tabellen.
export async function hentPatienter() {
    const result = await pool.query(
        "SELECT id, cpr, navn FROM patients ORDER BY id"
    );

    return result.rows;
}

// Tester, om forbindelsen til databasen virker.
export async function testDatabase() {
    const result = await pool.query("SELECT NOW()");
    return result.rows[0];
}
