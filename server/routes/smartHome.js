import express from "express";
import { getSensorData } from '../controllers/smartHomeController.js';

const router = express.Router();

router.get("/sensor-data", getSensorData);

export default router;