import { connectToDatabase, sql } from "../../Config/Configuracion.js";
import Midleware from "../../Config/Midleware.js";
import express from 'express';
import dotenv from 'dotenv';
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath;

        if (file.originalname.toLowerCase().endsWith(".kml")) {
            uploadPath = path.join(__dirname, "../uploads/kml");
        } else if (file.originalname.toLowerCase().endsWith(".zip")) {
            uploadPath = path.join(__dirname, "../uploads/zip");
        } else {
            return cb(new Error("Tipo de archivo no permitido"), null);
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });



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
router.post("/altaAtencion", Midleware.verifyToken, upload.fields([{ name: "kmlFile", maxCount: 1 }]), async (req, res) => {

    let {
        distrito_electoral,
        numero_reporte,
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

    const pueblo_originarioInt = pueblo_originario === "" ? null : parseInt(pueblo_originario, 10);
    const puebloInt = pueblo === "" ? null : parseInt(pueblo, 10);
    const barrioInt = barrio === "" ? null : parseInt(barrio, 10);
    const unidad_territorialInt = unidad_territorial === "" ? null : parseInt(unidad_territorial, 10);

    if (
        distrito_electoral == null || distrito_electoral === '' ||
        presento_caso == null || presento_caso === '' ||
        numero_reporte == null || numero_reporte === '' ||
        fecha_consulta == null || fecha_consulta === '' ||
        usuario_registro == null || usuario_registro === '' ||
        modulo_registro == null || modulo_registro === '' ||
        estado_registro == null || estado_registro === ''
    ) {
        return res.status(400).json({ message: "Datos requeridos" })
    }

    const kmlFile = req.files["kmlFile"] ? req.files["kmlFile"][0] : null;

    documento = kmlFile ? 1 : 0;
    enlace_documento = kmlFile ? `/uploads/zip/${kmlFile.filename}` : null;


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
            .input('numero_reporte', sql.Int, numero_reporte)
            .input('presento_caso', sql.Int, presento_caso)
            .input('numero_consecutivo', sql.Numeric, numero_consecutivo)
            .input('fecha_consulta', sql.DateTime, fecha_consulta)
            .input('nombre_completo', sql.VarChar, nombre_completo)
            .input('pueblo_originario', sql.Int, pueblo_originarioInt)
            .input('pueblo', sql.Int, puebloInt)
            .input('barrio', sql.Int, barrioInt)
            .input('unidad_territorial', sql.Int, unidad_territorialInt)
            .input('otro', sql.VarChar, otro)
            .input('cargo', sql.VarChar, cargo)
            .input('descripcion_consulta', sql.VarChar, descripcion_consulta)
            .input('forma_atendio', sql.VarChar, forma_atendio)
            .input('observaciones', sql.VarChar, observaciones)
            .input('documento', sql.Int, documento)
            .input('enlace_documento', sql.VarChar, enlace_documento)
            .input('fecha_registro', sql.DateTime, fechaLocal)
            .input('hora_registro', sql.VarChar, horaActual)
            .input('usuario_registro', sql.Int, usuario_registro)
            .input('modulo_registro', sql.Int, modulo_registro)
            .input('estado_registro', sql.Int, estado_registro)
            .query(`INSERT INTO atencion_consultas (distrito_electoral, numero_reporte, presento_caso, numero_consecutivo, 
                fecha_consulta, nombre_completo, pueblo_originario, pueblo, barrio, unidad_territorial, otro, cargo, descripcion_consulta,
                forma_atendio, observaciones, documento, enlace_documento, fecha_registro, hora_registro, usuario_registro, modulo_registro, 
                estado_registro)
                OUTPUT INSERTED.id
                VALUES (@distrito_electoral, @numero_reporte, @presento_caso, @numero_consecutivo, 
                @fecha_consulta, @nombre_completo, @pueblo_originario, @pueblo, @barrio, @unidad_territorial, @otro, @cargo, @descripcion_consulta,
                @forma_atendio, @observaciones, @documento, @enlace_documento, @fecha_registro, @hora_registro, @usuario_registro, @modulo_registro, 
                @estado_registro);
                `);

        const insertedId = result.recordset[0].id;


        const camposModificados = JSON.stringify({
            distrito_electoral,
            numero_reporte,
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

    } catch (err) {
        console.error("Error en Registro:", err);
        if (transaction) {
            await transaction.rollback();
        }
        return res.status(500).json({ message: "Error al guardar el registro", error: err.message });
    }
});


//update del registro
router.patch("/updateAntencion", Midleware.verifyToken, upload.fields([{ name: "kmlFile", maxCount: 1 }]), async (req, res) => {

    let {
        id_registro,
        distrito_electoral,
        numero_reporte,
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
        distrito_electoral == null || distrito_electoral === '' ||
        presento_caso == null || presento_caso === '' ||
        numero_reporte == null || numero_reporte === '' ||
        fecha_consulta == null || fecha_consulta === '' ||
        usuario_registro == null || usuario_registro === '' ||
        modulo_registro == null || modulo_registro === '' ||
        estado_registro == null || estado_registro === ''
    ) {
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
            .query('SELECT * FROM atencion_consultas WHERE id = @id');

        const registroAnterior = resultAnterior.recordset[0];

        if (!registroAnterior) {
            return res.status(200).json({ message: "Registro no encontrado" });
        }

        if (req.files && req.files.kmlFile && req.files.kmlFile[0]) {
            enlace_documento = `/uploads/zip/${req.files.kmlFile[0].filename}`;
            documento = 1;
        } else {
            enlace_documento = registroAnterior.enlace_documento;
            documento = registroAnterior.enlace_documento ? 1 : 0;
        }

        documento = documento ? 1 : 0;


        const nuevosDatos = {
            distrito_electoral,
            numero_reporte,
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

        // Campos que son enteros en la BD
        const intFields = [
            'pueblo_originario', 'pueblo', 'barrio', 'unidad_territorial'
        ];

        for (const campo of intFields) {
            if (nuevosDatos[campo] === "" || nuevosDatos[campo] == null) {
                nuevosDatos[campo] = null;
            } else {
                nuevosDatos[campo] = parseInt(nuevosDatos[campo], 10);
            }
        }

        // cambios
        const cambios = {};
        for (const campo of Object.keys(nuevosDatos)) {
            if (registroAnterior[campo] != nuevosDatos[campo]) {
                cambios[campo] = nuevosDatos[campo];
            }
        }

        // Actualizar solo si hay cambios
        if (Object.keys(cambios).length > 0) {
            const requestUpdate = transaction.request();
            requestUpdate.input('id_registro', sql.Int, id_registro);

            for (const [campo, valor] of Object.entries(nuevosDatos)) {
                if (intFields.includes(campo) || campo === "documento") {
                    requestUpdate.input(campo, sql.Int, valor);
                } else {
                    requestUpdate.input(campo, sql.VarChar, valor ?? "");
                }
            }

            await requestUpdate.query(`UPDATE atencion_consultas SET
                        distrito_electoral = @distrito_electoral,
                        numero_reporte = @numero_reporte,
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
    } catch (err) {
        console.error("Error en Registro:", err);
        if (transaction) {
            await transaction.rollback();
        }
        return res.status(500).json({ message: "Error al actualizar el registro", error: err.message });
    }
});


//consulta tabla registro atencion consultas
router.get("/getAtencion", Midleware.verifyToken, async (req, res) => {

    const {
        distrito_electoral
    } = req.query

    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('distrito_electoral', sql.Int, distrito_electoral)
            .query(`select 
                ac.id as id_registro,
                ac.distrito_electoral,
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
                left join cat_pueblos_originarios cpo on ac.pueblo_originario = cpo.id 
                left join cat_pueblos cp on ac.pueblo = cp.id 
                left join cat_barrios cb on ac.barrio = cb.id 
                left join unidad_territorial ut on ac.unidad_territorial = ut.id
                where (ac.modulo_registro = 1${distrito_electoral ? ' AND ac.distrito_electoral = @distrito_electoral' : ''} and ac.estado_registro<>4);
            `);

        if (result.recordset.length > 0) {
            const data = result.recordset.map(item => {
                let nombreUbicacion = null;
                let nombreUbicacionLimpio = null;

                if (item.enlace_documento) {
                    nombreUbicacion = path.basename(item.enlace_documento);
                    const guionIndex = nombreUbicacion.indexOf("-");
                    nombreUbicacionLimpio = guionIndex > -1
                        ? nombreUbicacion.substring(guionIndex + 1)
                        : nombreUbicacion;
                }

                return {
                    ...item,
                    enlace_documento: nombreUbicacion,
                    nombre_archivo: nombreUbicacionLimpio
                };
            });

            return res.status(200).json({ getAtencion: data });
        } else {
            return res.status(200).json({ message: "No se encontraron datos" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error de servidor", error: error.message });
    }

});



// consulta por registro
router.get("/getRegistroAtencion", Midleware.verifyToken, async (req, res) => {

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: "Datos requeridos" })
    }


    let transaction;

    try {

        const pool = await connectToDatabase();
        const transaction = pool.transaction();

        await transaction.begin();

        const result = await transaction.request()
            .input('id', sql.Int, id)
            .query(`select 
                    ac.distrito_electoral,
                    ac.id as id_registro,
                    ac.numero_reporte,
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
            return res.status(200).json({ message: "No se encontraron registros", code: 100 })
        }

    } catch (err) {
        console.error("Error en la consulta:", err);
        if (transaction) {
            await transaction.rollback();
        }
        return res.status(500).json({ message: "Error al consultar", error: err.message });
    }
});

/// elimiacion logica de registro
router.patch("/eliminarRegistro", Midleware.verifyToken, async (req, res) => {

    const { id } = req.body;

    if (id == null) {
        return res.status(400), json({ message: "EL campo es requerido" })
    }

    let transaction;

    try {
        const pool = await connectToDatabase();
        transaction = pool.transaction();
        await transaction.begin();

        await transaction.request()
            .input('id', sql.Int, id)
            .query(`
                UPDATE atencion_consultas
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