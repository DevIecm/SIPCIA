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

//insert de registro 
router.post("/altaAfluencia", Midleware.verifyToken, upload.fields([{ name: "kmlFile", maxCount: 1 }, { name: "otroFile", maxCount: 1 }]), async (req, res) => {

  let {
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

  console.log(distrito_electoral,  
    distrito_cabecera, 
    demarcacion_territorial,
    denominacion_lugar,
    domicilio_lugar,
    usuario_registro,
    modulo_registro,
    estado_registro);

  if (distrito_electoral == null || distrito_electoral === '' ||
    distrito_cabecera == null ||
    demarcacion_territorial == null ||
    denominacion_lugar == null ||
    domicilio_lugar == null ||
    usuario_registro == null ||
    modulo_registro == null ||
    estado_registro == null) {
    return res.status(400).json({ message: "Datos requeridos" })
  }


  const kmlFile = req.files["kmlFile"] ? req.files["kmlFile"][0] : null;
  const zipFile = req.files["otroFile"] ? req.files["otroFile"][0] : null;

  //foto zip    
  foto = zipFile ? 1 : 0;
  enlace_foto = zipFile ? `/uploads/zip/${zipFile.filename}` : null;

  //kml ubicacion
  ubicacion = kmlFile ? 1 : 0;
  enlace_ubicacion = kmlFile ? `/uploads/kml/${kmlFile.filename}` : null;




  // Fecha y hora
  const original = new Date();
  const offsetInMs = original.getTimezoneOffset() * 60000;
  const fechaLocal = new Date(original.getTime() - offsetInMs);
  const ahora = new Date();
  const horaActual = ahora.toTimeString().split(' ')[0];

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
    console.error(err);
    res.status(500).json({ message: "Error al guardar en BD" });
  }
});


//update del registro
router.patch("/updateAfluencia", Midleware.verifyToken, upload.fields([{ name: "kmlFile", maxCount: 1 }, { name: "otroFile", maxCount: 1 }]), async (req, res) => {
  let {
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

  if (
    id_registro == null || id_registro === '' ||
    distrito_electoral == null || distrito_electoral === '' ||
    distrito_cabecera == null ||
    demarcacion_territorial == null ||
    denominacion_lugar == null ||
    domicilio_lugar == null ||
    usuario_registro == null ||
    modulo_registro == null ||
    estado_registro == null
  ) {
    return res.status(400).json({ message: "Datos requeridos" });
  }

  try {
    const pool = await connectToDatabase();
    const transaction = pool.transaction();

    await transaction.begin();

    const resultAnterior = await transaction.request()
      .input('id', sql.Int, id_registro)
      .query('SELECT * FROM registro_afluencia WHERE id = @id');

    const registroAnterior = resultAnterior.recordset[0];

    if (!registroAnterior) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    if (req.files && req.files.kmlFile && req.files.kmlFile[0]) {
      enlace_ubicacion = `/uploads/kml/${req.files.kmlFile[0].filename}`;
      ubicacion = 1;
    } else {
      enlace_ubicacion = registroAnterior.enlace_ubicacion;
      ubicacion = registroAnterior.enlace_ubicacion ? 1 : 0;
    }

    let enlace_foto;
    if (req.files && req.files.otroFile && req.files.otroFile[0]) {
      enlace_foto = `/uploads/zip/${req.files.otroFile[0].filename}`;
    } else {
      enlace_foto = registroAnterior.enlace_foto;
    }


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
    console.error(err);
    res.status(500).json({ message: "Error al guardar en BD" });
  }
});


//consulta tabla registro afluencia
router.get("/getAfluencia", Midleware.verifyToken, async (req, res) => {
  const { distrito_electoral } = req.query;

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
              where (ra.modulo_registro = 1${distrito_electoral ? ' and ra.distrito_electoral = @distrito_electoral' : ''} and ra.estado_registro<>4);`);

    if (result.recordset.length > 0) {
      const data = result.recordset.map(item => {
        let nombreUbicacion = null;
        let nombreUbicacionLimpio = null;

        if (item.enlace_ubicacion) {
          nombreUbicacion = path.basename(item.enlace_ubicacion);
          const guionIndex = nombreUbicacion.indexOf("-");
          nombreUbicacionLimpio = guionIndex > -1
            ? nombreUbicacion.substring(guionIndex + 1)
            : nombreUbicacion;
        }

        let nombreFoto = null;
        let nombreFotoLimpio = null;

        if (item.enlace_foto) {
          nombreFoto = path.basename(item.enlace_foto);
          const guionIndexFoto = nombreFoto.indexOf("-");
          nombreFotoLimpio = guionIndexFoto > -1
            ? nombreFoto.substring(guionIndexFoto + 1)
            : nombreFoto;
        }

        return {
          ...item,
          enlace_ubicacion: nombreUbicacion,
          nombre_archivo: nombreUbicacionLimpio,
          enlace_foto: nombreFoto,
          nombre_foto: nombreFotoLimpio
        };
      });

      return res.status(200).json({ getAfluencia: data });
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

  if (!id) {
    return res.status(400).json({ message: "Datos requeridos" })
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
      return res.status(404).json({ message: "No se encontraron registros", code: 100 })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
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
                UPDATE registro_afluencia
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