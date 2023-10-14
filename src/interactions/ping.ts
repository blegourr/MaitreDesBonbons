import { ChatCommandInteraction } from "../utils";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
    name: "ping",
    type: "COMMANDE",
    info: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Permet d'obtenir le ping du bot"),
    exec: async (client, interaction) => {
        const ping = new EmbedBuilder()
            .setTitle("Voici mon ping")
            .setDescription(`Ping WS: \`${client.ws.ping}ms\``)
            .setTimestamp()
        await interaction.reply({ embeds: [ping] });
    }
} as ChatCommandInteraction;