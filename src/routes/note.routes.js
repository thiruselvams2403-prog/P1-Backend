import express from "express";
import auth from "../middleware/auth.js";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  searchNotes
} from "../controllers/noteController.js";

const router = express.Router();

router.use(auth); 

router.post("/", createNote);             
router.get("/", getNotes);                
router.put("/:id", updateNote);           
router.delete("/:id", deleteNote);        

router.get("/search", searchNotes);

export default router;
