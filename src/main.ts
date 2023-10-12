// -----------------------------------------
//                  IMPORT
import { Client } from "discord.js";
import * as dotenv from "dotenv";
// -----------------------------------------
dotenv.config({ path: `${__dirname}/../config/.env` }); // Fichier .env

// Client Discord
const candy = new Client({
    intents: []
});





candy.login(process.env.DISCORD_TOKEN);