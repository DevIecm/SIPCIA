import { connectToDatabase, sql } from "../../Config/Configuracion.js";
import Midleware from "../../Config/Midleware.js";
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
// totales para comunidad Indigena
router.get("/reporteInstanciasInd", Midleware.verifyToken, async (req, res) => {

    const { id_distrito
    } = req.query

    if (!id_distrito) {
        return res.status(400).json({ message: "Datos requeridos" })
    }


    try {

        const pool = await connectToDatabase();
        const todasInstancias = await pool.request()
            .input('id_distrito', sql.Int, id_distrito)
            .query(`
                SELECT 'tlPueblosOriginarios' AS categoria, COUNT(*) AS total
                        FROM registro r  
                        JOIN comunidad c ON r.comunidad = c.id  
                        JOIN cat_pueblos_originarios cpo ON r.pueblo_originario = cpo.id 
                        JOIN demarcacion_territorial dt ON r.demarcacion = dt.id 
                        JOIN cat_distrito cd ON r.distrito_electoral = cd.id
                        where cd.id =@id_distrito and c.id=1
                        UNION ALL                        
                        SELECT 'tlPueblos' AS categoria, COUNT(*) AS total 
                        FROM registro r  
                        JOIN comunidad c ON r.comunidad = c.id   
                        JOIN cat_pueblos cp ON r.pueblo_pbl = cp.id
                        JOIN demarcacion_territorial dt ON r.demarcacion = dt.id 
                        JOIN cat_distrito cd ON r.distrito_electoral = cd.id
                        where cd.id =@id_distrito and c.id=1
                        UNION ALL
                        SELECT 'tlBarrios' AS categoria, COUNT(*) AS total
                        FROM registro r  
                        JOIN comunidad c ON r.comunidad = c.id   
                        JOIN cat_barrios cb ON r.barrio_pbl = cb.id
                        JOIN demarcacion_territorial dt ON r.demarcacion = dt.id 
                        JOIN cat_distrito cd ON r.distrito_electoral = cd.id
                        where cd.id =@id_distrito and c.id=1
                        UNION ALL
                        SELECT 'tlComunidadInd' AS categoria, COUNT(*) AS total
                        FROM registro r
                        join comunidad c on r.comunidad = c.id
                        join demarcacion_territorial dt on r.demarcacion = dt.id 
                        join cat_distrito cd on r.distrito_electoral = cd.id         
                        where cd.id =@id_distrito and c.id=1 and r.comunidad_pbl IS NOT NULL             
                        UNION ALL
                        SELECT 'tlUt' AS categoria, COUNT(*) AS total
                        FROM registro r  
                        JOIN comunidad c ON r.comunidad = c.id  
                        JOIN unidad_territorial ut ON r.unidad_territorial_pbl = ut.id 
                        JOIN demarcacion_territorial dt ON r.demarcacion = dt.id 
                        JOIN cat_distrito cd ON r.distrito_electoral = cd.id
                        where cd.id =@id_distrito and c.id=1
                        UNION ALL
                        SELECT 'tlOtros_pbl' AS categoria, COUNT(*) AS total
                        FROM registro r  
                        JOIN comunidad c ON r.comunidad = c.id
                        JOIN demarcacion_territorial dt ON r.demarcacion = dt.id 
                        JOIN cat_distrito cd ON r.distrito_electoral = cd.id 
                        where cd.id =@id_distrito and c.id=1  AND r.otro_pbl IS NOT NULL`);

                if (todasInstancias.recordset.length > 0) {
                const response = {
                    tlPueblosOriginarios: 0,
                    tlPueblos: 0,
                    tlBarrios: 0,
                    tlComunidadInd: 0,
                    tlUt: 0,
                    tlOtros_pbl: 0,
                    sumaTotalesInd: 0,
                    code: 200
                };

                todasInstancias.recordset.forEach(item => {
                    if (response.hasOwnProperty(item.categoria)) {
                        response[item.categoria] = item.total;
                    }
                });

                response.sumaTotalesInd = 
                    response.tlPueblosOriginarios +
                    response.tlPueblos +
                    response.tlBarrios +
                    response.tlComunidadInd +
                    response.tlUt +
                    response.tlOtros_pbl;

                return res.status(200).json(response);
            } else {
                return res.status(404).json({ message: "No se encontraron datos" });
            }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error de servidor", error: error.message });
    }
});


// totales para comunidad afro
router.get("/reporteInstanciasAfro", Midleware.verifyToken, async (req, res) => {

    const { id_distrito
    } = req.query

    if (!id_distrito) {
        return res.status(400).json({ message: "Datos requeridos" })
    }


    try {

        const pool = await connectToDatabase();
        const todasInstancias = await pool.request()
            .input('id_distrito', sql.Int, id_distrito)
            .query(`
                SELECT 'tlPuebloAfro' AS categoria, COUNT(*) AS total
                    FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =2 and cd.id =@id_distrito AND r.pueblo_afro IS NOT NULL
                    UNION ALL
                    SELECT 'tlComunidadAfro' AS categoria, COUNT(*) AS total
                    FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =2 and cd.id =@id_distrito AND r.comunidad_afro IS NOT NULL
                    UNION ALL
                    SELECT 'tlOrganizaciones' AS categoria, COUNT(*) AS total
                    FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =2 and cd.id =@id_distrito AND r.organizacion_afro IS NOT NULL
                    UNION ALL
                    SELECT 'tlPersoRelevantes' AS categoria, COUNT(*) AS total
                    FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =2 and cd.id =@id_distrito AND r.persona_relevante_afro IS NOT NULL
                    UNION ALL
                    SELECT 'tlOtroAfro' AS categoria, COUNT(*) AS total
                    FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =2 and cd.id =@id_distrito AND r.otro_afro IS NOT NULL`);

        if (todasInstancias.recordset.length > 0) {
            const response = {
                tlPuebloAfro: 0,
                tlComunidadAfro: 0,
                tlOrganizaciones: 0,
                tlPersoRelevantes: 0,
                tlOtroAfro: 0,
                sumaTotalesAfro: 0,
                code: 200
            };

            todasInstancias.recordset.forEach(item => {
            if (response.hasOwnProperty(item.categoria)) {
                response[item.categoria] = item.total;
            }});
                response.sumaTotalesAfro = 
                response.tlPuebloAfro +
                response.tlComunidadAfro +
                response.tlOrganizaciones +
                response.tlPersoRelevantes +
                response.tlOtroAfro;

                return res.status(200).json(response);

        } else {
            return res.status(404).json({ message: "No se encontraron datos" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error de servidor", error: error.message });
    }
});


//mixto
router.get("/reporteInstancias", Midleware.verifyToken, async (req, res) => {


    const {
        tipo_comunidad, id_distrito, id_demarcacion
    } = req.query


    if (!tipo_comunidad || !id_distrito || !id_demarcacion) {
        return res.status(400).json({ message: "Datos requeridos" })
    }

    try {

        const pool = await connectToDatabase();
        //conteos separados
        const pueblosOriginarios = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id  
                    join cat_pueblos_originarios cpo  on r.pueblo_originario = cpo.id 
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito and dt.id =@id_demarcacion
            `);

        const pueblos = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id   
                    join cat_pueblos cp on r.pueblo_pbl = cp.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito and dt.id =@id_demarcacion
            `);

        const barrios = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id   
                    join cat_barrios cb  on r.barrio_pbl = cb.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito and dt.id =@id_demarcacion
            `);

        const comunidadInd = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                select COUNT(*) AS total FROM registro r
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito AND r.comunidad_pbl IS NOT NULL and dt.id =@id_demarcacion
            `);

        const unidad_territorial = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                select COUNT(*) AS total FROM registro r 
                join comunidad c on r.comunidad = c.id  
                join unidad_territorial ut on r.unidad_territorial_pbl = ut.id 
                join demarcacion_territorial dt on r.demarcacion = dt.id 
                join cat_distrito cd on r.distrito_electoral = cd.id  
                WHERE c.id =@tipo_comunidad and cd.id =@id_distrito and dt.id =@id_demarcacion
            `);

        const otro_pbl = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito AND r.otro_pbl IS NOT NULL and dt.id =@id_demarcacion
            `);

        // Comunidad Afro

        const pueblos_afro = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito AND r.pueblo_afro IS NOT NULL and dt.id =@id_demarcacion
            `);

         const comunidad_afro = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito AND r.comunidad_afro IS NOT NULL and dt.id =@id_demarcacion
            `);

        const organizacion_afro = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito AND r.organizacion_afro IS NOT NULL and dt.id =@id_demarcacion
            `);

        const personas_relev = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito AND r.persona_relevante_afro IS NOT NULL and dt.id =@id_demarcacion
            `);
        
        const otro_afro = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                SELECT COUNT(*) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE c.id =@tipo_comunidad and cd.id =@id_distrito AND r.otro_afro IS NOT NULL and dt.id =@id_demarcacion
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