import { connectToDatabase, sql } from "../../Config/Configuracion.js";
import Midleware from "../../Config/Midleware.js";
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();


router.get("/reporteInstancias", Midleware.verifyToken, async (req, res) => {


    const {
        tipo_comunidad, id_distrito
    } = req.query

    if (!tipo_comunidad || !id_distrito) {
        return res.status(400).json({ message: "Datos requeridos" })
    }


    try {

        const pool = await connectToDatabase();
        //conteos separados
        const pueblosOriginarios = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id  
                    join cat_pueblos_originarios cpo  on r.pueblo_originario = cpo.id 
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito
            `);

        const pueblos = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id   
                    join cat_pueblos cp on r.pueblo_pbl = cp.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito
            `);

        const barrios = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id   
                    join cat_barrios cb  on r.barrio_pbl = cb.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito
            `);

        const comunidadInd = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .query(`
                select COUNT(*) AS total FROM registro r
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito AND r.comunidad_pbl IS NOT NULL
            `);

        const unidad_territorial = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .query(`
                select COUNT(*) AS total FROM registro r 
                join comunidad c on r.comunidad = c.id  
                join unidad_territorial ut on r.unidad_territorial_pbl = ut.id 
                join demarcacion_territorial dt on r.demarcacion = dt.id 
                join cat_distrito cd on r.distrito_electoral = cd.id  
                WHERE c.id =@tipo_comunidad and cd.id =@id_distrito
            `);

        const otro_pbl = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito AND r.otro_pbl IS NOT NULL
            `);

        // Comunidad Afro

        const pueblos_afro = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito AND r.pueblo_afro IS NOT NULL
            `);

         const comunidad_afro = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito AND r.comunidad_afro IS NOT NULL
            `);

        const organizacion_afro = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito AND r.organizacion_afro IS NOT NULL
            `);

        const personas_relev = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito AND r.persona_relevante_afro IS NOT NULL
            `);
        
        const otro_afro = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito AND r.otro_afro IS NOT NULL
            `);

        //datos
        const totalPueblosOriginarios = pueblosOriginarios.recordset[0].total;
        const totalPueblos = pueblos.recordset[0].total;
        const totalBarrios = barrios.recordset[0].total;
        const totalComunidadInd = comunidadInd.recordset[0].total;
        const totalUt = unidad_territorial.recordset[0].total;
        const totalOtro_pbl = otro_pbl.recordset[0].total;

        //afro
        const totalPuebloAfro = pueblos_afro.recordset[0].total;
        const totalComunidadAfro = comunidad_afro.recordset[0].total;
        const totalOrganizaciones = organizacion_afro.recordset[0].total;
        const totalPersoRelevantes = personas_relev.recordset[0].total;
        const totalOtroAfro = otro_afro.recordset[0].total;


        return res.status(200).json({
            tlPueblosOriginarios: totalPueblosOriginarios,
            tlPueblos: totalPueblos,
            tlBarrios: totalBarrios,
            tlComunidadInd: totalComunidadInd,
            tlUt: totalUt,
            tlOtros_pbl: totalOtro_pbl,
            sumaTotalesInd: totalPueblosOriginarios + totalPueblos + totalBarrios + totalComunidadInd + totalUt + totalOtro_pbl,

            tlPuebloAfro: totalPuebloAfro,
            tlComunidadAfro: totalComunidadAfro,
            tlOrganizaciones: totalOrganizaciones,
            tlPersoRelevantes: totalPersoRelevantes,
            tlOtroAfro: totalOtroAfro,
            sumaTotalesAfro: totalPuebloAfro + totalComunidadAfro + totalOrganizaciones + totalPersoRelevantes + totalOtroAfro,
            code: 200,
        });


    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de servidor", error: error.message });
  }

});


export default router;