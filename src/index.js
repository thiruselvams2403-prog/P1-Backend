import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.routes.js";
import noteRoutes from "./routes/note.routes.js";
import connectDB from "../config/db.js";
import fs from 'fs'; import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));


// Swagger Docs 
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const swaggerDoc = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/swagger.json')));


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Routes
app.get("/", (req, res) => res.send("MERN Notes Backend is running"));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
