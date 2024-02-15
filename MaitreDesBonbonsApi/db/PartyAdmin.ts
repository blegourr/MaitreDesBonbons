import mongoose, { Schema, Document } from 'mongoose';

interface File {
    fileName: string;
    filePath: string;
    fileUrl: string;
    fileExtension: string;
}

interface DomainToIpMap {
    [key: string]: string;
}

interface Zero {
    ip: {
        ip: string;
        domaine: string;
        domaineToIp: DomainToIpMap;
    };
    mdpOfsession: {
        mdp: string;
        directoryListing: string;
        file: File[];
    };
    userOfSession: {
        SQLInjection: string;
    };
    fileOnSession: {
        access: boolean;
        file: File[];
    };
    ddos: {
        inProgress: boolean;
    };
    mitm: {
        inProgress: boolean;
        token: string;
    };
    metadata: {
        mdp: string;
    };
    coordinate: {
        finish: boolean;
        coordinate: string;
    };
}

interface Players {
    maitreBonBon: {};
    agentFbi: {};
    zero: Zero;
}

interface PartyAdmin extends Document {
    partyID: string;
    players: Players;
}

const domainToIpMapSchema: Schema = new Schema({
    type: Map,
    of: { type: String }
});

const fileSchema: Schema = new Schema({
    fileName: String,
    filePath: String,
    fileUrl: String,
    fileExtension: String
});

const zeroSchema: Schema = new Schema({
    ip: {
        ip: String,
        domaine: String,
        domaineToIp: domainToIpMapSchema
    },
    mdpOfsession: {
        mdp: String,
        directoryListing: { type: String, default: '/wp-content/uploads' },
        file: [fileSchema]
    },
    userOfSession: {
        SQLInjection: { type: String, default: `" OR 1 = 1 -- -` }
    },
    fileOnSession: {
        access: { type: Boolean, default: false },
        file: [fileSchema]
    },
    ddos: {
        inProgress: { type: Boolean, default: false }
    },
    mitm: {
        inProgress: { type: Boolean, default: false },
        token: String
    },
    metadata: {
        mdp: String
    },
    coordinate: {
        finish: { type: Boolean, default: false },
        coordinate: String
    }
});

const partyAdminSchema: Schema = new Schema({
    partyID: String,
    players: {
        maitreBonBon: {},
        agentFbi: {},
        zero: zeroSchema
    }
});

export default mongoose.model<PartyAdmin>('PartyAdmin', partyAdminSchema);
