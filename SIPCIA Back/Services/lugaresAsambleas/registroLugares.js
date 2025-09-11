import { connectToDatabase, sql } from "../../Config/Configuracion.js";
import Midleware from "../../Config/Midleware.js";
import express from 'express';
import dotenv from 'dotenv';


dotenv.config();

const router = express.Router();

router.post("/altaLugar", Midleware.verifyToken, async (req, res) => {

    const {
        distrito_electoral,
        estado_registro,
        demarcacion,
        lugar_espacio,
        domicilio,
        fotografia,
        enlace_fotografia,
        ubicacion_kml,
        enlace_ubicacion,
        intitucion_propietaria,
        prestamo_iecm,
        nuevo_prestamo,
        superficie_espacio,
        aforo,
        ventilacion,
        observaciones,
        usuario_registro,
        modulo_registro
    } = req.body

    if (
        distrito_electoral == null || distrito_electoral === '' ||
        demarcacion == null || demarcacion === '' ||
        lugar_espacio === '' ||
        domicilio === '' ||
        fotografia === '' ||
        ubicacion_kml === '' ||
        prestamo_iecm === '' ||
        nuevo_prestamo === '' ||
        superficie_espacio === '' ||
        aforo === '' ||
        usuario_registro == null || usuario_registro === '' ||
        modulo_registro == null || modulo_registro === '' ||
        estado_registro == null || estado_registro === '') {
        return res.status(400).json({ message: "Datos requeridos" })
    } 

    // fecha y hora
    const original = new Date();
    const offsetInMs = original.getTimezoneOffset() * 60000;
    const fechaLocal = new Date(original.getTime() - offsetInMs);
    const ahora = new Date();
    const horaActual = ahora.toTimeString().split(' ')[0]; // formato HH:MM:SS

    let transaction;

    try {

        const pool = await connectToDatabase();
        const transaction = pool.transaction();

        await transaction.begin();

        //obtener consecutivo por distrito
        const resultadoConsecutivo = await transaction.request()
            .input('distrito_electoral', sql.Int, distrito_electoral)
            .query(`
                select Max(consecutivo) as ultimoCons
                from registro_lugares
                where distrito_electoral = @distrito_electoral
            `);

        const ultimoValor = resultadoConsecutivo.recordset[0].ultimoCons || 0;
        const consecutivo = ultimoValor + 1;


        const result = await transaction.request()
            .input('distrito_electoral', sql.Int, distrito_electoral)
            .input('demarcacion', sql.Int, demarcacion)
            .input('lugar_espacio', sql.VarChar, lugar_espacio)
            .input('domicilio', sql.VarChar, domicilio)
            .input('fotografia', sql.Int, fotografia) //mandar  0
            .input('enlace_fotografia', sql.VarChar, enlace_fotografia)
            .input('ubicacion_kml', sql.Int, ubicacion_kml) //mandar  0
            .input('enlace_ubicacion', sql.VarChar, enlace_ubicacion) 
            .input('intitucion_propietaria', sql.VarChar, intitucion_propietaria)
            .input('prestamo_iecm', sql.Int, prestamo_iecm)
            .input('nuevo_prestamo', sql.Int, nuevo_prestamo)
            .input('superficie_espacio', sql.Int, superficie_espacio)
            .input('aforo', sql.Int, aforo)
            .input('ventilacion', sql.Int, ventilacion)
            .input('observaciones', sql.VarChar, observaciones)
            .input('fecha_registro', sql.DateTime, fechaLocal)
            .input('hora_registro', sql.VarChar, horaActual)
            .input('usuario_registro', sql.Int, usuario_registro)
            .input('modulo_registro', sql.Int, modulo_registro)
            .input('estado_registro', sql.Int, estado_registro)   
            .input('consecutivo', sql.Int, consecutivo)         
            .query(`INSERT INTO registro_lugares (distrito_electoral, demarcacion, lugar_espacio, domicilio, fotografia, 
                enlace_fotografia, ubicacion_kml, enlace_ubicacion, intitucion_propietaria, prestamo_iecm, nuevo_prestamo, 
                superficie_espacio, aforo, ventilacion, observaciones, fecha_registro, hora_registro, usuario_registro, 
                modulo_registro, estado_registro, consecutivo) 
                OUTPUT INSERTED.id
                VALUES (@distrito_electoral, @demarcacion, @lugar_espacio, @domicilio, @fotografia, @enlace_fotografia, @ubicacion_kml, 
                @enlace_ubicacion, @intitucion_propietaria, @prestamo_iecm, @nuevo_prestamo, @superficie_espacio, @aforo, @ventilacion, 
                @observaciones, @fecha_registro, @hora_registro, @usuario_registro, @modulo_registro, @estado_registro, @consecutivo)
                `);

        const insertedId = result.recordset[0].id;


        const camposModificados = JSON.stringify({
            distrito_electoral, 
            demarcacion, 
            lugar_espacio, 
            domicilio, 
            fotografia,                 
            enlace_fotografia, 
            ubicacion_kml, 
            enlace_ubicacion, 
            intitucion_propietaria, 
            prestamo_iecm, 
            nuevo_prestamo,                 
            superficie_espacio, 
            aforo, 
            ventilacion, 
            observaciones, 
            usuario_registro, 
            modulo_registro, 
            estado_registro,
            consecutivo
            });

        //garda data en bitacora
        await transaction.request()
            .input('usuario', sql.Int, usuario_registro)
            .input('tipo_usuario', sql.Int, modulo_registro)
            .input('fecha', sql.Date, fechaLocal)
            .input('hora', sql.VarChar, horaActual)
            .input('registro_id', sql.Int, insertedId)
            .input('campos_modificados', sql.VarChar(sql.MAX), camposModificados)
            .query(`
                INSERT INTO log_registro_lugares (usuario, tipo_usuario, fecha, hora, registro_id, campos_modificados)
                VALUES (@usuario, @tipo_usuario, @fecha, @hora, @registro_id, @campos_modificados)
            `);
        
        // Confirmar la transacción
        await transaction.commit();

        return res.status(200).json({
            message: "Registro creado correctamente",
            id: insertedId,
            code: 200,
        });

    } catch (err) {
        console.error("Error en Registro:", err);
        if (transaction) {
            await transaction.rollback();
        }
        return res.status(500).json({ message: "Error al guardar el registro", error: err.message });
    }
});


// update del registro

router.patch("/updateLugar", Midleware.verifyToken, async (req, res)=> {

    const {
        id_registro,
        distrito_electoral,
        estado_registro,
        demarcacion,
        lugar_espacio,
        domicilio,
        fotografia,
        enlace_fotografia,
        ubicacion_kml,
        enlace_ubicacion,
        intitucion_propietaria,
        prestamo_iecm,
        nuevo_prestamo,
        superficie_espacio,
        aforo,
        ventilacion,
        observaciones,
        usuario_registro,
        modulo_registro
    } = req.body

    if (
            id_registro == null || id_registro === '' ||
            distrito_electoral == null || distrito_electoral === '' ||
            demarcacion == null || demarcacion === '' ||
            lugar_espacio === '' ||
            domicilio === '' ||
            fotografia === '' ||
            ubicacion_kml === '' ||
            prestamo_iecm === '' ||
            nuevo_prestamo === '' ||
            superficie_espacio === '' ||
            aforo === '' ||
            usuario_registro == null || usuario_registro === '' ||
            modulo_registro == null || modulo_registro === '' ||
            estado_registro == null || estado_registro === '') {
            return res.status(400).json({ message: "Datos requeridos" })
        }
    
    let transaction;

    try {

        const pool = await connectToDatabase();
        const transaction = pool.transaction();

        await transaction.begin();

        // Obtener datos actuales
        const resultAnterior = await transaction.request()
            .input('id', sql.Int, id_registro)
            .query('SELECT * FROM registro_lugares WHERE id = @id');

        const registroAnterior = resultAnterior.recordset[0];

        if (!registroAnterior) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

                //comparar
        const camposEditables = [
            "distrito_electoral",
            "estado_registro",
            "demarcacion",
            "lugar_espacio",
            "domicilio",
            "fotografia",
            "enlace_fotografia",
            "ubicacion_kml",
            "enlace_ubicacion",
            "intitucion_propietaria",
            "prestamo_iecm",
            "nuevo_prestamo",
            "superficie_espacio",
            "aforo",
            "ventilacion",
            "observaciones",
            "usuario_registro",
            "modulo_registro"
        ];

        const nuevosDatos = {
            distrito_electoral,
            estado_registro,
            demarcacion,
            lugar_espacio,
            domicilio,
            fotografia,
            enlace_fotografia,
            ubicacion_kml,
            enlace_ubicacion,
            intitucion_propietaria,
            prestamo_iecm,
            nuevo_prestamo,
            superficie_espacio,
            aforo,
            ventilacion,
            observaciones,
            usuario_registro,
            modulo_registro
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
                .input('demarcacion', sql.Int, demarcacion)
                .input('lugar_espacio', sql.VarChar, lugar_espacio)
                .input('domicilio', sql.VarChar, domicilio)
                .input('fotografia', sql.Int, fotografia) //mandar  0
                .input('enlace_fotografia', sql.VarChar, enlace_fotografia)
                .input('ubicacion_kml', sql.Int, ubicacion_kml) //mandar  0
                .input('enlace_ubicacion', sql.VarChar, enlace_ubicacion) 
                .input('intitucion_propietaria', sql.VarChar, intitucion_propietaria)
                .input('prestamo_iecm', sql.Int, prestamo_iecm)
                .input('nuevo_prestamo', sql.Int, nuevo_prestamo)
                .input('superficie_espacio', sql.Int, superficie_espacio)
                .input('aforo', sql.Int, aforo)
                .input('ventilacion', sql.Int, ventilacion)
                .input('observaciones', sql.VarChar, observaciones)
                .input('usuario_registro', sql.Int, usuario_registro)
                .input('modulo_registro', sql.Int, modulo_registro)
                .input('estado_registro', sql.Int, estado_registro)
                .query(`UPDATE registro_lugares SET
                    distrito_electoral = @distrito_electoral,
                    estado_registro = @estado_registro,
                    demarcacion = @demarcacion,
                    lugar_espacio = @lugar_espacio,
                    domicilio = @domicilio,
                    fotografia = @fotografia,
                    enlace_fotografia = @enlace_fotografia,
                    ubicacion_kml = @ubicacion_kml,
                    enlace_ubicacion = @enlace_ubicacion,
                    intitucion_propietaria = @intitucion_propietaria,
                    prestamo_iecm = @prestamo_iecm,
                    nuevo_prestamo = @nuevo_prestamo,
                    superficie_espacio = @superficie_espacio,
                    aforo = @aforo,
                    ventilacion = @ventilacion,
                    observaciones = @observaciones,
                    usuario_registro = @usuario_registro,
                    modulo_registro = @modulo_registro
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
                INSERT INTO log_registro_lugares (usuario, tipo_usuario, fecha, hora, registro_id, campos_modificados)
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

//consulta tabla registro

router.get("/getLugares", Midleware.verifyToken, async (req, res)=> {

    const {
        distrito_electoral
    }= req.query

    if (!distrito_electoral){
        return res.status(400).json({ message: "Datos requeridos"})
    }

    try {

        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('distrito_electoral', sql.Int, distrito_electoral)
            .query(`select 
                    rl.id as id_registro,
                    rl.fecha_registro,
                    dt.id as id_demarcacion,
                    dt.demarcacion_territorial,
                    rl.lugar_espacio,
                    rl.domicilio,
                    rl.intitucion_propietaria,
                    rl.prestamo_iecm,
                    rl.nuevo_prestamo,
                    rl.superficie_espacio,
                    rl.aforo,
                    rl.ventilacion,
                    rl.observaciones
                    from registro_lugares rl 
                    join demarcacion_territorial dt on rl.demarcacion = dt.id
                    where rl.distrito_electoral = @distrito_electoral;`);
        
        if (result.recordset.length > 0) {
            return res.status(200).json({
                getLugares: result.recordset
            });
        } else {
            return res.status(404).json({ message: "No se encontraron datos" });
        }

    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error de servidor", error: error.message });
    }
});




// consultar registro
router.get("/getRegistroLugares", Midleware.verifyToken, async(req, res)=>{

    const { id } = req.query;

    if(!id){
        return res.status(400).json({ message: "Datos requeridos"})
    }

   
    try {
        
    const pool = await connectToDatabase();
    const result = await pool.request()  
        .input('id', sql.Int, id)
        .query(`select 
                    rl.id as id_registro,
                    rl.consecutivo,                    
                    rl.distrito_electoral,                    
                    rl.fecha_registro,
                    dt.id as id_demarcacion,
                    dt.demarcacion_territorial,                   
                    rl.lugar_espacio,
                    rl.domicilio,
                    rl.ubicacion_kml,
                    rl.enlace_ubicacion,
                    rl.intitucion_propietaria,
                    rl.prestamo_iecm,
                    rl.nuevo_prestamo,
                    rl.superficie_espacio,
                    rl.aforo,
                    rl.ventilacion,
                    rl.observaciones
					from registro_lugares rl 
                    join demarcacion_territorial dt on rl.demarcacion = dt.id 
                    where rl.id = @id;`)

        if (result.recordset.length > 0) {
            return res.status(200).json({
                getRegistroLugares: result.recordset
            });
        } else {
            return res.status(404).json({ message: "No se encontraron registros", code: 100 })
        }

    }catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }

});


export default router;