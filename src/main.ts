// -----------------------------------------
//                  IMPORT
import { Client } from "discord.js";
import { CommandType, Event_CM, makeBackgroundColor, makeFontColor } from "./utils";
import { readdirSync} from "node:fs";
import * as dotenv from "dotenv";
import * as config from "./config.json"
// -----------------------------------------

// -----------------------------------------
//                  CONFIG

// Dotenv
dotenv.config({ path: `${__dirname}/../config/.env` }); // Fichier .env

// Client Discord
const candy = new Client({
    intents: config.client.intents
});

// Liste des commandes
const InteractionListe: CommandType[] = [];
// Liste des events
const EventsListe: Event_CM[] = []
// -----------------------------------------

// -----------------------------------------
//       HANDLER EVENT/INTERACTION/WS

// Interactions
const commandFolder = readdirSync(`${__dirname}/interactions`).filter(f => f.endsWith(".ts"));
for (let fileName of commandFolder) {
    try {
        const file: CommandType = require(`${__dirname}/interactions/${fileName}`).default;
        InteractionListe.push(file);
        console.log(`${makeBackgroundColor(makeFontColor(" (i) ", "Black"), 'Green')} - Interaction: ${makeFontColor(file.name, "Blue")} load with success.`);
    } catch (err) {
        console.log(
            `${makeBackgroundColor(makeFontColor(" (!) ", "White"), 'Red')} - file: ${makeFontColor(fileName, "Blue")} can't be load.`,
            config.dev.is_dev ? `Reason:\n${makeFontColor(`${err}`, "Red")}` : ""
        );
    }
};

// Events
const eventFolder = readdirSync(`${__dirname}/events`).filter(f => f.endsWith(".ts"));
for (let fileName of eventFolder) {
    try {
        const file: Event_CM = require(`${__dirname}/events/${fileName}`).default;
        EventsListe.push(file);
        console.log(`${makeBackgroundColor(makeFontColor(" (i) ", "Black"), 'Green')} - Event: ${makeFontColor(file.name, "Blue")} load with success.`);
    } catch (err) {
        console.log(
            `${makeBackgroundColor(makeFontColor(" (!) ", "White"), 'Red')} - file: ${makeFontColor(fileName, "Blue")} can't be load.`,
            config.dev.is_dev ? `Reason:\n${makeFontColor(`${err}`, "Red")}` : ""
        );
    }
};


// -----------------------------------------

// -----------------------------------------
//          EXECUTION DES EVENTS

// .on
candy.on("ready", (client) => {
    for (let event of EventsListe) {
        try {
            if (!event.once) {
                event.exec(client, InteractionListe);
            }
        } catch (err) {
            console.log(
                `${makeBackgroundColor(makeFontColor(" (!) ", "White"), 'Red')} - Event Error (.on): ${makeFontColor(event?.name ? event.name : "Unknow", "Blue")}.`,
                config.dev.is_dev ? `Reason:\n${makeFontColor(`${err}`, "Red")}` : ""
            );
        }
    };
});

// .once
candy.once("ready", (client) => {
    for (let event of EventsListe) {
        try {
            if (event.once) {
                event.exec(client, InteractionListe);
            }
        } catch (err) {
            console.log(
                `${makeBackgroundColor(makeFontColor(" (!) ", "White"), 'Red')} - Event Error (.once): ${makeFontColor(event?.name ? event.name : "Unknow", "Blue")}.`,
                config.dev.is_dev ? `Reason:\n${makeFontColor(`${err}`, "Red")}` : ""
            );
        }
    };
});
// -----------------------------------------

// -----------------------------------------
//         EXECUTIONS DES COMMANDES

candy.on("interactionCreate", (interaction) => {

    // Slash Commande
    if (interaction.isChatInputCommand()) {
        for (let commande of InteractionListe) {
            if (commande.type == "COMMANDE" && commande.name == interaction.commandName) {
                commande.exec(candy, interaction);
            };
        };
    } else
    // Bouton
    if (interaction.isButton()) {
        for (let commande of InteractionListe) {
            if (commande.type == "BOUTON" && commande.name == interaction.customId) {
                commande.exec(candy, interaction);
            };
        };
    } else
    // Select Menu
    if (interaction.isAnySelectMenu()) {
        for (let commande of InteractionListe) {
            if (commande.type == "SELECT_MENU" && commande.name == interaction.customId) {
                commande.exec(candy, interaction);
            };
        };
    } else
    // Modals
    if (interaction.isModalSubmit()) {
        for (let commande of InteractionListe) {
            if (commande.type == "MODALS" && commande.name == interaction.customId) {
                commande.exec(candy, interaction);
            };
        };
    } else
    // AutoComplete
    if (interaction.isAutocomplete()) {
        for (let commande of InteractionListe) {
            if (commande.type == "AUTOCOMPLETE" && commande.name == interaction.commandName) {
                commande.exec(candy, interaction);
            };
        };
    } else
    // Context Menu (Message)
    if (interaction.isMessageContextMenuCommand()) {
        for (let commande of InteractionListe) {
            if (commande.type == "MESSAGE_CONTEXTMENU" && commande.name == interaction.commandName) {
                commande.exec(candy, interaction);
            };
        };
    } else
    // Context Menu (User)
    if (interaction.isUserContextMenuCommand()) {
        for (let commande of InteractionListe) {
            if (commande.type == "USER_CONTEXTMENU" && commande.name == interaction.commandName) {
                commande.exec(candy, interaction);
            };
        };
    };
});
// -----------------------------------------

// -----------------------------------------
//                WEBSOCKET

// Client WebSocket
const ws = new WebSocket(
    `${config.server.ws.protocol}://${config.server.ws.domain}`
);

ws.onmessage = (e) => {
    
}


// -----------------------------------------

// Lancement du bot
candy.login(process.env.DISCORD_TOKEN);