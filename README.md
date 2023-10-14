# CANDY MASTER (BOT)
## Sommaire
- [Dependances](#dependances)
- [Config](#config)
- [Interaction](#interactions)

## Dependances
```
- Discord.js
- Dotenv
- TypeScript
- TS-Node
```

## Config
> .env

`/config/.env`

```env
DISCORD_TOKEN=" Token du bot Discord "
```
Il y a besoin d'un fichier `.env` dans le dossier `config` avec des variable globale pour pouvoir faire fonctionner le programme.

> config.json

`/src/config.json`
```json
{
    "client": {
        "intents": []
    },
    "dev": {
        "is_dev": false,
        "push_commands": false,
        "dev_server": "DEV_DISCORD_SERVER_ID"
    },
    "server": {
        "ws": {
            "protocol": "WS_PROTOCOL",
            "domain": "WS_DOMAIN"
        },
        "rest": {
            
        }
    }
}
```
`client.intents` - contient tous les [intents Discord](https://discord-api-types.dev/api/discord-api-types-v10/enum/GatewayIntentBits) que votre bot a besoin.

`dev.push_commands` - push les commandes slash si le paramètre est mis en **true**

`dev.is_dev` - push les commandes slash dans le serveur ( *dev.dev_server* ) si le paramètre est mis en **true**, sinon les slash commandes sont push en global si les paramètres est mis en **false**.

`server.ws.protocol` - protocole du websocker.

`server.ws.domain` - domaine du websocket.

## Interactions
`/src/interactions/<commandName>.ts`
```js
import { <type> } from "../types";

export default {
    name: "<nom de la commande>",
    type: "<type de commande>",
    exec: (client, interaction) => {
        
    }
} as <type>;
```
Création d'une interaction.
Remplacer \<type> par:
- `ChatCommandInteraction` - **Slash commande**
- `BoutonInteraction` - **Bouton**
- `SelectMenuInteraction` - **Select Menu**
- `ModalsInteraction` - **Modals**
- `AutoCompleteInteraction` - **Saisie automatique**
- `MessageContextMenuInteraction` - **Contexte Menu (Message)**
- `UserContextMenuInteraction` - **Contexte Menu (Utilisateur)**

