import { ChatInputCommandInteraction, Client, CommandInteraction, Interaction, UserContextMenuCommandInteraction } from "discord.js";

/**
 * Liste des type de commande qu'il peut y avoir
 */
export enum CommandType {
    "command" ,
    "button",
};

/*
ChatInputCommandInteraction<Cached>
  | MessageContextMenuCommandInteraction<Cached>
  | UserContextMenuCommandInteraction<Cached>
  | AnySelectMenuInteraction<Cached>
  | ButtonInteraction<Cached>
  | AutocompleteInteraction<Cached>
  | ModalSubmitInteraction<Cached>;
*/


/**
 * Type pour les commandes (interactions Discord)
 */
export type Command = {
    name: string,
    type: keyof typeof CommandType,
    exec (client: Client, interaction: CommandInteraction):void
};

const lol: Command = {
    name: "",
    type : "button",
    exec: (client, interaction) => {
        interaction.reply("")
    }
}

/**
 * 
 */
export type CommandsList = Array<Command>;

export interface Event {
    name: string,
    once: boolean,
    is_dev: boolean,
    exec (client:Client, commands:CommandsList | undefined): void,
};