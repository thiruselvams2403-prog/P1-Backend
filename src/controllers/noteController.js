import Note from "../models/Note.js";
import { getEmbedding, cosineSimilarity } from "../utils/embeddings.js";


export const createNote = async (req, res) => {
  try {
    const { title, content, embed } = req.body;
    const userId = req.user._id;

    const note = new Note({ userId, title, content });

    if (embed) {
      const text = `${title}\n\n${content}`;
      note.embedding = await getEmbedding(text);
    }

    await note.save();
    res.status(201).json(note);
  } catch (err) {
        console.error("createNote:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("getNotes:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, embed } = req.body;

    const note = await Note.findOne({ _id: id, userId: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.title = title ?? note.title;
    note.content = content ?? note.content;

    if (embed) {
      const text = `${note.title}\n\n${note.content}`;
      note.embedding = await getEmbedding(text);
    }

    await note.save();
    res.json(note);
  } catch (err) {
    console.error("updateNote:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteNote:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    const query = req.query.query ?? req.body.query;
    const mode = (req.query.mode || "keyword").toLowerCase();

    if (!query) return res.status(400).json({ message: "Query is required" });

    if (mode === "keyword") {
      // MongoDB text search
      // Note: for text score, you need to select score meta field
      const results = await Note.find(
        { $text: { $search: query }, userId },
        { score: { $meta: "textScore" }, title: 1, content: 1, updatedAt: 1 }
      ).sort({ score: { $meta: "textScore" } });

      return res.json({ mode: "keyword", results });
    } else if (mode === "semantic") {
     
      const qEmbedding = await getEmbedding(query);

      
      const notes = await Note.find({ userId, embedding: { $exists: true, $ne: [] } }).select(
        "title content embedding updatedAt"
      );

      const scored = notes.map((n) => {
        const score = cosineSimilarity(qEmbedding, n.embedding);
        return { note: n, score };
      });

      scored.sort((a, b) => b.score - a.score);

      return res.json({ mode: "semantic", results: scored.slice(0, 50) });
    } else {
      return res.status(400).json({ message: "Invalid mode. Use 'keyword' or 'semantic'" });
    }
  } catch (err) {
    console.error("searchNotes:", err);
    res.status(500).json({ message: "Server error" });
  }
};
