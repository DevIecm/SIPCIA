import { connectToDatabase, sql } from "../../Config/Configuracion.js";
import Midleware from "../../Config/Midleware.js";
import express from 'express';
import dotenv from 'dotenv';
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storageFotos = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/fotos");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilterFotos = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes PNG, JPG o GIF"));
  }
};

const uploadFoto = multer({ storage: storageFotos, fileFilter: fileFilterFotos });


// registro de Instituciones
router.post("/altaInstituciones", Midleware.verifyToken, uploadFoto.single("fotografia"), async(req, res)=>{

    const {
        distrito_electoral,
        demarcacion_territorial,
        nombre_completo,
        pueblo_originario,
        pueblo,
        barrio,
        unidad_territorial,
        otro,
        comunidad,
        interes_profesional,
        nombre_institucion,
        cargo,
        domicilio,
        telefono,
        correo_electronico,
        usuario_registro,
        modulo_registro,
        estado_registro,
        cv_documento,
        cv_enlace
    } = req.body
   
    const pueblo_originarioInt = pueblo_originario === "" ? null : parseInt(pueblo_originario, 10);
    const puebloInt = pueblo === "" ? null : parseInt(pueblo, 10);
    const barrioInt = barrio === "" ? null : parseInt(barrio, 10);
    const unidad_territorialInt = unidad_territorial === "" ? null : parseInt(unidad_territorial, 10);

            
    if(!demarcacion_territorial ||
        !nombre_completo ||
        !comunidad  ||
        !usuario_registro  ||
        !modulo_registro  ||
        !estado_registro 
    ){
        return res.status(400).json({ message: "Datos requeridos"})
    }

    // fecha y hora
    const original = new Date();
    const offsetInMs = original.getTimezoneOffset() * 60000;
    const fechaLocal = new Date(original.getTime() - offsetInMs);
    const ahora = new Date();
    const horaActual = ahora.toTimeString().split(' ')[0]; // formato HH:MM:SS


  let fotografia = null;

  if (req.file) {
    fotografia = `/uploads/fotos/${req.file.filename}`;
  }


    let transaction;


    try{

        const pool = await connectToDatabase();
        const transaction = pool.transaction();

        await transaction.begin();

        const result = await transaction.request()
        .input('distrito_electoral', sql.Int, distrito_electoral)
        .input('fotografia', sql.VarChar, fotografia)
        .input('demarcacion_territorial', sql.Int, demarcacion_territorial)
        .input('nombre_completo', sql.VarChar, nombre_completo)
        .input('pueblo_originario', sql.Int, pueblo_originarioInt)
        .input('pueblo',sql.Int, puebloInt)
        .input('barrio',sql.Int, barrioInt)
        .input('unidad_territorial', sql.Int, unidad_territorialInt)
        .input('otro', sql.VarChar, otro)
        .input('comunidad',sql.Int, comunidad)
        .input('interes_profesional',sql.VarChar, interes_profesional)
        .input('nombre_institucion', sql.VarChar, nombre_institucion)
        .input('cargo', sql.VarChar, cargo)
        .input('domicilio', sql.VarChar, domicilio)
        .input('telefono', sql.VarChar, telefono)
        .input('correo_electronico', sql.VarChar, correo_electronico)
        .input('fecha_registro', sql.DateTime, fechaLocal)
        .input('hora_registro', sql.VarChar, horaActual)
        .input('usuario_registro', sql.Int, usuario_registro)
        .input('modulo_registro', sql.Int, modulo_registro)
        .input('estado_registro', sql.Int, estado_registro)  
        .input('cv_documento', sql.Int, cv_documento) //0
        .input('cv_enlace', sql.VarChar, cv_enlace)
        .query(`INSERT INTO registro_instituciones (distrito_electoral, fotografia,
            demarcacion_territorial, nombre_completo, pueblo_originario, pueblo, barrio,
            unidad_territorial, otro, comunidad, interes_profesional, nombre_institucion,
            cargo, domicilio, telefono, correo_electronico, fecha_registro, hora_registro, usuario_registro, modulo_registro,
            estado_registro, cv_documento, cv_enlace)
                OUTPUT INSERTED.id
                VALUES (@distrito_electoral, @fotografia,
            @demarcacion_territorial, @nombre_completo, @pueblo_originario, @pueblo, @barrio,
            @unidad_territorial, @otro, @comunidad, @interes_profesional, @nombre_institucion,
            @cargo, @domicilio, @telefono, @correo_electronico, @fecha_registro, @hora_registro, @usuario_registro, @modulo_registro,
            @estado_registro, @cv_documento, @cv_enlace)
            `);

        const insertedId = result.recordset[0].id;

        const camposModificados = JSON.stringify({
            distrito_electoral,
            fotografia,
            demarcacion_territorial,
            nombre_completo,
            pueblo_originario,
            pueblo,
            barrio,
            unidad_territorial,
            otro,
            comunidad,
            interes_profesional,
            nombre_institucion,
            cargo,
            domicilio,
            telefono,
            correo_electronico,
            usuario_registro,
            modulo_registro,
            estado_registro,
            cv_documento,
            cv_enlace
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
                INSERT INTO log_registro_instituciones (usuario, tipo_usuario, fecha, hora, registro_id, campos_modificados)
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

//update instituciones
router.patch("/updateInstituciones", Midleware.verifyToken, uploadFoto.single("fotografia"), async (req, res) => {
    let {
        id_registro,
        distrito_electoral,
        demarcacion_territorial,
        nombre_completo,
        pueblo_originario,
        pueblo,
        barrio,
        unidad_territorial,
        otro,
        comunidad,
        interes_profesional,
        nombre_institucion,
        cargo,
        domicilio,
        telefono,
        correo_electronico,
        usuario_registro,
        modulo_registro,
        estado_registro,
        cv_documento,
        cv_enlace
    } = req.body;

    if (!demarcacion_territorial || !nombre_completo ||  !comunidad ||
        !usuario_registro || !modulo_registro || !estado_registro) {
        return res.status(400).json({ message: "Datos requeridos" });
    }


    try {
        const pool = await connectToDatabase();
        const transaction = pool.transaction();
        await transaction.begin();

        // Obtener registro anterior
        const resultAnterior = await transaction.request()
            .input('id', sql.Int, id_registro)
            .query('SELECT * FROM registro_instituciones WHERE id = @id');

        const registroAnterior = resultAnterior.recordset[0];
        if (!registroAnterior) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        let fotografiaFinal = req.file ? "/uploads/fotos/" + req.file.filename : registroAnterior.fotografia;

        const nuevosDatos = {
            distrito_electoral,
            fotografia: fotografiaFinal,
            demarcacion_territorial,
            nombre_completo,
            pueblo_originario,
            pueblo,
            barrio,
            unidad_territorial,
            otro,
            comunidad,
            interes_profesional,
            nombre_institucion,
            cargo,
            domicilio,
            telefono,
            correo_electronico,
            usuario_registro,
            modulo_registro,
            estado_registro,
            cv_documento,
            cv_enlace
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
        const cambios  = {};
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
                if (intFields.includes(campo)) {
                    requestUpdate.input(campo, sql.Int, valor);
                } else {
                    requestUpdate.input(campo, sql.VarChar, valor);
                }
            }

            await requestUpdate.query(`
                UPDATE registro_instituciones SET
                    distrito_electoral = @distrito_electoral,
                    fotografia = @fotografia,
                    demarcacion_territorial = @demarcacion_territorial,
                    nombre_completo = @nombre_completo,
                    pueblo_originario = @pueblo_originario,
                    pueblo = @pueblo,
                    barrio = @barrio,
                    unidad_territorial = @unidad_territorial,
                    otro = @otro,
                    comunidad = @comunidad,
                    interes_profesional = @interes_profesional,
                    nombre_institucion = @nombre_institucion,
                    cargo = @cargo,
                    domicilio = @domicilio,
                    telefono = @telefono,
                    correo_electronico = @correo_electronico,
                    usuario_registro = @usuario_registro,
                    modulo_registro = @modulo_registro,
                    estado_registro = @estado_registro,
                    cv_documento = @cv_documento,
                    cv_enlace = @cv_enlace
                WHERE id = @id_registro;
            `);
        }

        // Registrar log de cambios
        const original = new Date();
        const offsetInMs = original.getTimezoneOffset() * 60000;
        const fechaLocal = new Date(original.getTime() - offsetInMs);
        const horaActual = new Date().toTimeString().split(' ')[0];

        await transaction.request()
            .input('usuario', sql.Int, usuario_registro)
            .input('tipo_usuario', sql.Int, modulo_registro)
            .input('fecha', sql.Date, fechaLocal)
            .input('hora', sql.VarChar, horaActual)
            .input('registro_id', sql.Int, id_registro)
            .input('campos_modificados', sql.VarChar(sql.MAX), JSON.stringify(cambios))
            .query(`
                INSERT INTO log_registro_instituciones (usuario, tipo_usuario, fecha, hora, registro_id, campos_modificados)
                VALUES (@usuario, @tipo_usuario, @fecha, @hora, @registro_id, @campos_modificados)
            `);

        await transaction.commit();

        return res.status(200).json({
            message: "Registro actualizado correctamente",
            code: 200,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al guardar en BD" });
    }
});



//consulta registros de tabla por distrito

router.get("/getInstituciones", Midleware.verifyToken, async(req, res)=>{

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
                ri.id as id_registro,
                ri.nombre_completo,
                cpo.pueblo_originario,
                cp.pueblo,
                cb.barrio,
                ut.ut,
                ri.otro,
                c.comunidad,
                ri.interes_profesional,
                ri.nombre_institucion,
                ri.cargo,
                ri.cv_documento,
                ri.cv_enlace 
                from registro_instituciones ri
                left join cat_pueblos_originarios cpo on ri.pueblo_originario = cpo.id 
                left join cat_pueblos cp on ri.pueblo  = cp.id
                left join cat_barrios cb  on ri.barrio = cb.id
                left join unidad_territorial ut  on ri.unidad_territorial = ut.id
                join comunidad c on ri.comunidad = c.id
                where ri.distrito_electoral = @distrito_electoral;`);

        if (result.recordset.length > 0) {
            return res.status(200).json({
                getInstituciones: result.recordset
            });
        } else {
            return res.status(404).json({ message: "No se encontraron datos" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error de servidor", error: error.message });
    }
})

router.get("/getRegistroInstituciones", Midleware.verifyToken, async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Se requiere el parámetro 'id'" });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT 
          ri.id AS id_registro,
          ri.fotografia,
          ri.demarcacion_territorial AS id_demarcacion,
          dt.demarcacion_territorial AS demarcacion_territorial,
          ri.nombre_completo,
          ri.pueblo_originario AS id_pueblo_originario,
          cpo.pueblo_originario,
          ri.pueblo AS id_pueblo,
          cp.pueblo,
          ri.barrio AS id_barrio,
          cb.barrio,
          ri.unidad_territorial AS id_unidad_territorial,
          ut.ut,
          ri.otro,
          ri.comunidad AS id_comunidad,
          c.comunidad,
          ri.interes_profesional,
          ri.domicilio,
          ri.telefono,
          ri.nombre_institucion,
          ri.correo_electronico,
          ri.cargo 
        FROM registro_instituciones ri
        JOIN demarcacion_territorial dt ON ri.demarcacion_territorial = dt.id
        LEFT JOIN cat_pueblos_originarios cpo ON ri.pueblo_originario = cpo.id 
        LEFT JOIN cat_pueblos cp ON ri.pueblo = cp.id
        LEFT JOIN cat_barrios cb ON ri.barrio = cb.id 
        LEFT JOIN unidad_territorial ut ON ri.unidad_territorial = ut.id 
        JOIN comunidad c ON ri.comunidad = c.id
        WHERE ri.id = @id;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No se encontraron datos" });
    }

    const registro = result.recordset[0];

    if (registro.fotografia) {
      const dirname = path.dirname(registro.fotografia).replace(/\\/g, "/");
      const basename = path.basename(registro.fotografia);

      registro.fotografia_url =
        `http://145.0.46.49:4000/Services${dirname}/${encodeURIComponent(basename)}`;
    } else {
      registro.fotografia_url = null;
    }

    return res.status(200).json({
      getRegistroInstituciones: [registro],
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});

export default router;