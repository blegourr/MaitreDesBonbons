import mongoose, { Schema, Document } from 'mongoose';

interface User {
    userId: string;
    socketEmitUser: string;
    avatar: string;
    name: string;
}

interface Pool extends Document {
    poolID: string;
    users: Map<string, User>;
}

const poolSchema: Schema = new Schema({
    poolID: String,
    users: {
        type: Map,
        of: {
            userId: String,
            socketEmitUser: String,
            avatar: String,
            name: String,
        },
    },
});

export default mongoose.model<Pool>('Pool', poolSchema);
