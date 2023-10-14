import { Event_CM, makeBackgroundColor, makeFontColor } from "../utils";
import * as config from "../config.json";
import { SlashCommandBuilder } from "discord.js";

export default {
    name: "Push Slash Commands",
    once: false,
    exec: (client, InteractionListe) => {
        // Push commands
        if (config.dev.push_commands) {
            // Liste des commandes slash
            const commands = InteractionListe!.map(int => {
                if (int.type === "COMMANDE") return int.info
            }) as SlashCommandBuilder[];

            // Ajout dans le serveur de dev
            if (config.dev.is_dev) {
                // On vire les anciennes commandes
                client.guilds.cache.get(config.dev.dev_server)?.commands.set([]);

                // On ajoute les nouvelles
                client.guilds.cache.get(config.dev.dev_server)?.commands.set(commands);

                console.log(`${makeBackgroundColor(makeFontColor(" (i) ", "Black"), "Green")} - Push command ${makeFontColor("activate", "Green")} : Commands added to ${makeFontColor("dev_server", "Blue")} with success`)
            }
            // Ajout en globale
            else {
                // On vire les anciennes commandes
                client.application?.commands.set([]);

                // On ajoute les nouvelles
                client.application?.commands.set(commands);

                console.log(`${makeBackgroundColor(makeFontColor(" (i) ", "Black"), "Green")} - Push command ${makeFontColor("activate", "Green")} : Commands added to ${makeFontColor("global", "Blue")} with success`)
            }
        } // Pas push
        else {
            console.log(
                `${makeBackgroundColor(makeFontColor(" (i) ", "Black"), "White")} - Push command ${makeFontColor("disable", "Red")}.`
            );
        };
    }
} as Event_CM;