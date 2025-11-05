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
                FROM cat_distrito
                where id <> 34;`);

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
    const { id_distrito } = req.query;

    if (!id_distrito) {
      return res.status(400).json({ message: "Datos requeridos" });
    }

    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('id_distrito', sql.Int, id_distrito)
      .query(`SELECT 
                    id,
                    barrio,
                    clave_ut,
                    distrito_local,
                    demarcacion_territorial
                FROM cat_barrios
                where distrito_local = @id_distrito;`);

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

    const { id_distrito } = req.query;

    if (!id_distrito) {
      return res.status(400).json({ message: "Datos requeridos" });
    }

    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('id_distrito', sql.Int, id_distrito)
      .query(`SELECT 
                    id,
                    pueblo,
                    clave_ut,
                    distrito_local,
                    demarcacion_territorial
                FROM cat_pueblos
                where distrito_local = @id_distrito;`);

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

    const { id_distrito } = req.query;

    if (!id_distrito) {
      return res.status(400).json({ message: "Datos requeridos" });
    }

    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('id_distrito', sql.Int, id_distrito)
      .query(`SELECT 
                    id,
                    pueblo_originario,
                    clave_ut,
                    distrito_local,
                    demarcacion_territorial
                FROM cat_pueblos_originarios
                where distrito_local =@id_distrito ;`);

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
    const { id_distrito } = req.query;

    if (!id_distrito) {
      return res.status(400).json({ message: "Datos requeridos" });
    }
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('id_distrito', sql.Int, id_distrito)
      .query(`SELECT 
                    id,
                    clave_ut,
                    ut,
                    distrito,
                    tipo_ut,
                    demarcacion_territorial
                FROM unidad_territorial
                where distrito =@id_distrito;`);

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
    const { id_distrito } = req.query;

    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('id_distrito', sql.Int, id_distrito)
      .query(`select DISTINCT dd.demarcacion_territorial as dt, 
                dd.demarcacion_territorial as id,
                dt.demarcacion_territorial  
                from distritos_demarcaciones dd 
                join demarcacion_territorial dt on dt.id = dd.demarcacion_territorial
              WHERE dt.id <>1 ${id_distrito ? ' AND dd.distrito = @id_distrito' : ''}`);

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

router.get("/getCabezera", Midleware.verifyToken, async (req, res) => {
  try {

    const { id_distrito, demarcacion } = req.query;

    if (!id_distrito || !demarcacion) {
      return res.status(400).json({ message: "Datos requeridos" });
    }

    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('id_distrito', sql.Int, id_distrito)
      .input('demarcacion', sql.Int, demarcacion)
      .query(`select distrito_cabecera 
               from distritos_demarcaciones
               where distrito = @id_distrito and demarcacion_territorial = @demarcacion;`);

    if (result.recordset.length > 0) {
      return res.status(200).json({
        getCabezera: result.recordset
      });
    } else {
      return res.status(404).json({ message: "No se encontraron registros", code: 100 })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});

//funcion para validar si es una cabecera
router.get("/getcabecera", Midleware.verifyToken, async (req, res) => {
  try {

    const { id_distrito } = req.query;

    if (!id_distrito) {
      return res.status(400).json({ message: "Datos requeridos" });
    }

    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('id_distrito', sql.Int, id_distrito)
      .query(`select distrito_cabecera 
               from distritos_demarcaciones
               where distrito_cabecera = @id_distrito;`);

    if (result.recordset.length > 0) {
      return res.status(200).json({
        cabecera: true
      });
    } else {
      return res.status(200).json({ message: "No se encontraron registros", cabecera:false })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});


router.get("/distritoElectoral", Midleware.verifyToken, async (req, res) => {
  try {
    const { idSeccion } = req.query;

    if (!idSeccion) {
      return res.status(400).json({ message: "Datos requeridos" });
    }

    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('idSeccion', sql.VarChar, idSeccion)
      .query(`select 
                distrito_electoral 
                from cat_secciones
                where seccion_electoral = @idSeccion;`);

    if (result.recordset.length > 0) {
      return res.status(200).json(result.recordset);

    } else {
      return res.status(404).json({ message: "No se encontraron datos" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});


export default router;