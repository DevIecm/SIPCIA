import { connectToDatabase, sql } from "../../Config/Configuracion.js";
import Midleware from "../../Config/Midleware.js";
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post("/altaFichaInd", Midleware.verifyToken, async (req, res) => {

    const {
        demarcacion_territorial,
        distrito_electoral,
        fecha_reunion,
        fecha_ficha,
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
        otro_plan_trabajo,
        otro_resumen_acta,
        solicitud_cambios,
        cambios_solicitados,
        observaciones,
        usuario_registro,
        modulo_registro,
        estado_registro,
        distrito_cabecera
    } = req.body;

    const { lengua_tecnica_indigena, traduccion_resumen_acta, persona_responsable_fti } = req.body; // Pedir los id en forma de lenguas Array 
        

    if (
        !demarcacion_territorial ||
        !distrito_electoral ||
        !fecha_ficha ||
        !fecha_reunion ||
        !hora_reunion ||
        !usuario_registro ||
        !modulo_registro ||
        !distrito_cabecera ||
        !estado_registro
    ) {
        return res.status(400).json({ message: "Datos requeridos" })
    }

    const pool = await connectToDatabase();
    const transaction = pool.transaction();

    // fecha y hora
    const original = new Date();
    const offsetInMs = original.getTimezoneOffset() * 60000;
    const fechaLocal = new Date(original.getTime() - offsetInMs);
    const ahora = new Date();
    const horaActual = ahora.toTimeString().split(' ')[0];

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);


       // Obtener nombre
       const resultadoFolio = await pool.request()
      .input('distrito_electoral', sql.Int, distrito_electoral)
      .query(`SELECT MAX(CAST(RIGHT(nombre_ficha, 5) AS INT)) AS ultimoFolio
        FROM ficha_tecnica_indigena
        WHERE distrito_electoral =@distrito_electoral and ISNUMERIC(RIGHT(nombre_ficha, 5)) = 1;
      `);
         
        const ultimoFolio = resultadoFolio.recordset[0].ultimoFolio || 0;
        const siguienteFolio = ultimoFolio + 1;
        const nombre_ficha = `FICHATECNICA_IR_DD${distrito_electoral}_${siguienteFolio.toString().padStart(5, '0')}`;


        // 1. Insertar en ficha_tecnica_indigena
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
            .input('otro_plan_trabajo', sql.VarChar, otro_plan_trabajo)
            .input('otro_resumen_acta', sql.VarChar, otro_resumen_acta)
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
            .query(`
                INSERT INTO ficha_tecnica_indigena                     
                    (demarcacion_territorial, distrito_electoral, fecha_reunion,
                    hora_reunion, numero_asistentes_reunion, lugar_reunion, fecha_asamblea_informativa,
                    hora_asamblea_informativa, numero_asistentes_informativa, lugar_asamblea_informativa, fecha_asamblea_consultiva,
                    hora_asamblea_consultiva, numero_asistentes_consultiva, lugar_asamblea_consultiva, periodo_del,
                    periodo_al, numero_lugares_publicos, otro_plan_trabajo, otro_resumen_acta,
                    solicitud_cambios, cambios_solicitados, observaciones, fecha_registro,
                    hora_registro, usuario_registro, modulo_registro, estado_registro, nombre_ficha, distrito_cabecera, fecha_ficha)
                OUTPUT INSERTED.id
                VALUES (@demarcacion_territorial, @distrito_electoral, @fecha_reunion,
                    @hora_reunion, @numero_asistentes_reunion, @lugar_reunion, @fecha_asamblea_informativa,
                    @hora_asamblea_informativa, @numero_asistentes_informativa, @lugar_asamblea_informativa, @fecha_asamblea_consultiva,
                    @hora_asamblea_consultiva, @numero_asistentes_consultiva, @lugar_asamblea_consultiva, @periodo_del,
                    @periodo_al, @numero_lugares_publicos, @otro_plan_trabajo, @otro_resumen_acta,
                    @solicitud_cambios, @cambios_solicitados, @observaciones, @fecha_registro,
                    @hora_registro, @usuario_registro, @modulo_registro, @estado_registro, @nombre_ficha, @distrito_cabecera, @fecha_ficha)
            `);

        const idRegistro = result.recordset[0].id;

        //plan de trabajo
        let lenguasConNombre = [];
        if (Array.isArray(lengua_tecnica_indigena) && lengua_tecnica_indigena.length > 0) {
            const insertedIds = [];

            for (const idLengua of lengua_tecnica_indigena) {                
                const request = new sql.Request(transaction); 

                await request
                    .input('ficha_tecnica_indigena', sql.Int, idRegistro)
                    .input('lengua_indigena', sql.Int, idLengua)
                    .query(`
                        INSERT INTO traduccion_plan_trabajo (ficha_tecnica_indigena, lengua_indigena)
                        VALUES (@ficha_tecnica_indigena, @lengua_indigena)
                    `);

                insertedIds.push(idLengua);
            }

            const request = new sql.Request(transaction);
            insertedIds.forEach((id, index) => {
                request.input(`id${index}`, sql.Int, id);
            });

            const whereClause = insertedIds.map((_, index) => `@id${index}`).join(', ');

            const result = await request.query(`
                SELECT id, lengua_indigena 
                FROM cat_lenguas_indigenas 
                WHERE id IN (${whereClause})
            `);

            lenguasConNombre = result.recordset; 
        }


        //resumen
        let resumenNombre = [];
        if (Array.isArray(traduccion_resumen_acta) && traduccion_resumen_acta.length > 0) {
            const insertedIds = [];
            for (const idLengua of traduccion_resumen_acta) {

                const request = new sql.Request(transaction);
                await request
                    .input('ficha_tecnica_indigena', sql.Int, idRegistro)
                    .input('lengua_indigena', sql.Int, idLengua)
                    .query(`
                    INSERT INTO traduccion_resumen_acta (ficha_tecnica_indigena, lengua_indigena)
                    VALUES (@ficha_tecnica_indigena, @lengua_indigena)
                `);

                insertedIds.push(idLengua);
            }

            const request = new sql.Request(transaction);
            insertedIds.forEach((id, index) => {
                request.input(`id${index}`, sql.Int, id);
            });

            const whereClause = insertedIds.map((_, index) => `@id${index}`).join(', ');

            const result = await request.query(`
                SELECT id, lengua_indigena 
                FROM cat_lenguas_indigenas 
                WHERE id IN (${whereClause})
            `);
            resumenNombre = result.recordset;
        }

        //personas responsable
        if (Array.isArray(persona_responsable_fti) && persona_responsable_fti.length > 0) {
        for (const persona of persona_responsable_fti) {
            
            const request = new sql.Request(transaction);
            const { dd_cabecera_demarcacion, direccion_distrital } = persona;

            await request
                .input('ficha_tecnica_indigena', sql.Int, idRegistro)
                .input('dd_cabecera_demarcacion', sql.VarChar, dd_cabecera_demarcacion)
                .input('direccion_distrital', sql.VarChar, direccion_distrital)
                .query(`
                    INSERT INTO persona_responsable_fti (
                        ficha_tecnica_indigena, dd_cabecera_demarcacion, direccion_distrital
                    )
                    VALUES (
                        @ficha_tecnica_indigena, @dd_cabecera_demarcacion, @direccion_distrital
                    )
                `);

        }
        }

        /* //bitacora pendiente por si se llega a ocupar

        // Demarcación territorial
        const resultDemarcacion = await transaction.request()
        .input('id', sql.Int, demarcacion_territorial)
        .query('SELECT demarcacion_territorial FROM demarcacion_territorial WHERE id = @id');
        const demarcacion_territorialCatalogo = resultDemarcacion.recordset[0]?.demarcacion_territorial || `(${demarcacion_territorial})`;

        // Distrito electoral
        const resultDistrito = await transaction.request()
        .input('id', sql.Int, distrito_electoral)
        .query('SELECT direccion_distrital FROM cat_distrito WHERE id = @id');
        const distrito_electoralCatalogo = resultDistrito.recordset[0]?.direccion_distrital || `(${distrito_electoral})`;

        // Usuario registro
        const resultUsuario = await transaction.request()
        .input('id', sql.Int, usuario_registro)
        .query('SELECT usuario FROM usuarios WHERE id = @id');
        const usuario_registroCatalogo = resultUsuario.recordset[0]?.usuario || `(${usuario_registro})`;

        // Módulo registro
        const resultModulo = await transaction.request()
        .input('id', sql.Int, modulo_registro)
        .query('SELECT tipo_usuario FROM tipo_usuario WHERE id = @id');
        const modulo_registroCatalogo = resultModulo.recordset[0]?.tipo_usuario || `(${modulo_registro})`;

        // Estado registro
        const resultEstado = await transaction.request()
        .input('id', sql.Int, estado_registro)
        .query('SELECT estado_registro FROM estado_registro WHERE id = @id');
        const estado_registroCatalogo = resultEstado.recordset[0]?.estado_registro || `(${estado_registro})`;


       const catalogos = {
            demarcacion_territorial: { [demarcacion_territorial]: demarcacion_territorialCatalogo },
            distrito_electoral: { [distrito_electoral]: distrito_electoralCatalogo },
            usuario_registro: { [usuario_registro]: usuario_registroCatalogo },
            modulo_registro: { [modulo_registro]: modulo_registroCatalogo },
            estado_registro: { [estado_registro]: estado_registroCatalogo },
            };

        const campos = {
            demarcacion_territorial,
            distrito_electoral,
            distrito_cabecera,
            fecha_reunion,
            fecha_ficha,
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
            otro_plan_trabajo,
            otro_resumen_acta,
            solicitud_cambios,
            cambios_solicitados,
            observaciones,
            usuario_registro,
            modulo_registro,
            estado_registro,
            nombre_ficha,
            lengua_tecnica_indigena: lenguasConNombre, 
            traduccion_resumen_acta: resumenNombre, 
            persona_responsable_fti
        }

               function reemplazarCatalogos(campos, catalogos) {
            const resultado = { ...campos };

            for (const campo in catalogos) {
                const id = campos[campo];

                if (id !== undefined && id !== null && id !== '') {
                    const nombre = catalogos[campo][id];
                    resultado[campo] = nombre || ` (${id})`;
                }
            }
            return resultado;
        }

        const camposConValores = reemplazarCatalogos(campos, catalogos);
        const camposModificados = JSON.stringify(camposConValores);

        //registrar bitacora fichas
        await transaction.request()
            .input('usuario', sql.Int, usuario_registro)
            .input('tipo_usuario', sql.Int, modulo_registro)
            .input('fecha', sql.Date, fechaLocal)
            .input('hora', sql.VarChar, horaActual)
            .input('registro_id', sql.Int, idRegistro)
            .input('campos_modificados', sql.VarChar(sql.MAX), camposModificados)
            .query(`
                INSERT INTO log_ficha_tecnica_indigena (usuario, tipo_usuario, fecha, hora, registro_id, campos_modificados)
                VALUES (@usuario, @tipo_usuario, @fecha, @hora, @registro_id, @campos_modificados)
            `);

/* */

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
router.get("/getFichasInd", Midleware.verifyToken, async (req, res) => {
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
            FROM ficha_tecnica_indigena
            WHERE (estado_registro<>4${distrito_electoral ? ' AND distrito_electoral = @distrito_electoral' : ''});`);

        if (result.recordset.length > 0) {
            return res.status(200).json({
                getFichasInd: result.recordset,
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


//consulta de registro
router.get("/getRegistroFichaInd", Midleware.verifyToken, async (req, res) => {

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
                    fi.periodo_al,
                    fi.numero_lugares_publicos,
                    fi.solicitud_cambios,
                    fi.cambios_solicitados,
                    fi.observaciones,
                    (
                        SELECT 
                            cli.id AS id_lengua,
                            cli.lengua_indigena
                        FROM traduccion_plan_trabajo tpt
                        left JOIN cat_lenguas_indigenas cli ON tpt.lengua_indigena = cli.id
                        WHERE tpt.ficha_tecnica_indigena = fi.id
                        FOR JSON PATH
                    ) AS lenguas,
                    fi.otro_plan_trabajo,
                    (
                        SELECT 
                        cli.id AS id_lengua,
                        cli.lengua_indigena 
                        FROM traduccion_resumen_acta tra
                        left JOIN cat_lenguas_indigenas cli ON tra.lengua_indigena = cli.id
                        WHERE tra.ficha_tecnica_indigena = fi.id
                        FOR JSON PATH
                    ) AS resumen,
                fi.otro_resumen_acta,
                (
                        SELECT 
                        prf.ficha_tecnica_indigena,
                        prf.dd_cabecera_demarcacion,
                        prf.direccion_distrital
                        FROM persona_responsable_fti prf
                        WHERE prf.ficha_tecnica_indigena = fi.id
                        FOR JSON PATH
                    ) AS personaRes
                FROM ficha_tecnica_indigena fi
                JOIN demarcacion_territorial dt ON fi.demarcacion_territorial = dt.id
                where fi.id = @id and fi.estado_registro<>4;
                `)

        if (result.recordset.length > 0) {
            
          const parsedResults = result.recordset.map(item => {
            try {
              return {
                ...item,
                lenguas: JSON.parse(item.lenguas),
                resumen: JSON.parse(item.resumen),
                personaRes: JSON.parse(item.personaRes)
              };
            } catch (error) {
              return item;
            }
          });
          return res.status(200).json({
            getRegistroFichaInd: parsedResults,
            code: 200
          });
        } else {
          return res.status(404).json({ message: "No se encontraron datos de tipo" });
        } 
        }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error de servidor", error: error.message });
    }
});

// eliminar ficha
router.patch("/eliminarFichaInd", Midleware.verifyToken, async () => {

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
                UPDATE ficha_tecnica_indigena
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