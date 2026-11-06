
import "dotenv/config";
import { hentPatienter } from "./patients.js";

try {
    const patienter = await hentPatienter();

    console.log("Patienter hentet fra Neon:");
    console.table(patienter);
    
    process.exit(0);
} catch (fejl) {
    console.error("Fejl ved hentning af patienter:", fejl.message);
    process.exit(1);
}
