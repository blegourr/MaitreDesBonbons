import mongoose, { Schema, Document } from 'mongoose';

// Créez une interface pour décrire les valeurs par défaut de chaque sous-schéma
interface DefaultValues {
    [key: string]: any;
}

// Définissez les valeurs par défaut pour chaque sous-schéma
const defaultValues: DefaultValues = {
    players: { playersID: '' },
    zero: { DDOS: false, metadata: false, MITM: false, urlFailShearch: false },
};

// Générez les fonctions par défaut à partir des valeurs par défaut du schéma
const generateDefaultFunctions = (values: DefaultValues) => {
    const defaultFunctions: { [key: string]: Function } = {};
    for (const key in values) {
        defaultFunctions[`getDefault${key.charAt(0).toUpperCase() + key.slice(1)}`] = () => values[key];
    }
    return defaultFunctions;
};

// Générez les fonctions par défaut
const defaultFunctions = generateDefaultFunctions(defaultValues);

// Déstructurez les fonctions par défaut pour une utilisation facile
const { getDefaultPlayers, getDefaultZero } = defaultFunctions;


interface Players {
    playersID: string;
}

interface ZeroSoftware {
    DDOS: boolean;
    metadata: boolean;
    MITM: boolean;
    urlFailShearch: boolean;
}

interface Party extends Document {
    partyID: string;
    players: {
        maitreBonBon: Players;
        agentFbi: Players;
        zero: Players;
    };
    software: {
        zero: ZeroSoftware;
    };
    attackNow: any[]; // Remplacer 'any[]' par le type approprié une fois dev
    settings: {
        start: boolean;
    };
    aide: {
        zero: any; // Remplacer 'any' par le type approprié une fois dev
        maitreBonBon: any;
        agentFbi: any;
    };
}

const playersSchema: Schema = new Schema({
    playersID: { type: String, default: '' },
});

const zeroSoftwareSchema: Schema = new Schema({
    DDOS: { type: Boolean, default: false },
    metadata: { type: Boolean, default: false },
    MITM: { type: Boolean, default: false },
    urlFailShearch: { type: Boolean, default: false },
});

const partySchema: Schema = new Schema({
    partyID: { type: String },
    players: {
        maitreBonBon: { type: playersSchema, default: getDefaultPlayers },
        agentFbi: { type: playersSchema, default: getDefaultPlayers },
        zero: { type: playersSchema, default: getDefaultPlayers },
    },
    software: {
        zero: { type: zeroSoftwareSchema, default: getDefaultZero },
    },
    attackNow: { type: Array, default: [] },
    settings: {
        start: { type: Boolean, default: false },
    },
    aide: {
        zero: { type: Object, default: getDefaultPlayers },
        maitreBonBon: { type: Object, default: getDefaultPlayers },
        agentFbi: { type: Object, default: getDefaultPlayers },
    },
});



export default mongoose.model<Party>('Party', partySchema);
