import { Event_CM } from "../utils";

export default {
    name: "Ready",
    once: false,
    exec: (client) => {
        console.log(`[SYSTEM] - Bot connecté`);
        console.log(`[SYSTEM] - Conecté en tant que: ${client.user?.username}`);
    }
} as Event_CM;