import mongoose from 'mongoose';
import generateUniqueId from 'generate-unique-id'

const UserSchema = new mongoose.Schema({
    _id: { type: String, default: generateUniqueId() },
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    const now = new Date();
    if (!this._id) {
        this._id = generateUniqueId();
    }
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
     next();
})


export default mongoose.model('User', UserSchema);
