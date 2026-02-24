import crypto from 'crypto';
import { connectToDatabase, sql } from '../Config/Configuracion.js';
import Midleware from '../Config/Midleware.js';
import jwt from 'jsonwebtoken';
import express from 'express';
import dotenv from 'dotenv';
import CryptoJS from 'crypto-js';

import nodemailer from 'nodemailer';

const router = express.Router();
const secretKey = process.env.JWT_KEY;
dotenv.config();

function encryptSHA256(text) {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('hex');
}

router.post('/email', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: 'luisenrique6142@gmail.com',
        pass: 'oxmy okyn gysx wvtn',
      },
      tls: {
        rejectUnauthorized: false
      },
    });

    const info = await transporter.sendMail({
      from: '"Enrique Pérez" <luisenrique6142@gmail.com>',
      to,
      subject,
      text,
      html,
    });

    res.status(200).json({ message: "Correo enviado", info });

  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error enviando correo", error });
  }
});

router.post("/loginEncrypt", async (req, res) => {
    try {
        
        const ecnrypt = req.body.encryp;
        const bytes = CryptoJS.AES.decrypt(ecnrypt, secretKey);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('username', sql.VarChar, data.username)
            .input('password', sql.VarChar, data.password)
            .input('tipo_usuario', sql.Int, data.tipo_usuario)
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
                        tu.documento_1 AS modDoc
                    FROM usuarios cs
                    JOIN tipo_usuario tu ON cs.tipo_usuario = tu.id 
                    JOIN estado_usuario es ON cs.estado_usuario = es.id
                    JOIN adscripcion_usuario cd ON cs.area_adscripcion = cd.id
                    WHERE 
                        cs.usuario = @username
                        AND cs.password = @password
                        AND cs.tipo_usuario = @tipo_usuario
                        AND tu.estado_sistema = 1
                        AND cd.estado_sistema = 1;`)

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: "Fallo autenticación", code: 101 });
        }

        const user = result.recordset[0];

        if (user.estado_usuario !== 1) {
            return res.status(401).json({ message: "Usuario inactivo", code: 401 });
        }

        const token = jwt.sign({ username: data.username }, secretKey, { expiresIn: "5h" });

        const responseData = {
            token,
            userData: user
        };

        const encryptedResponse = CryptoJS.AES.encrypt(
            JSON.stringify(responseData),
            secretKey
        ).toString();

        return res.status(200).json({ data: encryptedResponse });

    } catch (error) {
        return res.status(500).json({ message: "Error de servidor", error });
    }
});

router.get("/catch", async (req, res) => {
    try {

         const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: "Datos requeridos" });
        }

        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT
                        cs.id,
                        cs.estado_sistema    
                    FROM tipo_usuario cs
                    WHERE cs.id = @id`)
    
        if (result.recordset.length > 0) {
            return res.status(200).json({
                estado_sistema: result.recordset
            });
        } else {
            return res.status(200).json({ message: "No se encontraron datos de tipo" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Error de servidor", error });
    }
});

router.post("/login", async (req, res) => {
    try {

        const ecnrypt = req.body.encryp;
        const bytes = CryptoJS.AES.decrypt(ecnrypt, secretKey);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        const pool = await connectToDatabase();

        const result = await pool.request()
            .input('username', sql.VarChar, data.username)
            .input('password', sql.VarChar, data.password)
            .input('tipo_usuario', sql.Int, data.tipo_usuario)
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
                        cd.distrito,
                        cd.documento_1,
                        cd.documento_2,
                        cd.documento_3,
                        cd.documento_4,
                        cd.documento_5,
                        cd.documento_6,
                        cd.documento_7,
                        tu.documento_1 AS modDoc
                    FROM usuarios cs
                    JOIN tipo_usuario tu ON cs.tipo_usuario = tu.id 
                    JOIN estado_usuario es ON cs.estado_usuario = es.id
                    JOIN adscripcion_usuario cd ON cs.area_adscripcion = cd.id
                    WHERE 
                        cs.usuario = @username
                        AND cs.password = @password
                        AND cs.tipo_usuario = @tipo_usuario
                        AND tu.estado_sistema = 1
                        AND cd.estado_sistema = 1;`)

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: "Fallo autenticación", code: 101 });
        }

        const user = result.recordset[0];

        if (user.estado_usuario !== 1) {
            return res.status(401).json({ message: "Usuario inactivo", code: 401 });
        }

        const token = jwt.sign({ username: data.username }, secretKey, { expiresIn: "5h" });

        const responseData = {
            token,
            userData: user
        };

        const encryptedResponse = CryptoJS.AES.encrypt(
            JSON.stringify(responseData),
            secretKey
        ).toString();

        return res.status(200).json({ data: encryptedResponse });

    } catch (error) {
        return res.status(500).json({ message: "Error de servidor", error });
    }
});

router.get("/protected", Midleware.verifyToken, (req, res) => {
    return res.status(200).json({ message: "You have access" });
});

export default router;