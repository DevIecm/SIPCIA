import crypto from 'crypto';
import { connectToDatabase, sql } from '../Config/Configuracion.js';
import Midleware from '../Config/Midleware.js';
import jwt from 'jsonwebtoken';
import express from 'express';
import dotenv from 'dotenv';

const router = express.Router();
const secretKey = process.env.JWT_KEY;
dotenv.config();

function encryptSHA256(text) {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('hex');
}

router.post("/login", async (req, res) => {
    try{

        const { username, password, tipo_usuario } = req.body;

        if(!username || !password || !tipo_usuario) {
            return res.status(400).json({ message: "Datos requeridos"})
        }

        const ecryptedPass = encryptSHA256(password);

        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .input('tipo_usuario', sql.Int, tipo_usuario)
            .query(`SELECT
                        cs.id,
                        cs.usuario,
                        cs.tipo_usuario,
                        cs.estado_usuario,
                        cs.nombre_usuario,
                        cs.cargo_usuario,
                        cs.correo_usuario,
                        cs.area_adscripcion,
                        cd.adscripcion_usuario,
                        cd.distrito
                    FROM usuarios cs
                        JOIN tipo_usuario tu ON cs.tipo_usuario = tu.id 
                        JOIN estado_usuario es ON cs.estado_usuario = es.id
                        JOIN adscripcion_usuario cd ON cs.area_adscripcion = cd.id
                    WHERE cs.usuario = @username AND cs.password = @password AND cs.tipo_usuario = @tipo_usuario`)

        if (result.recordset.length > 0) {
            if(result.recordset[0].estado_usuario === 1){
                const token = jwt.sign({ username }, secretKey, { expiresIn: "5h" });
                return res.status(200).json({ 
                    token, 
                    userData: result.recordset 
                });

            } else {
            
            return res.status(401).json({ message: "Fallo autenticación", code: 401 });
            
            }

        } else {
            return res.status(401).json({ message: "Fallo autenticación", code: 101 });
        }

    } catch(error) {
        return res.status(500).json({ message: "Error de servidor" , error});       
    }
});

router.get("/protected", Midleware.verifyToken, (req, res) => {
    return res.status(200).json({ message: "You have access" });
});

export default router;