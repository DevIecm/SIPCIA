import { connectToDatabase, sql } from '../Config/Configuracion.js';
import Midleware from '../Config/Midleware.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

//insert de registro
router.post("/altaRegistro", Midleware.verifyToken, async (req, res) => {
    const {
        nombre_completo, seccion_electoral, demarcacion, distrito_electoral, comunidad, nombre_comunidad,
        pueblo_originario, pueblo_pbl, barrio_pbl, unidad_territorial_pbl, comunidad_pbl, otro_pbl, pueblo_afro,
        comunidad_afro, organizacion_afro, persona_relevante_afro, otro_afro, nombre_instancia, cargo_instancia,
        domicilio, telefono_particular, telefono_celular, correo_electronico_oficial, correo_electronico_personal,
        documentos, enlace_documentos, usuario_registro, modulo_registro, estado_registro
    } = req.body;

    // Validación de campos requeridos
    if (
        nombre_completo == null || nombre_completo === '' ||
        seccion_electoral == null || demarcacion == null ||
        distrito_electoral == null || comunidad == null ||
        nombre_comunidad == null || nombre_comunidad === '' ||
        nombre_instancia == null || nombre_instancia === '' ||
        cargo_instancia == null || cargo_instancia === '' ||
        domicilio == null || domicilio === '' ||
        telefono_particular == null || telefono_celular == null ||
        correo_electronico_oficial == null || correo_electronico_oficial === '' ||
        correo_electronico_personal == null || correo_electronico_personal === '' ||
        documentos == null ||
        usuario_registro == null ||
        modulo_registro == null ||
        estado_registro == null
    ) {
        return res.status(400).json({ message: "Datos requeridos" });
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

        // Obtener folio
        const resultadoFolio = await transaction.request().query(`
            SELECT MAX(CAST(RIGHT(folio, 4) AS INT)) AS ultimoFolio
            FROM registro
        `);

        const ultimoFolio = resultadoFolio.recordset[0].ultimoFolio || 0;
        const siguienteFolio = ultimoFolio + 1;
        let primerCaracter = '';
        if (comunidad == 1) {
            primerCaracter = 'CI';
        } else {
            primerCaracter = 'CA';
        }

        const folio = `${primerCaracter}-D-${distrito_electoral}-${siguienteFolio.toString().padStart(4, '0')}`;


        // Insertar en registro
        const result = await transaction.request()
            .input('nombre_completo', sql.VarChar, nombre_completo)
            .input('seccion_electoral', sql.Int, seccion_electoral)
            .input('demarcacion', sql.Int, demarcacion)
            .input('distrito_electoral', sql.Int, distrito_electoral)
            .input('comunidad', sql.Int, comunidad)
            .input('nombre_comunidad', sql.VarChar, nombre_comunidad)
            .input('pueblo_originario', sql.Int, pueblo_originario)
            .input('pueblo_pbl', sql.Int, pueblo_pbl)
            .input('barrio_pbl', sql.Int, barrio_pbl)
            .input('unidad_territorial_pbl', sql.Int, unidad_territorial_pbl)
            .input('comunidad_pbl', sql.VarChar, comunidad_pbl)
            .input('otro_pbl', sql.VarChar, otro_pbl)
            .input('pueblo_afro', sql.VarChar, pueblo_afro)
            .input('comunidad_afro', sql.VarChar, comunidad_afro)
            .input('organizacion_afro', sql.VarChar, organizacion_afro)
            .input('persona_relevante_afro', sql.VarChar, persona_relevante_afro)
            .input('otro_afro', sql.VarChar, otro_afro)
            .input('nombre_instancia', sql.VarChar, nombre_instancia)
            .input('cargo_instancia', sql.VarChar, cargo_instancia)
            .input('domicilio', sql.VarChar, domicilio)
            .input('telefono_particular', sql.Numeric, telefono_particular)
            .input('telefono_celular', sql.Numeric, telefono_celular)
            .input('correo_electronico_oficial', sql.VarChar, correo_electronico_oficial)
            .input('correo_electronico_personal', sql.VarChar, correo_electronico_personal)
            .input('documentos', sql.Int, documentos)
            .input('enlace_documentos', sql.VarChar, enlace_documentos)
            .input('fecha_registro', sql.DateTime, fechaLocal)
            .input('hora_registro', sql.VarChar, horaActual)
            .input('usuario_registro', sql.Int, usuario_registro)
            .input('modulo_registro', sql.Int, modulo_registro)
            .input('estado_registro', sql.Int, estado_registro)
            .input('folio', sql.VarChar, folio)
            .query(`
                    INSERT INTO registro (nombre_completo, seccion_electoral, demarcacion, distrito_electoral, comunidad, nombre_comunidad, pueblo_originario,
                        pueblo_pbl, barrio_pbl, unidad_territorial_pbl, comunidad_pbl, otro_pbl,  pueblo_afro, comunidad_afro, organizacion_afro, persona_relevante_afro, otro_afro, nombre_instancia,
                        cargo_instancia, domicilio, telefono_particular, telefono_celular, correo_electronico_oficial, correo_electronico_personal,
                        documentos, enlace_documentos, fecha_registro, hora_registro, usuario_registro, modulo_registro, estado_registro, folio)
                    OUTPUT INSERTED.id
                    VALUES (@nombre_completo, @seccion_electoral, @demarcacion, @distrito_electoral, @comunidad, @nombre_comunidad, @pueblo_originario,
                        @pueblo_pbl, @barrio_pbl, @unidad_territorial_pbl, @comunidad_pbl, @otro_pbl, @pueblo_afro, @comunidad_afro, @organizacion_afro, @persona_relevante_afro, @otro_afro, @nombre_instancia,
                        @cargo_instancia, @domicilio, @telefono_particular, @telefono_celular, @correo_electronico_oficial,
                        @correo_electronico_personal, @documentos, @enlace_documentos, @fecha_registro, @hora_registro, @usuario_registro, @modulo_registro, @estado_registro, @folio)
                `);

        const insertedId = result.recordset[0].id;

        // Insertar en bitácora
        const camposModificados = JSON.stringify({
            nombre_completo, seccion_electoral, demarcacion, distrito_electoral, comunidad, nombre_comunidad,
            pueblo_originario, pueblo_pbl, barrio_pbl, unidad_territorial_pbl, comunidad_pbl, otro_pbl, pueblo_afro,
            comunidad_afro, organizacion_afro, persona_relevante_afro, otro_afro, nombre_instancia, cargo_instancia,
            domicilio, telefono_particular, telefono_celular, correo_electronico_oficial, correo_electronico_personal,
            documentos, enlace_documentos, modulo_registro, estado_registro
        });

        await transaction.request()
            .input('usuario', sql.Int, usuario_registro)
            .input('tipo_usuario', sql.Int, modulo_registro)
            .input('fecha', sql.Date, fechaLocal)
            .input('hora', sql.VarChar, horaActual)
            .input('registro_id', sql.Int, insertedId)
            .input('campos_modificados', sql.VarChar(sql.MAX), camposModificados)
            .query(`
                INSERT INTO log_registro (usuario, tipo_usuario, fecha, hora, registro_id, campos_modificados)
                VALUES (@usuario, @tipo_usuario, @fecha, @hora, @registro_id, @campos_modificados)
            `);

        // Confirmar la transacción
        await transaction.commit();

        return res.status(200).json({
            message: "Registro creado correctamente",
            id: insertedId,
            folio: folio,
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

//consulta de registro
router.get("/getRegistro", Midleware.verifyToken, async (req, res) => {
    try {
        const { id } = req.query; //pibote por medio del id del usuario registrado

        if(!id){
            return res.status(400).json({ message: "Datos requeridos"})
        }
//agregar los identificadores por si las dudas
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    r.id as id_registro,
                    r.nombre_completo,
                    r.seccion_electoral,
                    dt.id as id_demarcacion_territorial,
                    dt.demarcacion_territorial,
                    cd.id as id_direccion_distrital,
                    cd.direccion_distrital,
                    c.id as id_comunidad,
                    c.comunidad,
                    r.nombre_comunidad,
                    cpo.id as id_pueblo_originario,
                    cpo.pueblo_originario,
                    cp.id as id_pueblo,
                    cp.pueblo,
                    cb.id as id_barrio,
                    cb.barrio,
                    ut.id as id_ut,
                    ut.ut,
                    r.comunidad_pbl,
                    r.otro_pbl,
                    r.pueblo_afro,
                    r.comunidad_afro,
                    r.organizacion_afro,
                    r.persona_relevante_afro,
                    r.otro_afro,
                    r.nombre_instancia,
                    r.cargo_instancia,
                    r.domicilio,
                    r.telefono_particular,
                    r.telefono_celular, 
                    r.correo_electronico_oficial, 
                    r.correo_electronico_personal, 
                    r.documentos, 
                    r.enlace_documentos, 
                    r.fecha_registro, 
                    r.hora_registro,
                    r.usuario_registro,
                    tu.tipo_usuario,
                    er.id as id_estado_registro,
                    er.estado_registro,
                    r.folio
                FROM registro r
                    JOIN demarcacion_territorial as dt on r.demarcacion = dt.id
                    JOIN cat_distrito as cd on r.distrito_electoral = cd.id
                    LEFT JOIN comunidad as c on r.comunidad = c.id
                    LEFT JOIN cat_pueblos_originarios as cpo on r.pueblo_originario = cpo.id
                    LEFT JOIN cat_pueblos as cp on r.pueblo_pbl = cp.id
                    LEFT JOIN cat_barrios as cb on r.barrio_pbl = cb.id
                    LEFT JOIN unidad_territorial as ut on r.unidad_territorial_pbl = ut.id 
                    JOIN usuarios as usu on r.usuario_registro = usu.id
                    JOIN tipo_usuario as tu on r.modulo_registro = tu.id 
                    JOIN estado_registro as er on r.estado_registro = er.id 
                WHERE r.id = @id;`
            )
        if (result.recordset.length > 0) {
            return res.status(200).json({
                getRegistro: result.recordset
            });
        } else {
            return res.status(404).json({ message: "No se encontraron registros", code: 100})
        }
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ message: "Error de servidor", error: error.message0});
    }
});

//actializacion de registro
router.patch("/updateRegistro", Midleware.verifyToken, async (req, res) => {
    

    try {
        const {
            id_registro, nombre_completo, seccion_electoral, demarcacion, distrito_electoral,
            nombre_comunidad, pueblo_originario, pueblo_pbl, barrio_pbl, unidad_territorial_pbl,
            comunidad_pbl, otro_pbl, pueblo_afro, comunidad_afro, organizacion_afro,
            persona_relevante_afro, otro_afro, nombre_instancia, cargo_instancia, domicilio,
            telefono_particular, telefono_celular, correo_electronico_oficial,
            correo_electronico_personal, documentos, enlace_documentos, usuario_registro, modulo_registro, estado_registro
        } = req.body;

        if (
            id_registro == null || id_registro === '' ||
            nombre_completo == null || nombre_completo === '' ||
            seccion_electoral == null || demarcacion == null || distrito_electoral == null ||
            nombre_comunidad == null || nombre_comunidad === '' ||
            nombre_instancia == null || nombre_instancia === '' ||
            cargo_instancia == null || cargo_instancia === '' ||
            domicilio == null || domicilio === '' ||
            telefono_particular == null || telefono_celular == null ||
            correo_electronico_oficial == null || correo_electronico_oficial === '' ||
            correo_electronico_personal == null || correo_electronico_personal === '' ||
            documentos == null || usuario_registro == null ||
            modulo_registro == null || estado_registro == null
        ) {
            return res.status(400).json({ message: "Datos requeridos" });
        }

        const pool = await connectToDatabase();

        // Obtener datos actuales
        const resultAnterior = await pool.request()
            .input('id', sql.Int, id_registro)
            .query('SELECT * FROM registro WHERE id = @id');
        
        const registroAnterior = resultAnterior.recordset[0];


        if (!registroAnterior) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        // Comparar cambios
        const camposAuditables = [
            'nombre_completo', 'seccion_electoral', 'demarcacion', 'distrito_electoral',
            'nombre_comunidad', 'pueblo_originario', 'pueblo_pbl', 'barrio_pbl',
            'unidad_territorial_pbl', 'comunidad_pbl', 'otro_pbl', 'pueblo_afro',
            'comunidad_afro', 'organizacion_afro', 'persona_relevante_afro', 'otro_afro',
            'nombre_instancia', 'cargo_instancia', 'domicilio', 'telefono_particular',
            'telefono_celular', 'correo_electronico_oficial', 'correo_electronico_personal',
            'documentos', 'enlace_documentos', 'usuario_registro', 'modulo_registro', 'estado_registro'
        ];

        const nuevosDatos = {
            nombre_completo, seccion_electoral, demarcacion, distrito_electoral,
            nombre_comunidad, pueblo_originario, pueblo_pbl, barrio_pbl, unidad_territorial_pbl,
            comunidad_pbl, otro_pbl, pueblo_afro, comunidad_afro, organizacion_afro,
            persona_relevante_afro, otro_afro, nombre_instancia, cargo_instancia, domicilio,
            telefono_particular, telefono_celular, correo_electronico_oficial,
            correo_electronico_personal, documentos, enlace_documentos, usuario_registro,
            modulo_registro, estado_registro
        };

        const cambios = {};
        for (const campo of camposAuditables) {
            const valorAnterior = registroAnterior[campo];
            const valorNuevo = nuevosDatos[campo];

            if (valorAnterior != valorNuevo) {
                cambios[campo] = valorNuevo;
                /* 
                cambios[campo] = {
                    antes: valorAnterior,
                    actual: valorNuevo
                };*/
            }
        }
        if (Object.keys(cambios).length > 0) {
            await pool.request()
                .input('id_registro', sql.Int, id_registro)
                .input('nombre_completo', sql.VarChar, nombre_completo)
                .input('seccion_electoral', sql.Int, seccion_electoral)
                .input('demarcacion', sql.Int, demarcacion)
                .input('distrito_electoral', sql.Int, distrito_electoral)
                .input('nombre_comunidad', sql.VarChar, nombre_comunidad)
                .input('pueblo_originario', sql.Int, pueblo_originario)
                .input('pueblo_pbl', sql.Int, pueblo_pbl)
                .input('barrio_pbl', sql.Int, barrio_pbl)
                .input('unidad_territorial_pbl', sql.Int, unidad_territorial_pbl)
                .input('comunidad_pbl', sql.VarChar, comunidad_pbl)
                .input('otro_pbl', sql.VarChar, otro_pbl)
                .input('pueblo_afro', sql.VarChar, pueblo_afro)
                .input('comunidad_afro', sql.VarChar, comunidad_afro)
                .input('organizacion_afro', sql.VarChar, organizacion_afro)
                .input('persona_relevante_afro', sql.VarChar, persona_relevante_afro)
                .input('otro_afro', sql.VarChar, otro_afro)
                .input('nombre_instancia', sql.VarChar, nombre_instancia)
                .input('cargo_instancia', sql.VarChar, cargo_instancia)
                .input('domicilio', sql.VarChar, domicilio)
                .input('telefono_particular', sql.Numeric, telefono_particular)
                .input('telefono_celular', sql.Numeric, telefono_celular)
                .input('correo_electronico_oficial', sql.VarChar, correo_electronico_oficial)
                .input('correo_electronico_personal', sql.VarChar, correo_electronico_personal)
                .input('documentos', sql.Int, documentos)
                .input('enlace_documentos', sql.VarChar, enlace_documentos)
                .input('usuario_registro', sql.Int, usuario_registro)
                .input('modulo_registro', sql.Int, modulo_registro)
                .input('estado_registro', sql.Int, estado_registro)
                .query(`UPDATE registro SET
                    nombre_completo = @nombre_completo,
                    seccion_electoral = @seccion_electoral,
                    demarcacion = @demarcacion,
                    distrito_electoral = @distrito_electoral,
                    nombre_comunidad = @nombre_comunidad,
                    pueblo_originario = @pueblo_originario,
                    pueblo_pbl = @pueblo_pbl,
                    barrio_pbl = @barrio_pbl,
                    unidad_territorial_pbl = @unidad_territorial_pbl,
                    comunidad_pbl = @comunidad_pbl,
                    otro_pbl = @otro_pbl,
                    pueblo_afro = @pueblo_afro,
                    comunidad_afro = @comunidad_afro,
                    organizacion_afro = @organizacion_afro,
                    persona_relevante_afro = @persona_relevante_afro,
                    otro_afro = @otro_afro,
                    nombre_instancia = @nombre_instancia,
                    cargo_instancia = @cargo_instancia,
                    domicilio = @domicilio,
                    telefono_particular = @telefono_particular,
                    telefono_celular = @telefono_celular,
                    correo_electronico_oficial = @correo_electronico_oficial,
                    correo_electronico_personal = @correo_electronico_personal,
                    documentos = @documentos,
                    enlace_documentos = @enlace_documentos,
                    usuario_registro = @usuario_registro,
                    modulo_registro = @modulo_registro,
                    estado_registro = @estado_registro
                    WHERE id = @id_registro;
                `);

                // Fecha y hora
                const original = new Date();
                const offsetInMs = original.getTimezoneOffset() * 60000;
                const fechaLocal = new Date(original.getTime() - offsetInMs);
                const ahora = new Date();
                const horaActual = ahora.toTimeString().split(' ')[0]; // formato HH:MM:SS
                
                const camposModificados = JSON.stringify(cambios);

            await pool.request()
                .input('usuario', sql.Int, usuario_registro)
                .input('tipo_usuario', sql.Int, modulo_registro)
                .input('fecha', sql.Date, fechaLocal)
                .input('hora', sql.VarChar, horaActual)
                .input('registro_id', sql.Int, id_registro)
                .input('campos_modificados', sql.VarChar(sql.MAX), camposModificados)
                .query(`
                    INSERT INTO log_registro (usuario, tipo_usuario, fecha, hora, registro_id, campos_modificados)
                    VALUES (@usuario, @tipo_usuario, @fecha, @hora, @registro_id, @campos_modificados)
                `);
        } 

        return res.status(200).json({ message: "Registro actualizado correctamente", code: 200 });

    } catch (err) {
        console.error(err);
        console.error("ERROR:", err.message);
        console.error("STACK:", err.stack);

        return res.status(500).json({ message: "Error de servidor", err });
    }
});

export default router;