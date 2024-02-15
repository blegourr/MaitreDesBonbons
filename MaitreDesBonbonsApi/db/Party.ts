import mongoose, { Schema, Document } from 'mongoose';

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
        maitreBonBon: playersSchema,
        agentFbi: playersSchema,
        zero: playersSchema,
    },
    software: {
        zero: zeroSoftwareSchema,
    },
    attackNow: [Schema.Types.Mixed], // Utilisation de Schema.Types.Mixed pour accepter tout type
    settings: {
        start: { type: Boolean, default: false },
    },
    aide: {
        zero: {},
        maitreBonBon: {},
        agentFbi: {},
    },
});

export default mongoose.model<Party>('Party', partySchema);
