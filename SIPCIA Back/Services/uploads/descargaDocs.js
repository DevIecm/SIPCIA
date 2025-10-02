import Midleware from "../../Config/Midleware.js";
import express from 'express';
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/download/:filename", Midleware.verifyToken, async (req, res) => {
  try {
    // agrgar espacios y caracteres especiales al nombre del documento
    const filename = decodeURIComponent(req.params.filename);

    const filePath = path.join(__dirname, "../uploads/kml", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    // Mostrar nombre original
    let nombreOriginal = filename;
    const guionIndex = filename.indexOf("-");
    if (guionIndex > -1) {
      nombreOriginal = filename.substring(guionIndex + 1);
    }

    res.download(filePath, nombreOriginal, (err) => {
      if (err) {
        console.error("Error al descargar:", err);
        if (!res.headersSent) {
          res.status(500).json({ message: "Error al descargar archivo" });
        }
      }
    });
  } catch (error) {
    console.error("Error en descarga:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
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


//normativa descarga 
router.get("/downloadOtrosNorma/:filename", Midleware.verifyToken, async (req, res) => {
  try {
    // decodificamos por si trae espacios o caracteres especiales
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(__dirname, "../uploads/zip", filename);

    if (!fs.existsSync(filePath)) {
      console.error("Archivo no encontrado:", filePath);
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    // mostrar solo el nombre limpio (sin prefijo numérico)
    let nombreOriginal = filename;
    const guionIndex = filename.indexOf("-");
    if (guionIndex > -1) {
      nombreOriginal = filename.substring(guionIndex + 1);
    }

    res.download(filePath, nombreOriginal, (err) => {
      if (err) {
        console.error("Error al descargar:", err);
        if (!res.headersSent) {
          res.status(500).json({ message: "Error al descargar archivo" });
        }
      }
    });
  } catch (error) {
    console.error("Error en descarga:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});


export default router;
