import mongoose, { Schema, Document } from 'mongoose';

interface User extends Document {
    userId: string;
    name: string;
    avatar: string;
    // socketEmitUser: string;
}

const userSchema: Schema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    // socketEmitUser: { type: String, required: false }
});

export default mongoose.model<User>('User', userSchema);
