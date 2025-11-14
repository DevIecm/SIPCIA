import { connectToDatabase, sql } from '../Config/Configuracion.js';
import Midleware from '../Config/Midleware.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

//Directorio
router.get("/comunidades", Midleware.verifyToken, async (req, res) => {
  try {
    const { tipo_comunidad, id_distrito, tipo_usuario } = req.query;


    if (!tipo_comunidad) {
      return res.status(400).json({ message: "Datos requeridos" })
    }

    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('tipo_comunidad', sql.Int, tipo_comunidad)
      .input('id_distrito', sql.Int, id_distrito)
      .input('tipo_usuario', sql.Int, tipo_usuario)
      .query(`SELECT 
                    r.id as id_registro,
                    r.folio,
                    dt.demarcacion_territorial,
                    r.nombre_completo ,
                    cpo.pueblo_originario,
                    cp.pueblo,
                    cb.barrio,  
	                CASE 
	                	when c.id = 1  then r.comunidad_pbl 
	                	else r.comunidad_afro
	                END as comunidad,
 	                CASE 
	                	when ut.ut is null then r.otro_pbl 
	                	else ut.ut
	                END as unidad_territorial,                   
                    r.comunidad_pbl,
                    r.nombre_instancia,
                    r.cargo_instancia,
                    r.domicilio,
                    r.pueblo_afro,
                    r.organizacion_afro,
                    r.persona_relevante_afro,
                    r.otro_afro,
                    r.comunidad_afro
                    from registro as r
                    join demarcacion_territorial as dt on r.demarcacion = dt.id
                    join comunidad as c on r.comunidad = c.id
                    left join cat_pueblos_originarios as cpo on r.pueblo_originario = cpo.id
                    left join cat_pueblos as cp on r.pueblo_pbl = cp.id
                    left join cat_barrios as cb on r.barrio_pbl = cb.id
                    left join unidad_territorial as ut on r.unidad_territorial_pbl = ut.id
                WHERE 
                (c.id = @tipo_comunidad${id_distrito ? ' AND r.distrito_electoral = @id_distrito' : ''} and r.modulo_registro = @tipo_usuario and r.estado_registro<>4);`);

    if (result.recordset.length > 0) {
      return res.status(200).json({
        comunidades: result.recordset
      });
    } else {
      return res.status(200).json({ message: "No se encontraron datos de tipo", comunidades:[] });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});

export default router;