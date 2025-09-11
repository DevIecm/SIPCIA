import { connectToDatabase, sql } from "../../Config/Configuracion.js";
import Midleware from "../../Config/Midleware.js";
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

//insert de registro 
router.post("/altaAfluencia", Midleware.verifyToken, async (req, res) => {

    const {
        distrito_electoral,
        distrito_cabecera,
        demarcacion_territorial,
        denominacion_lugar,
        domicilio_lugar,
        foto,
        enlace_foto,
        ubicacion,
        enlace_ubicacion,
        observaciones,
        usuario_registro,
        modulo_registro,
        estado_registro
    } = req.body;

    if (distrito_electoral == null || distrito_electoral === '' ||
        distrito_cabecera == null || 
        demarcacion_territorial == null || 
        denominacion_lugar == null || 
        domicilio_lugar == null || 
        foto == null || 
        ubicacion == null || ubicacion === '' ||
        usuario_registro == null || 
        modulo_registro == null || 
        estado_registro == null) {
        return res.status(400).json({ message: "Datos requeridos" })
    }

    // Fecha y hora
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

        const result = await transaction.request()
            .input('distrito_electoral', sql.Int, distrito_electoral)
            .input('distrito_cabecera', sql.Int, distrito_cabecera)
            .input('demarcacion_territorial', sql.Int, demarcacion_territorial)
            .input('denominacion_lugar', sql.VarChar, denominacion_lugar)
            .input('domicilio_lugar', sql.VarChar, domicilio_lugar)
            .input('foto', sql.Int, foto) //mandar  0
            .input('enlace_foto', sql.VarChar, enlace_foto)
            .input('ubicacion', sql.Int, ubicacion) //mandar  0
            .input('enlace_ubicacion', sql.VarChar, enlace_ubicacion)
            .input('observaciones', sql.VarChar, observaciones)
            .input('fecha_registro', sql.DateTime, fechaLocal)
            .input('hora_registro', sql.VarChar, horaActual)
            .input('usuario_registro', sql.Int, usuario_registro)
            .input('modulo_registro', sql.Int, modulo_registro)
            .input('estado_registro', sql.Int, estado_registro)
            .query(`INSERT INTO registro_afluencia (distrito_electoral, distrito_cabecera, demarcacion_territorial, denominacion_lugar, 
                domicilio_lugar, foto, enlace_foto, ubicacion, enlace_ubicacion, observaciones, fecha_registro, hora_registro, usuario_registro,
                modulo_registro, estado_registro) 
                OUTPUT INSERTED.id
                VALUES (@distrito_electoral, @distrito_cabecera, @demarcacion_territorial, @denominacion_lugar, @domicilio_lugar, @foto, 
                @enlace_foto, @ubicacion, @enlace_ubicacion, @observaciones, @fecha_registro, @hora_registro, @usuario_registro, @modulo_registro, @estado_registro)
                `);

        const insertedId = result.recordset[0].id;


        const camposModificados = JSON.stringify({
            distrito_electoral,
            distrito_cabecera,
            demarcacion_territorial,
            denominacion_lugar,
            domicilio_lugar,
            foto,
            enlace_foto,
            ubicacion,
            enlace_ubicacion,
            observaciones,
            usuario_registro,
            modulo_registro,
            estado_registro
        });


        await transaction.request()
            .input('usuario', sql.Int, usuario_registro)
            .input('tipo_usuario', sql.Int, modulo_registro)
            .input('fecha', sql.Date, fechaLocal)
            .input('hora', sql.VarChar, horaActual)
            .input('registro_id', sql.Int, insertedId)
            .input('campos_modificados', sql.VarChar(sql.MAX), camposModificados)
            .query(`
                INSERT INTO log_registro_afluencia (usuario, tipo_usuario, fecha, hora, registro_id, campos_modificados)
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


//update del registro
router.patch("/updateAfluencia", Midleware.verifyToken, async (req, res) => {

    const {
        id_registro,
        distrito_electoral,
        distrito_cabecera,
        demarcacion_territorial,
        denominacion_lugar,
        domicilio_lugar,
        foto,
        enlace_foto,
        ubicacion,
        enlace_ubicacion,
        observaciones,
        usuario_registro,
        modulo_registro,
        estado_registro
    } = req.body;

    if (id_registro == null || id_registro === '' ||
        distrito_electoral == null || distrito_electoral === '' ||
        distrito_cabecera == null ||
        demarcacion_territorial == null ||
        denominacion_lugar == null ||
        domicilio_lugar == null ||
        foto == null ||
        ubicacion == null ||
        usuario_registro == null ||
        modulo_registro == null ||
        estado_registro == null) {
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
            .query('SELECT * FROM registro_afluencia WHERE id = @id');

        const registroAnterior = resultAnterior.recordset[0];

        if (!registroAnterior) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        //comparar
        const camposEditables = [
            "distrito_electoral",
            "distrito_cabecera",
            "demarcacion_territorial",
            "denominacion_lugar",
            "domicilio_lugar",
            "foto",
            "enlace_foto",
            "ubicacion",
            "enlace_ubicacion",
            "observaciones",
            "usuario_registro",
            "modulo_registro",
            "estado_registro"
        ];

        const nuevosDatos = {
            distrito_electoral,
            distrito_cabecera,
            demarcacion_territorial,
            denominacion_lugar,
            domicilio_lugar,
            foto,
            enlace_foto,
            ubicacion,
            enlace_ubicacion,
            observaciones,
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
                .input('distrito_cabecera', sql.Int, distrito_cabecera)
                .input('demarcacion_territorial', sql.Int, demarcacion_territorial)
                .input('denominacion_lugar', sql.VarChar, denominacion_lugar)
                .input('domicilio_lugar', sql.VarChar, domicilio_lugar)
                .input('foto', sql.Int, foto)
                .input('enlace_foto', sql.VarChar, enlace_foto)
                .input('ubicacion', sql.Int, ubicacion)
                .input('enlace_ubicacion', sql.VarChar, enlace_ubicacion)
                .input('observaciones', sql.VarChar, observaciones)
                .input('usuario_registro', sql.Int, usuario_registro)
                .input('modulo_registro', sql.Int, modulo_registro)
                .input('estado_registro', sql.Int, estado_registro)
                .query(`UPDATE registro_afluencia SET
                    distrito_electoral = @distrito_electoral,
                    distrito_cabecera = @distrito_cabecera,
                    demarcacion_territorial = @demarcacion_territorial,
                    denominacion_lugar = @denominacion_lugar,
                    domicilio_lugar = @domicilio_lugar,
                    foto = @foto,
                    enlace_foto = @enlace_foto,
                    ubicacion = @ubicacion,
                    enlace_ubicacion = @enlace_ubicacion,
                    observaciones = @observaciones,
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
                INSERT INTO log_registro_afluencia (usuario, tipo_usuario, fecha, hora, registro_id, campos_modificados)
                VALUES (@usuario, @tipo_usuario, @fecha, @hora, @registro_id, @campos_modificados)
            `);

        // Confirmar la transacción
        await transaction.commit();

        return res.status(200).json({
            message: "Registro actualiazado correctamente",
            code: 200,
        });

    } catch (err) {
        console.error("Error en Registro:", err);
        if (transaction) {
            await transaction.rollback();
        }
        return res.status(500).json({ message: "Error al actualizar el registro", error: err.message });
    }
});



//consulta tabla registro afluencia
router.get("/getAfluencia", Midleware.verifyToken, async (req, res) => {

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
                    ra.id as id_registro,
                    cd.id as direccion_distrital,
                    ra.distrito_cabecera,
                    dt.demarcacion_territorial,
                    ra.denominacion_lugar,
                    ra.domicilio_lugar,
                    ra.ubicacion,
                    ra.enlace_ubicacion,
                    ra.foto,
                    ra.enlace_foto,
                    ra.observaciones,
                    ra.fecha_registro
                    from registro_afluencia ra 
                    join cat_distrito cd on ra.distrito_electoral = cd.id 
                    join demarcacion_territorial dt on ra.demarcacion_territorial = dt.id
                    where ra.distrito_electoral = @distrito_electoral;`);

        if (result.recordset.length > 0) {
            return res.status(200).json({
                getAfluencia: result.recordset
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
router.get("/getRegistroAfluencia", Midleware.verifyToken, async (req, res) => {

    const { id } = req.query; 

        if(!id){
            return res.status(400).json({ message: "Datos requeridos"})
        }
        
        try {

            const pool = await connectToDatabase();

            const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`select 
                ra.distrito_electoral,
                ra.demarcacion_territorial,
                ra.distrito_cabecera,
                ra.denominacion_lugar,
                ra.domicilio_lugar,
                ra.foto,
                ra.enlace_foto,
                ra.modulo_registro,
                ra.usuario_registro,
                ra.hora_registro,
                ra.fecha_registro,
                ra.enlace_ubicacion,
                ra.ubicacion,
                ra.observaciones,
                ra.estado_registro
                from registro_afluencia ra
                join cat_distrito cd on ra.distrito_electoral = cd.id
                join demarcacion_territorial dt on ra.demarcacion_territorial = dt.id
                join usuarios u on ra.usuario_registro = u.id
                join tipo_usuario tu on ra.modulo_registro = tu.id
                join estado_registro er on ra.estado_registro =  er.id
                where ra.id =@id;
                `)
        
        if (result.recordset.length > 0) {
            return res.status(200).json({
                getRegistroAfluencia: result.recordset
            });
        } else {
            return res.status(404).json({ message: "No se encontraron registros", code: 100})
        }
        }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error de servidor", error: error.message });
    }
});


export default router;