import { Event_CM } from "../types";

export default {
    name: "ready",
    once: false,
    exec: (discord) => {
        console.log(`[SYSTEM] - Bot connecté`);
        console.log(`[SYSTEM] - Conecté en tant que: ${discord.user?.username}`);
    }
} as Event_CM;