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
    ButtonInteraction,
    SlashCommandBuilder
} from "discord.js";
// ------------------------------

/**
 * Type pour les slash commandes
 */
export type ChatCommandInteraction = {
    name: string,
    type: "COMMANDE",
    info: SlashCommandBuilder,
    exec(client: Client, interaction: ChatInputCommandInteraction): Promise<void>
};

/**
 * Type pour les boutons (interactions)
 */
export type BoutonInteraction = {
    name: string,
    type: "BOUTON",
    exec(client: Client, interaction: ButtonInteraction): void,
}

/**
 * Type pour les select menu (interactions)
 */
export type SelectMenuInteraction = {
    name: string,
    type: "SELECT_MENU",
    exec(client: Client, interaction: AnySelectMenuInteraction): void,
}

/**
 * Type pour les modals (interactions)
 */
export type ModalsInteraction = {
    name: string,
    type: "MODALS",
    exec(client: Client, interaction: ModalSubmitInteraction): void,
}

/**
 * Type pour les saisie automatique (interactions)
 */
export type AutoCompleteInteraction = {
    name: string,
    type: "AUTOCOMPLETE",
    exec(client: Client, interaction: AutocompleteInteraction): void,
}

/**
 * Type pour les Contexte menu en message (interactions)
 */
export type MessageContextMenuInteraction = {
    name: string,
    type: "MESSAGE_CONTEXTMENU",
    exec(client: Client, interaction: MessageContextMenuCommandInteraction): void,
}

/**
 * Type pour les contexte menu d'un utilisateur (interactions)
 */
export type UserContextMenuInteraction = {
    name: string,
    type: "USER_CONTEXTMENU",
    exec(client: Client, interaction: UserContextMenuCommandInteraction): void,
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
    exec(client: Client, commands?: CommandsList | undefined): void,
};


// SECTION COULEUR SHELL
/**
 * Liste des couleurs possible
 */
enum Colors {
    "Black", "Red", "Green", "Yellow", "Blue", "Magenta", "Cyan", "White", "Gray"
}

/**
 * Type color pour mettre en paramètres
 */
type color = keyof typeof Colors;

/**
 * Cette fonction permet de modifier la couleur d'un texte pour la console.
 * @param input Le texte à colorier
 * @param color La couleur désirer
 * @returns Renvoi le texte avec la couleur.
 * @example
 * ```js
 * console.log(makeFontColor("Je suis un beau text", "Red"));
 * // Affichera le texte en rouge
 * ```
 */
export function makeFontColor(input: string, color: color): string {
    // liste des couleur pour le shell
    const couleurs = ["\x1b[30m", "\x1b[31m", "\x1b[32m", "\x1b[33m", "\x1b[34m", "\x1b[35m", "\x1b[36m", "\x1b[37m", "\x1b[90m"]
    return `${couleurs[Colors[color]]}${input}\x1b[0m`
}

/**
 * Cette fonction permet d'ajouter un fond de couleur à un texte pour la console.
 * @param input Le texte sur le quel ajouter un fond de couleur
 * @param color La couleur de fond
 * @returns Texte avec la couleur de fond désiré
 * @example
 * ```js
 * console.log(makeBackgroundColor("Je suis un beau texte", "Red"));
 * // Affichera le texte avec un fond rouge
 * ```
 */
export function makeBackgroundColor(input: string, color: color): string {
    // liste des couleur pour le shell
    const couleurs = ["\x1b[40m", "\x1b[41m", "\x1b[42m", "\x1b[43m", "\x1b[44m", "\x1b[45m", "\x1b[46m", "\x1b[47m", "\x1b[100m"]
    return `${couleurs[Colors[color]]}${input}\x1b[0m`
}