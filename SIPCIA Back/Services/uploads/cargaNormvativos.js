import { connectToDatabase, sql } from "../../Config/Configuracion.js";
import Midleware from "../../Config/Midleware.js";
import express from 'express';
import dotenv from 'dotenv';
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { json } from "stream/consumers";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/zip");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/zip" || file.mimetype === "application/x-zip-compressed") {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos .zip"));
    }
  }
});

// guardar documentos .zip
router.post("/subirDocumentoNormativo", Midleware.verifyToken, upload.single("archivoZip"), async (req, res) => {
  const { distrito, tipo_comunidad, estado_documento, tipo_documento } = req.body;


  if (!distrito || !tipo_comunidad || !estado_documento || !tipo_documento) {
    const faltantes = [];

    if (!distrito) faltantes.push("distrito");
    if (!tipo_comunidad) faltantes.push("tipo_comunidad");
    if (!estado_documento) faltantes.push("estado_documento");
    if (!tipo_documento) faltantes.push("tipo_documento");

    return res.status(400).json({
      message: "Faltan datos requeridos",
      faltantes,
    });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No se subió ningún archivo" });
  }

  const nombreDocumento = req.file.originalname;
  const rutaDocumento = `/uploads/zip/${req.file.filename}`;

  // Fecha y hora
  const now = new Date();
  const offsetInMs = now.getTimezoneOffset() * 60000;
  const fechaLocal = new Date(now.getTime() - offsetInMs);
  const horaActual = now.toTimeString().split(' ')[0];

  const pool = await connectToDatabase();
  const transaction = pool.transaction();

  try {
    await transaction.begin();

    const request = transaction.request();
    await request
      .input('distrito', sql.Int, distrito)
      .input('nombre_documento', sql.VarChar, nombreDocumento)
      .input('direccion_documento', sql.VarChar, rutaDocumento)
      .input('tipo_comunidad', sql.Int, tipo_comunidad)
      .input('fecha_carga', sql.Date, fechaLocal)
      .input('hora_carga', sql.VarChar, horaActual)
      .input('estado_documento', sql.Int, estado_documento)
      .input('tipo_documento', sql.Int, tipo_documento)
      .query(`
        INSERT INTO documentos_normativos 
          (distrito, nombre_documento, direccion_documento, tipo_comunidad, fecha_carga, hora_carga, estado_documento, tipo_documento)
        VALUES
          (@distrito, @nombre_documento, @direccion_documento, @tipo_comunidad, @fecha_carga, @hora_carga, @estado_documento, @tipo_documento)
      `);

    const idResult = await request.query("SELECT SCOPE_IDENTITY() AS id");
    const insertedId = idResult.recordset[0].id;

    await transaction.commit();

    return res.status(200).json({
      message: "Documento guardado correctamente",
      id: insertedId,
      ruta: rutaDocumento
    });

  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: "Error al guardar documento" });
  }
});

//getNormativos front
router.get("/getOtrosDocumentos", Midleware.verifyToken, async (req, res) => {
  const {
    distrito_electoral, tipo_comunidad
  } = req.query

  if (!distrito_electoral || !tipo_comunidad) {
    return res.status(400).json({ message: "Datos requeridos" })
  }

  try {

    const pool = await connectToDatabase();
    const result = await pool.request()

      .input('distrito_electoral', sql.Int, distrito_electoral)
      .input('tipo_comunidad', sql.Int, tipo_comunidad)
      .query(`select nombre_documento, 
                fecha_carga, 
                direccion_documento, 
                RIGHT('0' + CAST(
                    CASE 
                        WHEN DATEPART(HOUR, hora_carga) % 12 = 0 THEN 12 
                        ELSE DATEPART(HOUR, hora_carga) % 12 
                    END AS VARCHAR), 2) 
                + ':' + RIGHT('0' + CAST(DATEPART(MINUTE, hora_carga) AS VARCHAR), 2) 
                + ' ' + CASE WHEN DATEPART(HOUR, hora_carga) >= 12 THEN 'PM' ELSE 'AM' END 
                AS hora_carga
                from documentos_normativos
                WHERE distrito = @distrito_electoral and tipo_comunidad= @tipo_comunidad and estado_documento<>4;`);

    if (result.recordset.length > 0) {

      const data = result.recordset.map(item => {
        const nombreArchivo = item.direccion_documento
          ? path.basename(item.direccion_documento)
          : null;

        const guionIndex = nombreArchivo?.indexOf("-");
        const nombreLimpio = guionIndex > -1
          ? nombreArchivo.substring(guionIndex + 1)
          : nombreArchivo;

        return {
          ...item,
          direccion_documento: nombreArchivo,
          nombre_documento: nombreLimpio
        };
      });

      return res.status(200).json({
        getOtrosDocumentos: data,
        code: 200
      });
    } else {
      return res.status(404).json({ message: "No se encontraron datos" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});


/// elimiacion logica de documentos normativos
router.patch("/eliminarDocNormativos", Midleware.verifyToken, async (req, res) => {
  const { id } = req.body;

  if (id == null) {
    return res.status(400).json({ message: "El campo id es requerido" });
  }

  let transaction;

  try {
    const pool = await connectToDatabase();
    transaction = pool.transaction();
    await transaction.begin();

    // 1️⃣ Marcar como eliminado
    await transaction.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE documentos_normativos
        SET estado_documento = 4
        WHERE id = @id;
      `);

    // 2️⃣ Obtener la lista actualizada (los que no están eliminados)
    const result = await transaction.request()
      .query(`
        SELECT *
        FROM documentos_normativos
        WHERE estado_documento <> 4
        ORDER BY id DESC;
      `);

    await transaction.commit();

    if (result.recordset.length > 0) {
      return res.status(200).json({
        message: "Registro eliminado correctamente",
        code: 200,
        documentos: result.recordset
      });
    } else {
      return res.status(200).json({
        message: "Registro eliminado, no quedan documentos activos",
        code: 200,
        documentos: []
      });
    }

  } catch (err) {
    console.error("Error en eliminarDocNormativos:", err);
    if (transaction) await transaction.rollback();
    return res.status(500).json({
      message: "Error al eliminar el registro",
      error: err.message
    });
  }
});


// consulta de docuemtos normativos modulo 2
router.get("/getDocumentos", Midleware.verifyToken, async (req, res) => {
  const { distrito, tipo_comunidad, tipo_documento } = req.query;

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('tipo_comunidad', sql.Int, tipo_comunidad)
      .input('distrito', sql.Int, distrito)
      .input('tipo_documento', sql.Int, tipo_documento)
      .query(`
        SELECT id, nombre_documento, fecha_carga, tipo_documento, direccion_documento
        FROM documentos_normativos
        WHERE tipo_documento = @tipo_documento
          ${distrito ? 'AND distrito = @distrito' : ''}
          AND estado_documento <> 4
          AND tipo_comunidad = @tipo_comunidad;
      `);

    const data = result.recordset.map(item => {
      const nombreArchivo = item.direccion_documento
        ? path.basename(item.direccion_documento)
        : null;

      const guionIndex = nombreArchivo?.indexOf("-");
      const nombreLimpio = guionIndex > -1
        ? nombreArchivo.substring(guionIndex + 1)
        : nombreArchivo;

      return {
        ...item,
        direccion_documento: nombreArchivo,
        nombre_documento: nombreLimpio
      };
    });

    return res.status(200).json({
      getDocumentos: data,
      code: 200
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error de servidor",
      error: error.message
    });
  }
});


export default router;
