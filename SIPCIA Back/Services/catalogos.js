import { connectToDatabase, sql } from '../Config/Configuracion.js';
import Midleware from '../Config/Midleware.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

//catalogo distritos
router.get("/cat_distrito", Midleware.verifyToken, async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
        .query(`SELECT 
                    id,
                    direccion_distrital,
                    domicilio,
                    titular,
                    secretario                     
                FROM cat_distrito;`);

    if (result.recordset.length > 0) {
      return res.status(200).json({
        cat_distrito: result.recordset
      });
    } else {
      return res.status(404).json({ message: "No se encontraron datos de tipo" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});

//catalogo barrios
router.get("/cat_barrios", Midleware.verifyToken, async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
        .query(`SELECT 
                    id,
                    barrio,
                    clave_ut,
                    distrito_local,
                    demarcacion_territorial
                FROM cat_barrios;`);

    if (result.recordset.length > 0) {
      return res.status(200).json({
        cat_barrios: result.recordset
      });
    } else {
      return res.status(404).json({ message: "No se encontraron datos de tipo" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});

//catalogo pueblos
router.get("/cat_pueblos", Midleware.verifyToken, async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
        .query(`SELECT 
                    id,
                    pueblo,
                    clave_ut,
                    distrito_local,
                    demarcacion_territorial
                FROM cat_pueblos;`);

    if (result.recordset.length > 0) {
      return res.status(200).json({
        cat_pueblos: result.recordset
      });
    } else {
      return res.status(404).json({ message: "No se encontraron datos de tipo" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});

//catalogo pueblos originarios
router.get("/cat_pueblos_originarios", Midleware.verifyToken, async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
        .query(`SELECT 
                    id,
                    pueblo_originario,
                    clave_ut,
                    distrito_local,
                    demarcacion_territorial
                FROM cat_pueblos_originarios;`);

    if (result.recordset.length > 0) {
      return res.status(200).json({
        cat_pueblos_originarios: result.recordset
      });
    } else {
      return res.status(404).json({ message: "No se encontraron datos de tipo" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});


//catalogo seccion
router.get("/cat_seccion", Midleware.verifyToken, async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
        .query(`SELECT 
                    seccion_electoral,
                    demarcacion_territorial,
                    distrito_local
                FROM cat_seccion;`);

    if (result.recordset.length > 0) {
      return res.status(200).json({
        cat_seccion: result.recordset
      });
    } else {
      return res.status(404).json({ message: "No se encontraron datos de tipo" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});


//catalogo unidad territorial
router.get("/cat_unidad_territorial", Midleware.verifyToken, async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
        .query(`SELECT 
                    id,
                    clave_ut,
                    ut,
                    distrito,
                    tipo_ut,
                    demarcacion_territorial
                FROM unidad_territorial;`);

    if (result.recordset.length > 0) {
      return res.status(200).json({
        cat_unidad_territorial: result.recordset
      });
    } else {
      return res.status(404).json({ message: "No se encontraron datos de tipo" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});

//revisar si comunidad tambien es un catalogo pendiente por preguntar
router.get("/cat_comunidad", Midleware.verifyToken, async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
        .query(`SELECT 
                    id,
                    comunidad
                FROM comunidad;`);

    if (result.recordset.length > 0) {
      return res.status(200).json({
        cat_comunidad: result.recordset
      });
    } else {
      return res.status(404).json({ message: "No se encontraron datos de tipo" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});


//catalogo Demacracion
router.get("/cat_demarcacion_territorial", Midleware.verifyToken, async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
        .query(`SELECT 
                    id,
                    demarcacion_territorial,
                    clave_dt
                FROM demarcacion_territorial
                where status = 1;`);

    if (result.recordset.length > 0) {
      return res.status(200).json({
        cat_demarcacion_territorial: result.recordset
      });
    } else {
      return res.status(404).json({ message: "No se encontraron datos de tipo" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});


// nuevos catalogos
// catalogo Numero de reporte
router.get("/cat_numero_reporte", Midleware.verifyToken, async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
        .query(`SELECT 
                    id,
                    numero_reporte
                FROM cat_numero_reporte`);

    if (result.recordset.length > 0) {
      return res.status(200).json({
        cat_numero_reporte: result.recordset
      });
    } else {
      return res.status(404).json({ message: "No se encontraron datos de tipo" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});


// catalogo Fecha y periodo
router.get("/cat_fecha_periodo", Midleware.verifyToken, async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
        .query(`SELECT 
                    id,
                    numero_reporte
                FROM cat_fecha_periodo`);

    if (result.recordset.length > 0) {
      return res.status(200).json({
        cat_fecha_periodo: result.recordset
      });
    } else {
      return res.status(404).json({ message: "No se encontraron datos de tipo" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});



//Catalogo  cat_lenguas_indigenas
router.get("/cat_lenguas_indigenas", Midleware.verifyToken, async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
        .query(`SELECT 
                    id,
                    lengua_indigena
                FROM cat_lenguas_indigenas`);

    if (result.recordset.length > 0) {
      return res.status(200).json({
        cat_lenguas_indigenas: result.recordset
      });
    } else {
      return res.status(404).json({ message: "No se encontraron datos de tipo" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});


export default router;