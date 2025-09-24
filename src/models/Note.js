import mongoose from "mongoose";
import generateUniqueId from 'generate-unique-id'

const NoteSchema = new mongoose.Schema({
     _id: { type: String, default: generateUniqueId() },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  content: { type: String, default: "" },
  
  embedding: { type: [Number], default: [] }
}, { timestamps: true });

NoteSchema.pre('save', function (next) {
    const now = new Date();
   if (!this._id) {
        this._id = generateUniqueId();
    }
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});
NoteSchema.index({ title: "text", content: "text" });

export default mongoose.model("Note", NoteSchema);
