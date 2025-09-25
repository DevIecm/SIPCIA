import { connectToDatabase, sql } from "../../Config/Configuracion.js";
import Midleware from "../../Config/Midleware.js";
import express from 'express';
import dotenv from 'dotenv';
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/download/:filename", Midleware.verifyToken , async(req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/kml", filename);

  if (!fs.existsSync(filePath)) {
    console.error("Archivo no encontrado:", filePath);
    return res.status(404).json({ message: "Archivo no encontrado" });
  }

  let nombreOriginal = filename;
  const guionIndex = filename.indexOf("-");
  if (guionIndex > -1) {
    nombreOriginal = filename.substring(guionIndex + 1);
  }

  res.download(filePath, nombreOriginal, (err) => {
    if (err) {
      console.error("Error al descargar:", err);
      res.status(500).json({ message: "Error al descargar archivo" });
    }
  });
});

//normativa descarga 
router.get("/downloadNorma/:filename", Midleware.verifyToken , async(req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/pdf", filename);

  if (!fs.existsSync(filePath)) {
    console.error("Archivo no encontrado:", filePath);
    return res.status(404).json({ message: "Archivo no encontrado" });
  }

  let nombreOriginal = filename;
  const guionIndex = filename.indexOf("-");
  if (guionIndex > -1) {
    nombreOriginal = filename.substring(guionIndex + 1);
  }

  res.download(filePath, nombreOriginal, (err) => {
    if (err) {
      console.error("Error al descargar:", err);
      res.status(500).json({ message: "Error al descargar archivo" });
    }
  });
});

export default router;
