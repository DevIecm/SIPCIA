import { connectToDatabase } from "../Config/Configuracion.js";
import Midleware from "../Config/Midleware.js";
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

//consulta de lista de distritos
router.get("/getAllDistritos", Midleware.verifyToken, async (req, res) => {
  try{

    const pool = await connectToDatabase();
    const result = await pool.request()    
      .query(`select au.id as id_distrito,
              	  au.distrito,
              	  au.estado_sistema,
	              au.documento_1, 
	              au.documento_2, 
	              au.documento_3, 
	              au.documento_4, 
	              au.documento_5, 
	              au.documento_6, 
	              au.documento_7, 
	              au.documento_8, 
	              au.documento_9, 
	              au.documento_10 
              from adscripcion_usuario au;`);

              if (result.recordset.length > 0) {
            return res.status(200).json({
                getAllDistritos: result.recordset
            });
        } else {
            return res.status(404).json({ message: "No se encontraron registros", code: 100})
        }
  }catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }
});


//update cerrar o abrir Distritos
router.patch("/updateEstadoDistrito", Midleware.verifyToken, async (req, res) => {

    const {
        estado_sistema,
        distrito
    } = req.body;


     if (!estado_sistema || !distrito){
        return res.status(400).json({ message: "Datos requeridos"})
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

    }catch (err) {
        console.error("Error en Registro:", err);
        if (transaction) {
            await transaction.rollback();
        }
        return res.status(500).json({ message: "Error al actualizar el registro", error: err.message });
    }
});

export default router;