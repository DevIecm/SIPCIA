import { connectToDatabase, sql } from "../../Config/Configuracion.js";
import Midleware from "../../Config/Midleware.js";
import express, { json } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post("/altaFichaAfro", Midleware.verifyToken, async (req, res) => {

  const {
    demarcacion_territorial,
    distrito_electoral,
    fecha_reunion,
    fecha_ficha,
    ptrabajo_nombre,
    racta_nombre,
    hora_reunion,
    numero_asistentes_reunion,
    lugar_reunion,
    fecha_asamblea_informativa,
    hora_asamblea_informativa,
    numero_asistentes_informativa,
    lugar_asamblea_informativa,
    fecha_asamblea_consultiva,
    hora_asamblea_consultiva,
    numero_asistentes_consultiva,
    lugar_asamblea_consultiva,
    periodo_del,
    periodo_al,
    numero_lugares_publicos,
    plan_trabajo,
    resumen_acta,
    solicitud_cambios,
    cambios_solicitados,
    observaciones,
    usuario_registro,
    modulo_registro,
    estado_registro,
    distrito_cabecera
  } = req.body;

  const { persona_responsable_fta } = req.body



  if (!demarcacion_territorial ||
    !distrito_electoral ||
    !usuario_registro ||
    !fecha_ficha ||
    !modulo_registro ||
    !estado_registro ||
    !distrito_cabecera) {
    if (!demarcacion_territorial) faltantes.push("demarcacion_territorial");
    if (!distrito_electoral) faltantes.push("distrito_electoral");
    if (!usuario_registro) faltantes.push("usuario_registro");
    if (!fecha_ficha) faltantes.push("fecha_ficha");
    if (!modulo_registro) faltantes.push("modulo_registro");
    if (!estado_registro) faltantes.push("estado_registro");
    if (!distrito_cabecera) faltantes.push("distrito_cabecera");

    return res.status(400).json({
      message: "Faltan datos requeridos",
      faltantes,
    });
  }

  // Fecha y hora
  const original = new Date();
  const offsetInMs = original.getTimezoneOffset() * 60000;
  const fechaLocal = new Date(original.getTime() - offsetInMs);
  const ahora = new Date();
  const horaActual = ahora.toTimeString().split(' ')[0]; // formato HH:MM:SS



  const pool = await connectToDatabase();
  const transaction = pool.transaction();

  try {
    await transaction.begin();
    const request = new sql.Request(transaction);


    // Obtener nombre
    const resultadoFolio = await pool.request()
      .input('distrito_electoral', sql.Int, distrito_electoral)
      .query(`SELECT MAX(CAST(RIGHT(nombre_ficha, 5) AS INT)) AS ultimoFolio
            FROM ficha_tecnica_afromexicana
            WHERE distrito_electoral =@distrito_electoral and ISNUMERIC(RIGHT(nombre_ficha, 5)) = 1;
      `);

    const ultimoFolio = resultadoFolio.recordset[0].ultimoFolio || 0;
    const siguienteFolio = ultimoFolio + 1;
    const nombre_ficha = `FICHATECNICA_AT_DD${distrito_electoral}_${siguienteFolio.toString().padStart(5, '0')}`;


    const result = await request
      .input('demarcacion_territorial', sql.Int, demarcacion_territorial)
      .input('distrito_electoral', sql.Int, distrito_electoral)
      .input('fecha_reunion', sql.DateTime, fecha_reunion)
      .input('hora_reunion', sql.VarChar, hora_reunion)
      .input('numero_asistentes_reunion', sql.Numeric, numero_asistentes_reunion)
      .input('lugar_reunion', sql.VarChar, lugar_reunion)
      .input('fecha_asamblea_informativa', sql.DateTime, fecha_asamblea_informativa)
      .input('hora_asamblea_informativa', sql.VarChar, hora_asamblea_informativa)
      .input('numero_asistentes_informativa', sql.Numeric, numero_asistentes_informativa)
      .input('lugar_asamblea_informativa', sql.VarChar, lugar_asamblea_informativa)
      .input('fecha_asamblea_consultiva', sql.DateTime, fecha_asamblea_consultiva)
      .input('hora_asamblea_consultiva', sql.VarChar, hora_asamblea_consultiva)
      .input('numero_asistentes_consultiva', sql.Numeric, numero_asistentes_consultiva)
      .input('lugar_asamblea_consultiva', sql.VarChar, lugar_asamblea_consultiva)
      .input('periodo_del', sql.DateTime, periodo_del)
      .input('periodo_al', sql.DateTime, periodo_al)
      .input('numero_lugares_publicos', sql.Numeric, numero_lugares_publicos)
      .input('plan_trabajo', sql.VarChar, plan_trabajo)
      .input('resumen_acta', sql.VarChar, resumen_acta)
      .input('solicitud_cambios', sql.Int, solicitud_cambios)
      .input('cambios_solicitados', sql.VarChar, cambios_solicitados)
      .input('observaciones', sql.VarChar, observaciones)
      .input('fecha_registro', sql.DateTime, fechaLocal)
      .input('hora_registro', sql.VarChar, horaActual)
      .input('usuario_registro', sql.Int, usuario_registro)
      .input('modulo_registro', sql.Int, modulo_registro)
      .input('estado_registro', sql.Int, estado_registro)
      .input('nombre_ficha', sql.VarChar, nombre_ficha)
      .input('distrito_cabecera', sql.Int, distrito_cabecera)
      .input('fecha_ficha', sql.DateTime, fecha_ficha)
      .input('ptrabajo_nombre', sql.VarChar, ptrabajo_nombre)
      .input('racta_nombre', sql.VarChar, racta_nombre)
      .query(`
                INSERT INTO ficha_tecnica_afromexicana                     
                    (demarcacion_territorial, distrito_electoral, fecha_reunion,
                    hora_reunion, numero_asistentes_reunion, lugar_reunion, fecha_asamblea_informativa,
                    hora_asamblea_informativa, numero_asistentes_informativa, lugar_asamblea_informativa, fecha_asamblea_consultiva,
                    hora_asamblea_consultiva, numero_asistentes_consultiva, lugar_asamblea_consultiva, periodo_del,
                    periodo_al, numero_lugares_publicos, plan_trabajo, resumen_acta,
                    solicitud_cambios, cambios_solicitados, observaciones, fecha_registro,
                    hora_registro, usuario_registro, modulo_registro, estado_registro, nombre_ficha, distrito_cabecera, fecha_ficha, ptrabajo_nombre, racta_nombre)
                OUTPUT INSERTED.id
                VALUES (@demarcacion_territorial, @distrito_electoral, @fecha_reunion,
                    @hora_reunion, @numero_asistentes_reunion, @lugar_reunion, @fecha_asamblea_informativa,
                    @hora_asamblea_informativa, @numero_asistentes_informativa, @lugar_asamblea_informativa, @fecha_asamblea_consultiva,
                    @hora_asamblea_consultiva, @numero_asistentes_consultiva, @lugar_asamblea_consultiva, @periodo_del,
                    @periodo_al, @numero_lugares_publicos, @plan_trabajo, @resumen_acta,
                    @solicitud_cambios, @cambios_solicitados, @observaciones, @fecha_registro,
                    @hora_registro, @usuario_registro, @modulo_registro, @estado_registro, @nombre_ficha, @distrito_cabecera, @fecha_ficha, @ptrabajo_nombre, @racta_nombre)
            `);

    const idRegistro = result.recordset[0].id;

    //personas responsable
    if (Array.isArray(persona_responsable_fta) && persona_responsable_fta.length > 0) {
      for (const persona of persona_responsable_fta) {

        const request = new sql.Request(transaction);
        const { dd_cabecera_demarcacion, direccion_distrital } = persona;


        await request
          .input('ficha_tecnica_iafromexicana', sql.Int, idRegistro)
          .input('dd_cabecera_demarcacion', sql.VarChar, dd_cabecera_demarcacion)
          .input('direccion_distrital', sql.VarChar, direccion_distrital)
          .query(`
                INSERT INTO persona_responsable_fta (
                ficha_tecnica_iafromexicana, dd_cabecera_demarcacion, direccion_distrital
                )
                VALUES (
                @ficha_tecnica_iafromexicana, @dd_cabecera_demarcacion, @direccion_distrital
                )
            `);
      }
    }

    // Confirmar la transacción
    await transaction.commit();
    return res.status(200).json({ message: "Registro creado", id: idRegistro, nombre_ficha: nombre_ficha, code: 200 });



  } catch (error) {
    await transaction.rollback();
    console.error('Error en transacción:', error);
    return { ok: false, error };
  }

});

//get todas las consultas de fichas 
router.get("/getFichasAfro", Midleware.verifyToken, async (req, res) => {
    const {
        distrito_electoral
    }= req.query


    try {

        const pool = await connectToDatabase();
        const result = await pool.request()
        
            .input('distrito_electoral', sql.Int, distrito_electoral)
            .query(`SELECT 
                id,
                nombre_ficha,
                fecha_registro,
                RIGHT('0' + CAST(
                    CASE 
                        WHEN DATEPART(HOUR, hora_registro) % 12 = 0 THEN 12 
                        ELSE DATEPART(HOUR, hora_registro) % 12 
                    END AS VARCHAR), 2) 
                + ':' + RIGHT('0' + CAST(DATEPART(MINUTE, hora_registro) AS VARCHAR), 2) 
                + ' ' + CASE WHEN DATEPART(HOUR, hora_registro) >= 12 THEN 'PM' ELSE 'AM' END 
                AS hora_registro
            FROM ficha_tecnica_afromexicana
            WHERE (estado_registro<>4${distrito_electoral ? ' AND distrito_electoral = @distrito_electoral' : ''});`);

        if (result.recordset.length > 0) {
            return res.status(200).json({
                getFichasAfro: result.recordset,
                code: 200
            });
        } else {
            return res.status(200).json({ message: "No se encontraron datos" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error de servidor", error: error.message });
    }
});


//consulta de registro
router.get("/getRegistroFichaAfro", Midleware.verifyToken, async (req, res) => {

    const { id } = req.query; 

        if(!id){
            return res.status(400).json({ message: "Datos requeridos"})
        }
        
        try {

            const pool = await connectToDatabase();

            const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT 
                    fi.id,
                    fi.demarcacion_territorial AS id_demarcacion,
                    dt.demarcacion_territorial,
                    fi.distrito_cabecera,
                    fi.distrito_electoral,
                    fi.fecha_registro,
                    fi.fecha_ficha,
                    fi.ptrabajo_nombre,
                    fi.racta_nombre,
                    fi.fecha_reunion,
                    fi.fecha_asamblea_informativa,
                    fi.fecha_asamblea_consultiva,
                    fi.nombre_ficha,
                    fi.hora_reunion,
                    fi.hora_asamblea_informativa,
                    fi.hora_asamblea_consultiva,
                    fi.numero_asistentes_reunion,
                    fi.numero_asistentes_informativa,
                    fi.numero_asistentes_consultiva,
                    fi.lugar_reunion,
                    fi.lugar_asamblea_informativa,
                    fi.lugar_asamblea_consultiva,
                    fi.periodo_del,
                    fi.plan_trabajo,
                    fi.resumen_acta,
                    fi.observaciones,
                    fi.cambios_solicitados,
                    fi.periodo_al,
                    fi.numero_lugares_publicos,
                    (
                        SELECT 
                        prf.ficha_tecnica_iafromexicana,
                        prf.dd_cabecera_demarcacion,
                        prf.direccion_distrital
                        FROM persona_responsable_fta prf
                        WHERE prf.ficha_tecnica_iafromexicana = fi.id
                        FOR JSON PATH
                    ) AS personaRes
                FROM ficha_tecnica_afromexicana fi
                JOIN demarcacion_territorial dt ON fi.demarcacion_territorial = dt.id
                where fi.id = @id;
                `)
        
        if (result.recordset.length > 0) {

          const parsedResults = result.recordset.map(item => {
            try {
              return {
                ...item,
                personaRes: JSON.parse(item.personaRes)
              };
            } catch (error) {
              return item;
            }
          });
          return res.status(200).json({
            getRegistroFichaAfro: parsedResults,
            code: 200
          });
        } else {
            return res.status(200).json({ message: "No se encontraron registros", code: 100})
        }
        }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error de servidor", error: error.message });
    }
});

// eliminar ficha
router.patch("/eliminarFichaAfro", Midleware.verifyToken, async (req, res) => {

    const { id } = req.body;

    if (id == null) {
        return res.status(400), json({ message: "EL campos requeridos" })
    }

    let transaction;

    try {
        const pool = await connectToDatabase();
        transaction = pool.transaction();
        await transaction.begin();

        await transaction.request()
            .input('id', sql.Int, id)
            .query(`
                UPDATE ficha_tecnica_afromexicana
                SET estado_registro = 4
                where id = @id;
            `);

        await transaction.commit();

        return res.status(200).json({
            message: `EL registro fue eliminado`,
            code: 200,
        });

    } catch (err) {
        console.error("Error en Registro:", err);
        if (transaction) {
            await transaction.rollback();
        }
        return res.status(500).json({ message: "Error al actualizar los registros", error: err.message });
    }
});


export default router;