import { connectToDatabase, sql } from "../../Config/Configuracion.js";
import Midleware from "../../Config/Midleware.js";
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get("/getConsCon", Midleware.verifyToken, async (req, res) => {
  const { distrito_electoral } = req.query;

  if (!distrito_electoral) {
    return res.status(400).json({ message: "Datos requeridos" });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('distrito_electoral', sql.Int, distrito_electoral)
      .query(`
        SELECT MAX(numero_consecutivo) AS ultimoCons
        FROM atencion_consultas
        WHERE distrito_electoral = @distrito_electoral
      `);

    const ultimoValor = result.recordset[0].ultimoCons || 0;
    const numero_consecutivo = ultimoValor + 1;

    return res.status(200).json({
      getConsCon: numero_consecutivo
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});



//insert registro
router.post("/altaAtencion", Midleware.verifyToken, async(req,res)=>{

    const {
        distrito_electoral,
        numero_reporte,
        fecha_periodo,
        presento_caso,
        fecha_consulta,
        nombre_completo,
        pueblo_originario,
        pueblo,
        barrio,
        unidad_territorial,
        otro,
        cargo,
        descripcion_consulta,
        forma_atendio,
        observaciones,
        documento,
        enlace_documento,
        usuario_registro,
        modulo_registro,
        estado_registro
    } = req.body

    if (
        distrito_electoral  == null || distrito_electoral === '' ||
        presento_caso ==  null || presento_caso === ''||
        numero_reporte  == null || numero_reporte === '' ||
        fecha_periodo  == null || fecha_periodo === '' ||
        fecha_consulta  == null || fecha_consulta === '' ||
        nombre_completo  == null || nombre_completo === '' ||
        pueblo_originario  == null || pueblo_originario === '' ||
        pueblo  == null || pueblo === '' ||
        barrio   == null || barrio === '' ||
        unidad_territorial   == null || unidad_territorial === '' ||
        documento  == null || documento === '' ||
        enlace_documento  == null || enlace_documento === '' ||
        usuario_registro  == null || usuario_registro === '' ||
        modulo_registro  == null || modulo_registro === '' ||
        estado_registro  == null || estado_registro === ''
    ){
        return res.status(400).json({ message: "Datos requeridos"})
    }

    // Fecha y hora
    const original = new Date();
    const offsetInMs = original.getTimezoneOffset() * 60000;
    const fechaLocal = new Date(original.getTime() - offsetInMs);
    const ahora = new Date();
    const horaActual = ahora.toTimeString().split(' ')[0]; // formato HH:MM:SS

    let transaction;

    try{

        const pool = await connectToDatabase();
        const transaction = pool.transaction();

        await transaction.begin();

        //obtener consecutivo por distrito
        const resultadoConsecutivo = await transaction.request()
            .input('distrito_electoral', sql.Int, distrito_electoral)
            .query(`
                select Max(numero_consecutivo) as ultimoCons
                from atencion_consultas
                where distrito_electoral = @distrito_electoral
            `);

        const ultimoValor = resultadoConsecutivo.recordset[0].ultimoCons || 0;
        const numero_consecutivo = ultimoValor + 1;

        const result = await transaction.request()
            .input('distrito_electoral', sql.Int, distrito_electoral)
            .input('numero_reporte',sql.Int, numero_reporte)
            .input('fecha_periodo',sql.Int, fecha_periodo)
            .input('presento_caso',sql.Int, presento_caso)
            .input('numero_consecutivo', sql.Numeric, numero_consecutivo)
            .input('fecha_consulta', sql.DateTime, fecha_consulta)
            .input('nombre_completo', sql.VarChar, nombre_completo)
            .input('pueblo_originario', sql.Int, pueblo_originario)
            .input('pueblo', sql.Int, pueblo)
            .input('barrio', sql.Int, barrio)
            .input('unidad_territorial', sql.Int, unidad_territorial)
            .input('otro', sql.VarChar, otro)
            .input('cargo', sql.VarChar, cargo)
            .input('descripcion_consulta',sql.VarChar, descripcion_consulta)
            .input('forma_atendio',sql.VarChar, forma_atendio)
            .input('observaciones', sql.VarChar, observaciones)
            .input('documento', sql.Int, documento)
            .input('enlace_documento', sql.VarChar, enlace_documento)
            .input('fecha_registro', sql.DateTime, fechaLocal)
            .input('hora_registro', sql.VarChar, horaActual)
            .input('usuario_registro', sql.Int, usuario_registro)
            .input('modulo_registro', sql.Int, modulo_registro)
            .input('estado_registro', sql.Int, estado_registro)
            .query(`INSERT INTO atencion_consultas (distrito_electoral, numero_reporte, fecha_periodo, presento_caso, numero_consecutivo, 
                fecha_consulta, nombre_completo, pueblo_originario, pueblo, barrio, unidad_territorial, otro, cargo, descripcion_consulta,
                forma_atendio, observaciones, documento, enlace_documento, fecha_registro, hora_registro, usuario_registro, modulo_registro, 
                estado_registro)
                OUTPUT INSERTED.id
                VALUES (@distrito_electoral, @numero_reporte, @fecha_periodo, @presento_caso, @numero_consecutivo, 
                @fecha_consulta, @nombre_completo, @pueblo_originario, @pueblo, @barrio, @unidad_territorial, @otro, @cargo, @descripcion_consulta,
                @forma_atendio, @observaciones, @documento, @enlace_documento, @fecha_registro, @hora_registro, @usuario_registro, @modulo_registro, 
                @estado_registro);
                `);

        const insertedId = result.recordset[0].id;


        const camposModificados = JSON.stringify({
            distrito_electoral,
            numero_reporte,
            fecha_periodo,
            presento_caso,
            numero_consecutivo,
            fecha_consulta,
            nombre_completo,
            pueblo_originario,
            pueblo,
            barrio,
            unidad_territorial,
            otro,
            cargo,
            descripcion_consulta,
            forma_atendio,
            observaciones,
            documento,
            enlace_documento,
            usuario_registro,
            modulo_registro,
            estado_registro
        })

        await transaction.request()
            .input('usuario', sql.Int, usuario_registro)
            .input('tipo_usuario', sql.Int, modulo_registro)
            .input('fecha', sql.Date, fechaLocal)
            .input('hora', sql.VarChar, horaActual)
            .input('registro_id', sql.Int, insertedId)
            .input('campos_modificados', sql.VarChar(sql.MAX), camposModificados)
            .query(`
                INSERT INTO log_atencion_consulta (usuario, tipo_usuario, fecha, hora, registro_id, campos_modificados)
                VALUES (@usuario, @tipo_usuario, @fecha, @hora, @registro_id, @campos_modificados)
            `);


        // Confirmar la transacción
        await transaction.commit();

        return res.status(200).json({
            message: "Registro creado correctamente",
            id: insertedId,
            code: 200,
        });

    }catch (err) {
        console.error("Error en Registro:", err);
        if (transaction) {
            await transaction.rollback();
        }
        return res.status(500).json({ message: "Error al guardar el registro", error: err.message });
    }
});


//update del registro
router.patch("/updateAntencion", Midleware.verifyToken, async (req, res) => {

    const {
        id_registro,
        distrito_electoral,
        numero_reporte,
        fecha_periodo,
        presento_caso,
        fecha_consulta,
        nombre_completo,
        pueblo_originario,
        pueblo,
        barrio,
        unidad_territorial,
        otro,
        cargo,
        descripcion_consulta,
        forma_atendio,
        observaciones,
        documento,
        enlace_documento,
        usuario_registro,
        modulo_registro,
        estado_registro
    } = req.body;


     if (
        distrito_electoral  == null || distrito_electoral === '' ||
        presento_caso ==  null || presento_caso === ''||
        numero_reporte  == null || numero_reporte === '' ||
        fecha_periodo  == null || fecha_periodo === '' ||
        fecha_consulta  == null || fecha_consulta === '' ||
        nombre_completo  == null || nombre_completo === '' ||
        pueblo_originario  == null || pueblo_originario === '' ||
        pueblo  == null || pueblo === '' ||
        barrio   == null || barrio === '' ||
        unidad_territorial   == null || unidad_territorial === '' ||
        documento  == null || documento === '' ||
        enlace_documento  == null || enlace_documento === '' ||
        usuario_registro  == null || usuario_registro === '' ||
        modulo_registro  == null || modulo_registro === '' ||
        estado_registro  == null || estado_registro === ''
    ){
        return res.status(400).json({ message: "Datos requeridos"})
    }

    let transaction;

    try {

         const pool = await connectToDatabase();
        const transaction = pool.transaction();

        await transaction.begin();

        // Obtener datos actuales
        const resultAnterior = await transaction.request()
            .input('id', sql.Int, id_registro)
            .query('SELECT * FROM atencion_consultas WHERE id = @id');

        const registroAnterior = resultAnterior.recordset[0];

        if (!registroAnterior) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        //comparar

        const camposEditables = [
            "distrito_electoral",
            "numero_reporte",
            "fecha_periodo",
            "presento_caso",
            "fecha_consulta",
            "nombre_completo",
            "pueblo_originario",
            "pueblo",
            "barrio",
            "unidad_territorial",
            "otro",
            "cargo",
            "descripcion_consulta",
            "forma_atendio",
            "observaciones",
            "documento",
            "enlace_documento",
            "usuario_registro",
            "modulo_registro",
            "estado_registro"
        ];


        const nuevosDatos = {
            distrito_electoral,
            numero_reporte,
            fecha_periodo,
            presento_caso,
            fecha_consulta,
            nombre_completo,
            pueblo_originario,
            pueblo,
            barrio,
            unidad_territorial,
            otro,
            cargo,
            descripcion_consulta,
            forma_atendio,
            observaciones,
            documento,
            enlace_documento,
            usuario_registro,
            modulo_registro,
            estado_registro
        };

        const cambios = {};
        for (const campo of camposEditables) {
            const valorAnterior = registroAnterior[campo];
            const valorNuevo = nuevosDatos[campo];

            if (valorAnterior != valorNuevo) {
                cambios[campo] = valorNuevo;
            }
        }

        if (Object.keys(cambios).length > 0) {
            await transaction.request()
                .input('id_registro', sql.Int, id_registro)
                .input('distrito_electoral', sql.Int, distrito_electoral)
                .input('numero_reporte',sql.Int, numero_reporte)
                .input('fecha_periodo',sql.Int, fecha_periodo)
                .input('presento_caso',sql.Int, presento_caso)
                .input('fecha_consulta', sql.DateTime, fecha_consulta)
                .input('nombre_completo', sql.VarChar, nombre_completo)
                .input('pueblo_originario', sql.Int, pueblo_originario)
                .input('pueblo', sql.Int, pueblo)
                .input('barrio', sql.Int, barrio)
                .input('unidad_territorial', sql.Int, unidad_territorial)
                .input('otro', sql.VarChar, otro)
                .input('cargo', sql.VarChar, cargo)
                .input('descripcion_consulta',sql.VarChar, descripcion_consulta)
                .input('forma_atendio',sql.VarChar, forma_atendio)
                .input('observaciones', sql.VarChar, observaciones)
                .input('documento', sql.Int, documento)
                .input('enlace_documento', sql.VarChar, enlace_documento)
                .input('usuario_registro', sql.Int, usuario_registro)
                .input('modulo_registro', sql.Int, modulo_registro)
                .input('estado_registro', sql.Int, estado_registro)
                .query(`UPDATE atencion_consultas SET
                        distrito_electoral = @distrito_electoral,
                        numero_reporte = @numero_reporte,
                        fecha_periodo = @fecha_periodo,
                        presento_caso = @presento_caso,
                        fecha_consulta = @fecha_consulta,
                        nombre_completo = @nombre_completo,
                        pueblo_originario = @pueblo_originario,
                        pueblo = @pueblo,
                        barrio = @barrio,
                        unidad_territorial = @unidad_territorial,
                        otro = @otro,
                        cargo = @cargo,
                        descripcion_consulta = @descripcion_consulta,
                        forma_atendio = @forma_atendio,
                        observaciones = @observaciones,
                        documento = @documento,
                        enlace_documento = @enlace_documento,
                        usuario_registro = @usuario_registro,
                        modulo_registro = @modulo_registro,
                        estado_registro = @estado_registro                   
                    WHERE id = @id_registro;
                `);
        }

        // Fecha y hora
    const original = new Date();
    const offsetInMs = original.getTimezoneOffset() * 60000;
    const fechaLocal = new Date(original.getTime() - offsetInMs);
    const ahora = new Date();
    const horaActual = ahora.toTimeString().split(' ')[0]; // formato HH:MM:SS

        const camposModificados = JSON.stringify(cambios);

        await transaction.request()
            .input('usuario', sql.Int, usuario_registro)
            .input('tipo_usuario', sql.Int, modulo_registro)
            .input('fecha', sql.Date, fechaLocal)
            .input('hora', sql.VarChar, horaActual)
            .input('registro_id', sql.Int, id_registro)
            .input('campos_modificados', sql.VarChar(sql.MAX), camposModificados)
            .query(`
                INSERT INTO log_atencion_consulta (usuario, tipo_usuario, fecha, hora, registro_id, campos_modificados)
                VALUES (@usuario, @tipo_usuario, @fecha, @hora, @registro_id, @campos_modificados)
            `);

        // Confirmar la transacción
        await transaction.commit();

        return res.status(200).json({
            message: "Registro actualiazado correctamente",
            code: 200,
        });
    }catch (err) {
        console.error("Error en Registro:", err);
        if (transaction) {
            await transaction.rollback();
        }
        return res.status(500).json({ message: "Error al actualizar el registro", error: err.message });
    }
});


//consulta tabla registro atencion consultas
router.get("/getAtencion", Midleware.verifyToken, async(req, res)=>{

    const {
        distrito_electoral
    }= req.query

    if (!distrito_electoral){
        return res.status(400).json({ message: "Datos requeridos"})
    }

    try{
        const pool = await connectToDatabase();
        const result = await pool.request()
        .input('distrito_electoral', sql.Int, distrito_electoral)
        .query(`select 
                ac.id as id_registro,
                ac.presento_caso,
                ac.numero_consecutivo,
                ac.fecha_consulta,
                ac.nombre_completo,
                cpo.pueblo_originario,
                cp.pueblo,
                cb.barrio,
                ut.ut,
                ac.otro,
                ac.cargo,
                ac.descripcion_consulta,
                ac.forma_atendio,
                ac.observaciones,
                ac.enlace_documento,
                ac.documento
                from atencion_consultas ac
                join cat_pueblos_originarios cpo on ac.pueblo_originario = cpo.id 
                join cat_pueblos cp on ac.pueblo = cp.id 
                join cat_barrios cb on ac.barrio = cb.id 
                join unidad_territorial ut on ac.unidad_territorial = ut.id
                where ac.distrito_electoral = @distrito_electoral;
            `);

        if (result.recordset.length > 0) {
            return res.status(200).json({
                getAtencion: result.recordset
            });
        } else {
            return res.status(404).json({ message: "No se encontraron datos" });
        }

    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error de servidor", error: error.message });
    }

});



// consulta por registro
router.get("/getRegistroAtencion", Midleware.verifyToken, async (req, res) =>{

    const { id } =  req.query;

    if (!id){
        return res.status(400).json({ message: "Datos requeridos"})
    }


    let transaction;

    try{

        const pool = await connectToDatabase();
            const transaction = pool.transaction();

            await transaction.begin();

            const result = await transaction.request()
            .input('id', sql.Int, id)
            .query(`select 
                    ac.id as id_registro,
                    ac.numero_reporte,
                    ac.fecha_periodo,
                    ac.presento_caso,
                    ac.numero_consecutivo,
                    ac.fecha_consulta,
                    ac.nombre_completo,
                    ac.pueblo_originario,
                    ac.pueblo,
                    ac.barrio,
                    ac.unidad_territorial,
                    ac.otro,
                    ac.cargo,
                    ac.descripcion_consulta,
                    ac.forma_atendio,
                    ac.observaciones,
                    ac.enlace_documento,
                    ac.documento
                    from atencion_consultas ac
                where ac.id =@id;
                `)
        
        if (result.recordset.length > 0) {
            return res.status(200).json({
                getRegistroAtencion: result.recordset
            });
        } else {
            return res.status(404).json({ message: "No se encontraron registros", code: 100})
        }

    }catch (err) {
        console.error("Error en la consulta:", err);
        if (transaction) {
            await transaction.rollback();
        }
        return res.status(500).json({ message: "Error al consultar", error: err.message });
    }
});


export default router;