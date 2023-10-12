// ------------------------------
//            IMPORT
import {
    Client,
    ModalSubmitInteraction,
    AutocompleteInteraction,
    AnySelectMenuInteraction,
    ChatInputCommandInteraction,
    UserContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction,
    ButtonInteraction
} from "discord.js";
// ------------------------------

/**
 * Type pour les slash commandes
 */
export type ChatCommandInteraction = {
    name: string,
    type: "COMMANDE",
    exec (client: Client, interaction: ChatInputCommandInteraction):void
};

/**
 * Type pour les boutons (interactions)
 */
export type BoutonInteraction = {
    name: string,
    type: "BOUTON",
    exec (client: Client, interaction: ButtonInteraction) : void,
}

/**
 * Type pour les select menu (interactions)
 */
export type SelectMenuInteraction = {
    name: string,
    type: "SELECT_MENU",
    exec (client: Client, interaction: AnySelectMenuInteraction) : void,
}

/**
 * Type pour les modals (interactions)
 */
export type ModalsInteraction = {
    name: string,
    type: "MODALS",
    exec (client: Client, interaction: ModalSubmitInteraction) : void,
}

/**
 * Type pour les saisie automatique (interactions)
 */
export type AutoCompleteInteraction = {
    name: string,
    type: "AUTOCOMPLETE",
    exec (client: Client, interaction: AutocompleteInteraction) : void,
}

/**
 * Type pour les Contexte menu en message (interactions)
 */
export type MessageContextMenuInteraction = {
    name: string,
    type: "MESSAGE_CONTEXTMENU",
    exec (client: Client, interaction: MessageContextMenuCommandInteraction) : void,
}

/**
 * Type pour les contexte menu d'un utilisateur (interactions)
 */
export type UserContextMenuInteraction = {
    name: string,
    type: "USER_CONTEXTMENU",
    exec (client: Client, interaction: UserContextMenuCommandInteraction) : void,
}

/**
 * Liste des interactions possible
 */
export type CommandType = ChatCommandInteraction
| BoutonInteraction
| SelectMenuInteraction
| ModalsInteraction
| AutoCompleteInteraction
| MessageContextMenuInteraction
| UserContextMenuInteraction;

/**
 * Type pour le tableau de commande (Handler)
 */
export type CommandsList = CommandType[];

/**
 * Type pour les events (Handler)
 */
export type Event_CM = {
    name: string,
    once: boolean,
    is_dev: boolean,
    exec (client:Client, commands?:CommandsList | undefined): void,
};