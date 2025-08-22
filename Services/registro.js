import { connectToDatabase, sql } from '../Config/Configuracion.js';
import Midleware from '../Config/Midleware.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

//insert de registro
router.post("/altaRegistro", Midleware.verifyToken, async (req, res) => {
    try{
         // Todos los campos del formulario (los que esperas recibir del front)
        const {nombre_completo, seccion_electoral, demarcacion, distrito_electoral, comunidad, nombre_comunidad,
            pueblo_originario, pueblo_pbl, barrio_pbl, unidad_territorial_pbl, comunidad_pbl, otro_pbl, pueblo_afro,
            comunidad_afro, organizacion_afro, persona_relevante_afro, otro_afro, nombre_instancia, cargo_instancia,
            domicilio, telefono_particular, telefono_celular, correo_electronico_oficial, correo_electronico_personal,
            documentos, enlace_documentos, fecha_registro, usuario_registro, modulo_registro, estado_registro
            } = req.body;



        if(!nombre_completo ||!seccion_electoral || !demarcacion|| !distrito_electoral|| !comunidad|| !nombre_comunidad|| !nombre_instancia 
            || !cargo_instancia || !domicilio || !telefono_particular || !telefono_celular || !correo_electronico_oficial || !correo_electronico_personal || !documentos 
            || !usuario_registro || !modulo_registro || !estado_registro){
            return res.status(400).json({ message: "Datos requeridos"})
        } 

        //fecha
        const original = new Date(fecha_registro);
        const offsetInMs = original.getTimezoneOffset() * 60000;
        const fechaLocal = new Date(original.getTime() - offsetInMs);
        
        //hora
        const ahora = new Date();
        const horas = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        const segundos = ahora.getSeconds().toString().padStart(2, '0');
        const horaActual = `${horas}:${minutos}:${segundos}`;

        const pool = await connectToDatabase();

        //se tiene que generar un folio consecutivo para guardar despues del guardado el folo se regresa como respuesta 
        const resultadoFolio = await pool.request().query(`
        SELECT MAX(CAST(SUBSTRING(folio, 6, LEN(folio)) AS INT)) AS ultimoFolio
        FROM registro
        `);

        const ultimoFolio = resultadoFolio.recordset[0].ultimoFolio || 0;
        const siguienteFolio = ultimoFolio + 1;
        const folio = `FOLIO${siguienteFolio.toString().padStart(4, '0')}`;

        const result = await pool.request()
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
            .query(`INSERT INTO registro (nombre_completo, seccion_electoral, demarcacion, distrito_electoral, comunidad, nombre_comunidad, pueblo_originario,
                pueblo_pbl, barrio_pbl, unidad_territorial_pbl, comunidad_pbl, otro_pbl,  pueblo_afro, comunidad_afro, organizacion_afro, persona_relevante_afro, otro_afro, nombre_instancia,
                cargo_instancia, domicilio, telefono_particular, telefono_celular, correo_electronico_oficial, correo_electronico_personal,
                documentos, enlace_documentos, fecha_registro, hora_registro, usuario_registro, modulo_registro, estado_registro, folio)
                VALUES (@nombre_completo, @seccion_electoral, @demarcacion, @distrito_electoral, @comunidad, @nombre_comunidad, @pueblo_originario,
                @pueblo_pbl, @barrio_pbl, @unidad_territorial_pbl, @comunidad_pbl, @otro_pbl, @pueblo_afro, @comunidad_afro, @organizacion_afro, @persona_relevante_afro, @otro_afro, @nombre_instancia,
                @cargo_instancia, @domicilio, @telefono_particular, @telefono_celular, @correo_electronico_oficial,
                @correo_electronico_personal, @documentos, @enlace_documentos, @fecha_registro, @hora_registro, @usuario_registro, @modulo_registro, @estado_registro, @folio)`);
 
        //const insertedId = result.recordset[0].id;

        return res.status(201).json({
        message: 'Registro exitoso',
        folio: folio
        }); 
        
        /*return res.status(200).json({
        message: "Registro creado correctamente",
        id: insertedId,
        code: 200,
        });*/
            
    } catch(err) {
        console.error(err);
        return res.status(500).json({ message: "Error de servidor", err})
    }
});



//consulta de registro falta regresar id del registro
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
                    r.id,
                    r.nombre_completo,
                    cs.seccion_electoral,
                    dt.id,
                    dt.demarcacion_territorial,
                    cd.id,
                    cd.direccion_distrital,
                    c.id,
                    c.comunidad,
                    r.nombre_comunidad,
                    cpo.id,
                    cpo.pueblo_originario,
                    cp.id,
                    cp.pueblo,
                    cb.id,
                    cb.barrio,
                    ut.id,
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
                    er.id,
                    er.estado_registro,
                    r.folio
                FROM registro r 
                    JOIN cat_seccion cs on r.seccion_electoral = cs.seccion_electoral
                    JOIN demarcacion_territorial as dt on r.demarcacion = dt.id
                    JOIN cat_distrito as cd on r.distrito_electoral = cd.id
                    JOIN comunidad as c on r.comunidad = c.id
                    JOIN cat_pueblos_originarios as cpo on r.pueblo_originario = cpo.id
                    JOIN cat_pueblos as cp on r.pueblo_pbl = cp.id
                    JOIN cat_barrios as cb on r.barrio_pbl = cb.id
                    JOIN unidad_territorial as ut on r.unidad_territorial_pbl = ut.id 
                    JOIN usuarios as usu on r.usuario_registro = usu.id
                    JOIN tipo_usuario as tu on r.modulo_registro = tu.id 
                    JOIN estado_registro as er on r.estado_registro = er.id 
                WHERE usu.id = @id;`
            )
        if (result.recordset.length > 0) {
            return res.status(200).json({
                registrosProyectos: result.recordset
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

        const { id_registro, nombre_completo, seccion_electoral, demarcacion,
            distrito_electoral, nombre_comunidad, pueblo_originario, pueblo_pbl, 
            barrio_pbl, unidad_territorial_pbl, comunidad_pbl, otro_pbl, pueblo_afro,
            comunidad_afro, organizacion_afro, persona_relevante_afro, otro_afro,
            nombre_instancia, cargo_instancia, domicilio, telefono_particular, telefono_celular,
            correo_electronico_oficial, correo_electronico_personal, documentos, enlace_documentos,
            fecha_registro, hora_registro, usuario_registro, modulo_registro, estado_registro
         } = req.body;

         //fecha
        const original = new Date(fecha_registro);
        const offsetInMs = original.getTimezoneOffset() * 60000;
        const fechaLocal = new Date(original.getTime() - offsetInMs);
        
        //hora
        const ahora = new Date();
        const horas = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        const segundos = ahora.getSeconds().toString().padStart(2, '0');
        const horaActual = `${horas}:${minutos}:${segundos}`;

        if (!id_registro || !nombre_completo || !seccion_electoral || !demarcacion || !distrito_electoral || !nombre_comunidad || !nombre_instancia
            || !cargo_instancia || !domicilio || !telefono_particular || !telefono_celular || !correo_electronico_oficial || !correo_electronico_personal || !documentos
            || !usuario_registro || !modulo_registro || !estado_registro) {
            return res.status(400).json({ message: "Datos requeridos" })
        }

        const pool = await connectToDatabase();
        const result = await pool.request()
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
            .input('fecha_registro', sql.DateTime, fechaLocal)
            .input('hora_registro', sql.VarChar, horaActual)
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
                fecha_registro = @fecha_registro,
                hora_registro = @hora_registro,
                usuario_registro = @usuario_registro,
                modulo_registro = @modulo_registro,
                estado_registro = @estado_registro
                WHERE id = @id_registro;
            `);

        
            return res.status(200).json({ message: "Registro actualizado correctamente", code: 200 });

    } catch(err) {
        console.error(err);
        return res.status(500).json({ message: "Error de servidor", err})
    }
});



export default router;