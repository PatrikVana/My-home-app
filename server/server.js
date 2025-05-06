import express from "express";
import { connectDB } from "./config/dbConection.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Inicializace Express
const app = express();

// Port aplikace
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todo.js";
import noteRoutes from './routes/note.js';
import taskGroupRoutes from "./routes/taskGroups.js";
import noteGroupRoutes from './routes/noteGroups.js';
import adminRoutes from "./routes/admin.js";
import smartHomeRoutes from "./routes/smartHome.js"; 

// Nastavení cest API
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use('/api/notes', noteRoutes);
app.use("/api/taskGroups", taskGroupRoutes);
app.use("/api/noteGroups", noteGroupRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/smart-home", smartHomeRoutes); 


connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Logování dostupných rout
app._router.stack
  .filter((r) => r.route)
  .forEach((r) => console.log("Načtená route:", r.route.path));
