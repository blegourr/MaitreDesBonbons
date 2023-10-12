// -----------------------------------------
//                  IMPORT
import { Client } from "discord.js";
import { CommandType, CommandsList, Event_CM } from "./types";
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
const CommandeListe: CommandType[] = [];
// Liste des events
const EventsListe: Event_CM[] = []
// -----------------------------------------

// -----------------------------------------
//       HANDLER EVENT ET INTERACTION

// Interactions
const commandFolder = readdirSync(`${__dirname}/interactions`).filter(f => f.endsWith(".ts"));
for (let fileName of commandFolder) {
    const file: CommandType = require(`${__dirname}/interactions/${fileName}`).default;
    CommandeListe.push(file);
};

// Events
const eventFolder = readdirSync(`${__dirname}/events`).filter(f => f.endsWith(".ts"));
for (let fileName of eventFolder) {
    const file: Event_CM = require(`${__dirname}/events/${fileName}`).default;
    EventsListe.push(file);
};
// -----------------------------------------

// -----------------------------------------
//          EXECUTION DES EVENTS

// .on
candy.on("ready", (client) => {
    for (let event of EventsListe) {
        if (!event.once) {
            event.exec(client, CommandeListe);
        }
    };
});

// .once
candy.once("ready", (client) => {
    for (let event of EventsListe) {
        if (event.once) {
            event.exec(client, CommandeListe);
        };
    };
});
// -----------------------------------------

// -----------------------------------------
//         EXECUTIONS DES COMMANDES

candy.on("interactionCreate", (interaction) => {

    // Slash Commande
    if (interaction.isChatInputCommand()) {
        for (let commande of CommandeListe) {
            if (commande.type == "COMMANDE" && commande.name == interaction.commandName) {
                commande.exec(candy, interaction);
            };
        };
    } else
    // Bouton
    if (interaction.isButton()) {
        for (let commande of CommandeListe) {
            if (commande.type == "BOUTON" && commande.name == interaction.customId) {
                commande.exec(candy, interaction);
            };
        };
    } else
    // Select Menu
    if (interaction.isAnySelectMenu()) {
        for (let commande of CommandeListe) {
            if (commande.type == "SELECT_MENU" && commande.name == interaction.customId) {
                commande.exec(candy, interaction);
            };
        };
    } else
    // Modals
    if (interaction.isModalSubmit()) {
        for (let commande of CommandeListe) {
            if (commande.type == "MODALS" && commande.name == interaction.customId) {
                commande.exec(candy, interaction);
            };
        };
    } else
    // AutoComplete
    if (interaction.isAutocomplete()) {
        for (let commande of CommandeListe) {
            if (commande.type == "AUTOCOMPLETE" && commande.name == interaction.commandName) {
                commande.exec(candy, interaction);
            };
        };
    } else
    // Context Menu (Message)
    if (interaction.isMessageContextMenuCommand()) {
        for (let commande of CommandeListe) {
            if (commande.type == "MESSAGE_CONTEXTMENU" && commande.name == interaction.commandName) {
                commande.exec(candy, interaction);
            };
        };
    } else
    // Context Menu (User)
    if (interaction.isUserContextMenuCommand()) {
        for (let commande of CommandeListe) {
            if (commande.type == "USER_CONTEXTMENU" && commande.name == interaction.commandName) {
                commande.exec(candy, interaction);
            };
        };
    };
});
// -----------------------------------------

// Lancement du bot
candy.login(process.env.DISCORD_TOKEN);