import { connectToDatabase, sql } from "../Config/Configuracion.js";
import Midleware from "../Config/Midleware.js";
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

//consulta de lista de distritos
router.get("/getAllDistritos", Midleware.verifyToken, async (req, res) => {
  try {
    const pool = await connectToDatabase();

    const result = await pool.request().query(`
      SELECT 
        au.id AS id_distrito,
        au.distrito,
        au.estado_sistema,
        au.documento_1,
        au.documento_2,
        au.documento_3,
        au.documento_4,
        au.documento_5,
        au.documento_6,
        au.documento_7
      FROM adscripcion_usuario au
      where au.id IN (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33);
    `);

    const registros = result.recordset;

    const validacion = await pool.request().query(`
      SELECT
        SUM(CASE WHEN CAST(documento_1 AS VARCHAR) <> '1' OR documento_1 IS NULL THEN 1 ELSE 0 END) AS doc1_invalidos,
        SUM(CASE WHEN CAST(documento_2 AS VARCHAR) <> '1' OR documento_2 IS NULL THEN 1 ELSE 0 END) AS doc2_invalidos,
        SUM(CASE WHEN CAST(documento_3 AS VARCHAR) <> '1' OR documento_3 IS NULL THEN 1 ELSE 0 END) AS doc3_invalidos,
        SUM(CASE WHEN CAST(documento_4 AS VARCHAR) <> '1' OR documento_4 IS NULL THEN 1 ELSE 0 END) AS doc4_invalidos,
        SUM(CASE WHEN CAST(documento_5 AS VARCHAR) <> '1' OR documento_5 IS NULL THEN 1 ELSE 0 END) AS doc5_invalidos,
        SUM(CASE WHEN CAST(documento_6 AS VARCHAR) <> '1' OR documento_6 IS NULL THEN 1 ELSE 0 END) AS doc6_invalidos,
        SUM(CASE WHEN CAST(documento_7 AS VARCHAR) <> '1' OR documento_7 IS NULL THEN 1 ELSE 0 END) AS doc7_invalidos
      FROM adscripcion_usuario;
    `);

    const v = validacion.recordset[0];

    const todosEnUno = {
      documento_1: v.doc1_invalidos === 0,
      documento_2: v.doc2_invalidos === 0,
      documento_3: v.doc3_invalidos === 0,
      documento_4: v.doc4_invalidos === 0,
      documento_5: v.doc5_invalidos === 0,
      documento_6: v.doc6_invalidos === 0,
      documento_7: v.doc7_invalidos === 0,
    };

    return res.status(200).json({
      getAllDistritos: registros,
      documentosValidos: todosEnUno,
      code: 200,
    });

  } catch (error) {
    console.error("Error al obtener distritos:", error);
    return res.status(500).json({
      message: "Error de servidor",
      error: error.message,
    });
  }
});



//update cerrar o abrir Distritos
router.patch("/updateEstadoDistrito", Midleware.verifyToken, async (req, res) => {

  const {
    estado_sistema,
    distrito
  } = req.body;


  if (estado_sistema == null || distrito == null) {
    return res.status(400).json({ message: "Datos requeridos" })
  }

  let transaction;

  try {

    const pool = await connectToDatabase();
    const transaction = pool.transaction();

    await transaction.begin();

    // Obtener datos actuales
    const resultAnterior = await transaction.request()
      .input('id', sql.Int, distrito)
      .query('SELECT * FROM adscripcion_usuario WHERE id = @id');

    const registroAnterior = resultAnterior.recordset[0];

    if (!registroAnterior) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    //comparar
    const camposEditables = [
      "estado_sistema",
    ];


    const nuevosDatos = {
      estado_sistema
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
        .input('distrito', sql.Int, distrito)
        .input('estado_sistema', sql.Int, estado_sistema)
        .query(`UPDATE adscripcion_usuario SET
                        estado_sistema = @estado_sistema                   
                    WHERE id = @distrito;`);
    }

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


//update cerrar o abrir todos los distritos
router.patch("/updateAllDistritos", Midleware.verifyToken, async (req, res) => {
  const { estado_sistema } = req.body;

  if (estado_sistema == null) {
    return res.status(400).json({ message: "El campo estado_sistema es requerido" });
  }

  let transaction;
  try {
    const pool = await connectToDatabase();
    transaction = pool.transaction();
    await transaction.begin();

    await transaction.request()
      .input('estado_sistema', sql.Int, estado_sistema)
      .query(`
                UPDATE adscripcion_usuario
                SET estado_sistema = @estado_sistema
                where id<>34;
            `);

    await transaction.commit();

    return res.status(200).json({
      message: `Todos los registros fueron actualizados a estado_sistema = ${estado_sistema}`,
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


router.patch("/updateControlDocs", Midleware.verifyToken, async (req, res) => {
  const { distrito, nombre, estado_sistema } = req.body;

  const camposValidos = [
    "documento_1", "documento_2", "documento_3", "documento_4", "documento_5",
    "documento_6", "documento_7", "documento_8", "documento_9", "documento_10"
  ];

  if (!camposValidos.includes(nombre)) {
    return res.status(400).json({ message: "Campo de documento inválido" });
  }

  let transaction;
  try {
    const pool = await connectToDatabase();
    transaction = pool.transaction();
    await transaction.begin();

    const query = `
            UPDATE adscripcion_usuario
            SET ${nombre} = @estado_sistema
            WHERE id = @distrito
        `;

    await transaction.request()
      .input("distrito", sql.Int, distrito)
      .input("estado_sistema", sql.Int, estado_sistema)
      .query(query);

    await transaction.commit();

    return res.status(200).json({
      message: `Se actualizó correctamente el campo ${nombre} en el distrito ${distrito}`,
      code: 200,
    });
  } catch (err) {
    console.error("Error en Registro:", err);
    if (transaction) await transaction.rollback();
    return res.status(500).json({ message: "Error al actualizar el registro", error: err.message });
  }
});


//consulta de lista de distritos
router.get("/getControlModulos", Midleware.verifyToken, async (req, res) => {
  try {

    const pool = await connectToDatabase();
    const result = await pool.request()
      .query(`SELECT 
                id,
                CASE 
                    WHEN id = 3 THEN 'Módulo 3'
                    WHEN id = 4 THEN 'Módulo 4'
                    ELSE tipo_usuario
                END AS tipo_usuario,
                estado_sistema,
                documento_1
				FROM tipo_usuario
				WHERE id IN (3, 4);`);

    if (result.recordset.length > 0) {
      return res.status(200).json({
        getAllDistritos: result.recordset
      });
    } else {
      return res.status(404).json({ message: "No se encontraron registros", code: 100 })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});


//update cerrar o abrir todos los modulos
router.patch("/updateDocModulos", Midleware.verifyToken, async (req, res) => {
  const { id_modulo, estado_sistema } = req.body;

  if (id_modulo == null || estado_sistema == null) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  let transaction;
  try {
    const pool = await connectToDatabase();
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    const request = new sql.Request(transaction);
    await request
      .input("id_modulo", sql.Int, id_modulo)
      .input("estado_sistema", sql.Int, estado_sistema)
      .query(`
        UPDATE tipo_usuario
        SET documento_1 = @estado_sistema
        WHERE id = @id_modulo;
      `);

    await transaction.commit();

    return res.status(200).json({
      message: `Actualizado correctamente`,
      code: 200,
    });
  } catch (err) {
    console.error("Error en Registro:", err);
    if (transaction) {
      await transaction.rollback();
    }
    return res
      .status(500)
      .json({ message: "Error al actualizar el registro", error: err.message });
  }
});


//update abrir o cerrar modulos
router.patch("/updateEstadoModulo", Midleware.verifyToken, async (req, res) => {

  const {
    estado_sistema,
    id_modulo
  } = req.body;



  if (estado_sistema == null || id_modulo == null) {
    return res.status(400).json({ message: "Datos requeridos" })
  }

  let transaction;

  try {

    const pool = await connectToDatabase();
    const transaction = pool.transaction();

    await transaction.begin();

    // Obtener datos actuales
    const resultAnterior = await transaction.request()
      .input('id_modulo', sql.Int, id_modulo)
      .query('SELECT * FROM tipo_usuario WHERE id = @id_modulo');

    const registroAnterior = resultAnterior.recordset[0];

    if (!registroAnterior) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    //comparar
    const camposEditables = [
      "estado_sistema",
    ];


    const nuevosDatos = {
      estado_sistema
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
        .input('id_modulo', sql.Int, id_modulo)
        .input('estado_sistema', sql.Int, estado_sistema)
        .query(`UPDATE tipo_usuario SET
                        estado_sistema = @estado_sistema                   
                    WHERE id = @id_modulo;`);
    }

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



// limpiar lista de documentos de todos los distritos
router.patch("/updateLimpiaDocumentos", Midleware.verifyToken, async (req, res) => {
  let transaction;


  try {
    const pool = await connectToDatabase();
    transaction = new sql.Transaction(pool);

    await transaction.begin();

    const request = new sql.Request(transaction);

    const result = await request.query(`
      UPDATE adscripcion_usuario
      SET 
        documento_1 = 0,
        documento_2 = 0,
        documento_3 = 0,
        documento_4 = 0,
        documento_5 = 0,
        documento_6 = 0,
        documento_7 = 0
        where id IN (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33)
    `);

    await transaction.commit();

    if (result.rowsAffected[0] > 0) {
      return res.status(200).json({
        message: "Actualizado correctamente",
        filas: result.rowsAffected[0],
        code: 200,
      });
    } else {
      return res.status(404).json({
        message: "No se actualizó ningún registro (posiblemente la tabla esté vacía)",
        code: 404,
      });
    }

  } catch (err) {
    console.error("Error en Registro:", err);
    if (transaction) await transaction.rollback();
    return res.status(500).json({
      message: "Error al actualizar el registro",
      error: err.message,
    });
  }
});



//por columna
router.patch("/updateByColum", Midleware.verifyToken, async (req, res) => {
  const { nombre, estado_sistema } = req.body;

  const camposValidos = [
    "documento_1", "documento_2", "documento_3", "documento_4", "documento_5",
    "documento_6", "documento_7"
  ];

  if (!camposValidos.includes(nombre)) {
    return res.status(400).json({ message: "Campo de documento inválido" });
  }

  let transaction;
  try {
    const pool = await connectToDatabase();
    transaction = pool.transaction();
    await transaction.begin();

    const query = `
            UPDATE adscripcion_usuario
            SET ${nombre} = @estado_sistema
        `;

    await transaction.request()
      .input("estado_sistema", sql.Int, estado_sistema)
      .query(query);

    await transaction.commit();

    return res.status(200).json({
      message: `Se actualizó correctamente el campo`,
      code: 200,
    });
  } catch (err) {
    console.error("Error en Registro:", err);
    if (transaction) await transaction.rollback();
    return res.status(500).json({ message: "Error al actualizar el registro", error: err.message });
  }
});

export default router;