import { connectToDatabase, sql } from '../Config/Configuracion.js';
import Midleware from '../Config/Midleware.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

//Bitacora by tipo de usuario
router.get("/bitacora", Midleware.verifyToken, async (req, res) => {
  try {
    const { id_registro } = req.query;

        if(!id_registro){
            return res.status(400).json({ message: "Datos requeridos"})
        }

    const pool = await connectToDatabase();
    const result = await pool.request()    
        .input('id_registro', sql.Int, id_registro)
        .query(`select 
                u.id as id_usuario,
                  u.nombre_usuario,
                lr.fecha,
                lr.hora,
                (SELECT
                  JSON_VALUE(lr.campos_modificados, '$.nombre_completo') AS nombre_completo,
                  JSON_VALUE(lr.campos_modificados, '$.seccion_electoral') AS seccion_electoral,
                  dm.demarcacion_territorial  AS demarcacion,
                  cd.direccion_distrital AS distrito_electoral,
                  c.comunidad as comunidad,
                  JSON_VALUE(lr.campos_modificados, '$.nombre_comunidad') AS nombre_comunidad,
                  cpo.pueblo_originario as pueblo_originario,
                  cp.pueblo as pueblo_pbl,
                  cb.barrio as barrio_pbl,
                  ut.ut as unidad_territorial_pbl,
                  JSON_VALUE(lr.campos_modificados, '$.comunidad_pbl') AS comunidad_pbl,
                  JSON_VALUE(lr.campos_modificados, '$.otro_pbl') AS otro_pbl,
                  JSON_VALUE(lr.campos_modificados, '$.pueblo_afro') AS pueblo_afro,
                  JSON_VALUE(lr.campos_modificados, '$.comunidad_afro') AS comunidad_afro,
                  JSON_VALUE(lr.campos_modificados, '$.organizacion_afro') AS organizacion_afro,
                  JSON_VALUE(lr.campos_modificados, '$.persona_relevante_afro') AS persona_relevante_afro,
                  JSON_VALUE(lr.campos_modificados, '$.otro_afro') AS otro_afro,
                  JSON_VALUE(lr.campos_modificados, '$.nombre_instancia') AS nombre_instancia,
                  JSON_VALUE(lr.campos_modificados, '$.cargo_instancia') AS cargo_instancia,
                  JSON_VALUE(lr.campos_modificados, '$.domicilio') AS domicilio,
                  JSON_VALUE(lr.campos_modificados, '$.telefono_particular') AS telefono_particular,
                  JSON_VALUE(lr.campos_modificados, '$.telefono_celular') AS telefono_celular,
                  JSON_VALUE(lr.campos_modificados, '$.correo_electronico_oficial') AS correo_electronico_oficial,
                  JSON_VALUE(lr.campos_modificados, '$.correo_electronico_personal') AS correo_electronico_personal,
                  JSON_VALUE(lr.campos_modificados, '$.documentos') AS documentos,
                  JSON_VALUE(lr.campos_modificados, '$.enlace_documentos') AS enlace_documentos,
                    tu.tipo_usuario as modulo_registro,
                    er.estado_registro as estado_registro
                  FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
                ) AS Datos
                from log_registro lr 
                join registro r on r.id = lr.registro_id 
                join usuarios as u on lr.usuario = u.id 
                LEFT JOIN 
                    demarcacion_territorial dm ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.demarcacion_territorial') AS INT) = dm.id
                LEFT JOIN 
                    cat_distrito cd ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.distrito_electoral') AS INT) = cd.id
                LEFT JOIN 
                    comunidad c ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.comunidad') AS INT) = c.id
                LEFT JOIN 
                    cat_pueblos_originarios cpo ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.pueblo_originario') AS INT) = cpo.id
                LEFT JOIN 
                    cat_pueblos cp ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.pueblo_pbl') AS INT) = cp.id
                LEFT JOIN 
                    cat_barrios cb ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.barrio_pbl') AS INT) = cb.id
                LEFT JOIN 
                    unidad_territorial ut ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.barrio_pbl') AS INT) = ut.id
                Left JOIN 
                    tipo_usuario tu ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.modulo_registro') AS INT) = tu.id
                Left JOIN 
                    estado_registro er ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.estado_registro') AS INT) = er.id
                where r.id =@id_registro
                order by lr.id, lr.fecha, lr.hora;`);

        if (result.recordset.length > 0) {
          const parsedResults = result.recordset.map(item => {
            try {
              return {
                ...item,
                Datos: JSON.parse(item.Datos)
              };
            } catch (error) {
              return item;
            }
          });

          return res.status(200).json({
            bitacora: parsedResults
          });
        } else {
          return res.status(404).json({ message: "No se encontraron datos de tipo" });
        }

    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});

//bitacora mayor afluencia

router.get("/getbitacoraAfluencia", Midleware.verifyToken, async(req, res)=>{

    const { id_registro } = req.query;

    if(!id_registro){
      return res.status(400).json( {message: "Datos requeridos"});
    }

    try{
      const pool = await connectToDatabase();
      const result = await pool.request()  
        .input('id_registro', sql.Int, id_registro)
        .query(`select 
                r.id as id_registro,
                u.id as id_usuario,
                u.nombre_usuario,
                lr.fecha,
                lr.hora,
                (SELECT 
                  cd.direccion_distrital AS distrito_electoral,
                  cd.direccion_distrital AS distrito_cabecera,
                  dm.demarcacion_territorial  AS demarcacion_territorial,
                  JSON_VALUE(lr.campos_modificados, '$.denominacion_lugar') AS denominacion_lugar,
                  JSON_VALUE(lr.campos_modificados, '$.domicilio_lugar') AS domicilio_lugar,
                  JSON_VALUE(lr.campos_modificados, '$.foto') AS foto,
                  JSON_VALUE(lr.campos_modificados, '$.enlace_foto') AS enlace_foto,
                  JSON_VALUE(lr.campos_modificados, '$.ubicacion') AS ubicacion,
                  JSON_VALUE(lr.campos_modificados, '$.enlace_ubicacion') AS enlace_ubicacion,
                  JSON_VALUE(lr.campos_modificados, '$.observaciones') AS observaciones,
                  u2.usuario as usuario_registro,
                    tu.tipo_usuario as modulo_registro,
                    er.estado_registro as estado_registro
                        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
                ) AS Datos
                from log_registro_afluencia lr 
                join registro_afluencia r on r.id = lr.registro_id
                join usuarios as u on lr.usuario = u.id
                LEFT JOIN 
                    cat_distrito cd ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.distrito_electoral') AS INT) = cd.id
                LEFT JOIN 
                    demarcacion_territorial dm ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.demarcacion_territorial') AS INT) = dm.id
                LEFT JOIN 
                    usuarios u2 ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.usuario_registro') AS INT) = u2.id
                Left JOIN 
                    tipo_usuario tu ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.modulo_registro') AS INT) = tu.id
                Left JOIN 
                    estado_registro er ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.estado_registro') AS INT) = er.id
                where r.id =@id_registro
                order by lr.id, lr.fecha, lr.hora;`);        


       if (result.recordset.length > 0) {
          const parsedResults = result.recordset.map(item => {
            try {
              return {
                ...item,
                Datos: JSON.parse(item.Datos)
              };
            } catch (error) {
              return item;
            }
          });

          return res.status(200).json({
            getbitacoraAfluencia: parsedResults
          });
        } else {
          return res.status(404).json({ message: "No se encontraron datos de tipo" });
        }

    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
  });


//bitacora registro instituciones
router.get("/getbitacoraInstituciones", Midleware.verifyToken, async(req, res)=>{

    const { id_registro } = req.query;

    if(!id_registro){
      return res.status(400).json( {message: "Datos requeridos"});
    }

    try{
        const pool = await connectToDatabase();
        const result = await pool.request()    
        .input('id_registro', sql.Int, id_registro)
        .query(`select 
                r.id as id_registro,
                u.id as id_usuario,
                u.nombre_usuario,
                lr.fecha,
                lr.hora,
                lr.campos_modificados as Datos
                from log_registro_instituciones lr 
                join registro_instituciones r on r.id = lr.registro_id
                join usuarios as u on lr.usuario = u.id
                where r.id =@id_registro
                order by lr.id, lr.fecha, lr.hora;`);        

        if (result.recordset.length > 0) {
          const parsedResults = result.recordset.map(item => {
            try {
              return {
                ...item,
                Datos: JSON.parse(item.Datos)
              };
            } catch (error) {
              return item;
            }
          });

          return res.status(200).json({
            getbitacoraInstituciones: parsedResults
          });
        } else {
          return res.status(404).json({ message: "No se encontraron datos de tipo" });
        }

    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
  });


//bitacora registro Lugares
router.get("/getbitacoraLugares", Midleware.verifyToken, async(req, res)=>{
    
    const { id_registro } = req.query;

    if(!id_registro){
      return res.status(400).json( {message: "Datos requeridos"});
    }

    
    try{
      const pool = await connectToDatabase();
      const result = await pool.request()
        .input('id_registro', sql.Int, id_registro)
        .query(`SELECT 
                r.id as id_registro,
                u.id as id_usuario,
                u.nombre_usuario,
                lr.fecha,
                lr.hora,
                  (
                      SELECT
                          cd.direccion_distrital AS distrito_electoral,
                          dm.demarcacion_territorial  AS demarcacion,
                          JSON_VALUE(lr.campos_modificados, '$.lugar_espacio') AS lugar_espacio,
                          JSON_VALUE(lr.campos_modificados, '$.domicilio') AS domicilio,
                          JSON_VALUE(lr.campos_modificados, '$.fotografia') AS fotografia,
                          JSON_VALUE(lr.campos_modificados, '$.enlace_fotografia') AS enlace_fotografia,
                          JSON_VALUE(lr.campos_modificados, '$.ubicacion_kml') AS ubicacion_kml,
                          JSON_VALUE(lr.campos_modificados, '$.enlace_ubicacion') AS enlace_ubicacion,
                          JSON_VALUE(lr.campos_modificados, '$.intitucion_propietaria') AS intitucion_propietaria,
                          JSON_VALUE(lr.campos_modificados, '$.prestamo_iecm') AS prestamo_iecm,
                          JSON_VALUE(lr.campos_modificados, '$.nuevo_prestamo') AS nuevo_prestamo,
                          JSON_VALUE(lr.campos_modificados, '$.superficie_espacio') AS superficie_espacio,
                          JSON_VALUE(lr.campos_modificados, '$.ventilacion') AS ventilacion,
                          JSON_VALUE(lr.campos_modificados, '$.observaciones') AS observaciones,
                          u2.usuario as usuario_registro,
                          tu.tipo_usuario as modulo_registro,
                          er.estado_registro as estado_registro,
                          JSON_VALUE(lr.campos_modificados, '$.consecutivo') AS consecutivo,
                          TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.aforo') AS INT) AS aforo
                      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
                  ) AS Datos
              FROM 
                  log_registro_lugares lr 
              JOIN 
                  registro_lugares r ON r.id = lr.registro_id
              JOIN 
                  usuarios u ON lr.usuario = u.id
              LEFT JOIN 
                  cat_distrito cd ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.distrito_electoral') AS INT) = cd.id
              LEFT JOIN 
                  demarcacion_territorial dm ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.demarcacion') AS INT) = dm.id
              LEFT JOIN 
                  usuarios u2 ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.usuario_registro') AS INT) = u2.id
              Left JOIN 
                  tipo_usuario tu ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.modulo_registro') AS INT) = tu.id
              Left JOIN 
                  estado_registro er ON TRY_CAST(JSON_VALUE(lr.campos_modificados, '$.estado_registro') AS INT) = er.id
              WHERE 
                  r.id =@id_registro
                              order by lr.id, lr.fecha, lr.hora
                            ;`);        

    

        if (result.recordset.length > 0) {
          const parsedResults = result.recordset.map(item => {
            try {
              return {
                ...item,
                Datos: JSON.parse(item.Datos)
              };
            } catch (error) {
              return item;
            }
          });

          return res.status(200).json({
            getbitacoraLugares: parsedResults
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