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


    try {

        const pool = await connectToDatabase();
        const todasInstancias = await pool.request()
            .input('id_distrito', sql.Int, id_distrito)
            .query(`
                SELECT 'tlPueblosOriginarios' AS categoria, COUNT(Distinct r.pueblo_originario) AS total
                FROM registro r  
                JOIN comunidad c ON r.comunidad = c.id  
                JOIN cat_pueblos_originarios cpo ON r.pueblo_originario = cpo.id 
                JOIN demarcacion_territorial dt ON r.demarcacion = dt.id 
                JOIN cat_distrito cd ON r.distrito_electoral = cd.id
                WHERE  (r.estado_registro<>4 and c.id = 1${id_distrito ? ' AND r.distrito_electoral = @id_distrito' : ''} and r.modulo_registro = 1)
                UNION ALL                        
                SELECT 'tlPueblos' AS categoria, COUNT(Distinct r.pueblo_pbl) AS total 
                FROM registro r  
                JOIN comunidad c ON r.comunidad = c.id   
                JOIN cat_pueblos cp ON r.pueblo_pbl = cp.id
                JOIN demarcacion_territorial dt ON r.demarcacion = dt.id 
                JOIN cat_distrito cd ON r.distrito_electoral = cd.id
                WHERE  (r.estado_registro<>4 and c.id = 1${id_distrito ? ' AND r.distrito_electoral = @id_distrito' : ''} and r.modulo_registro = 1)
                UNION ALL
                SELECT 'tlBarrios' AS categoria, COUNT(Distinct r.barrio_pbl) AS total
                FROM registro r  
                JOIN comunidad c ON r.comunidad = c.id   
                JOIN cat_barrios cb ON r.barrio_pbl = cb.id
                JOIN demarcacion_territorial dt ON r.demarcacion = dt.id 
                JOIN cat_distrito cd ON r.distrito_electoral = cd.id
                WHERE  (r.estado_registro<>4 and c.id = 1${id_distrito ? ' AND r.distrito_electoral = @id_distrito' : ''} and r.modulo_registro = 1)
                UNION ALL
                SELECT 'tlComunidadInd' AS categoria, COUNT(Distinct r.comunidad_pbl) AS total
                FROM registro r
                join comunidad c on r.comunidad = c.id
                join demarcacion_territorial dt on r.demarcacion = dt.id 
                join cat_distrito cd on r.distrito_electoral = cd.id       
                WHERE  (r.estado_registro<>4 and c.id = 1${id_distrito ? ' AND r.distrito_electoral = @id_distrito' : ''} and r.modulo_registro = 1 AND ISNULL(LTRIM(RTRIM(r.comunidad_pbl)), '') <> '')
                    UNION ALL
                SELECT 'tlUt' AS categoria, COUNT(Distinct r.unidad_territorial_pbl) AS total
                FROM registro r  
                JOIN comunidad c ON r.comunidad = c.id  
                JOIN unidad_territorial ut ON r.unidad_territorial_pbl = ut.id 
                JOIN demarcacion_territorial dt ON r.demarcacion = dt.id 
                JOIN cat_distrito cd ON r.distrito_electoral = cd.id
                WHERE  (r.estado_registro<>4 and c.id = 1${id_distrito ? ' AND r.distrito_electoral = @id_distrito' : ''} and r.modulo_registro = 1)
                UNION ALL
                SELECT 'tlOtros_pbl' AS categoria, COUNT(Distinct r.otro_pbl) AS total
                FROM registro r  
                JOIN comunidad c ON r.comunidad = c.id
                JOIN demarcacion_territorial dt ON r.demarcacion = dt.id 
                JOIN cat_distrito cd ON r.distrito_electoral = cd.id 
                WHERE  (r.estado_registro<>4 and c.id = 1${id_distrito ? ' AND r.distrito_electoral = @id_distrito' : ''} and r.modulo_registro = 1 AND ISNULL(LTRIM(RTRIM(r.otro_pbl)), '') <> '')`);

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

    try {

        const pool = await connectToDatabase();
        const todasInstancias = await pool.request()
            .input('id_distrito', sql.Int, id_distrito)
            .query(`
                SELECT 'tlPuebloAfro' AS categoria, COUNT(Distinct r.pueblo_afro) AS total
                    FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE (r.estado_registro<>4 and c.id = 2${id_distrito ? ' AND r.distrito_electoral = @id_distrito' : ''} and r.modulo_registro = 1 AND ISNULL(LTRIM(RTRIM(r.pueblo_afro)), '') <> '')
                    UNION ALL
                    SELECT 'tlComunidadAfro' AS categoria, COUNT(Distinct r.comunidad_afro) AS total
                    FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE (r.estado_registro<>4 and c.id = 2${id_distrito ? ' AND r.distrito_electoral = @id_distrito' : ''} and r.modulo_registro = 1 AND ISNULL(LTRIM(RTRIM(r.comunidad_afro)), '') <> '')
                    UNION ALL
                    SELECT 'tlOrganizaciones' AS categoria, COUNT(Distinct r.organizacion_afro) AS total
                    FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE (r.estado_registro<>4 and c.id = 2${id_distrito ? ' AND r.distrito_electoral = @id_distrito' : ''} and r.modulo_registro = 1 AND ISNULL(LTRIM(RTRIM(r.organizacion_afro)), '') <> '')
                    UNION ALL
                    SELECT 'tlPersoRelevantes' AS categoria, COUNT(Distinct r.persona_relevante_afro) AS total
                    FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id
                    WHERE (r.estado_registro<>4 and c.id = 2${id_distrito ? ' AND r.distrito_electoral = @id_distrito' : ''} and r.modulo_registro = 1 AND ISNULL(LTRIM(RTRIM(r.persona_relevante_afro)), '') <> '')
                    UNION ALL
                    SELECT 'tlOtroAfro' AS categoria, COUNT(Distinct r.otro_afro) AS total 
                    FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE (r.estado_registro<>4 and c.id = 2${id_distrito ? ' AND r.distrito_electoral = @id_distrito' : ''} and r.modulo_registro = 1 AND ISNULL(LTRIM(RTRIM(r.otro_afro)), '') <> '')                    
                ;`);

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
                }
            });
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



    if (!tipo_comunidad || !id_demarcacion) {
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
                    WHERE r.estado_registro<>4 and c.id =@tipo_comunidad${id_distrito ? ' AND cd.id =@id_distrito' : ''} and dt.id =@id_demarcacion and r.modulo_registro = 1
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
                    WHERE r.estado_registro<>4 and c.id =@tipo_comunidad${id_distrito ? ' AND cd.id =@id_distrito' : ''} and dt.id =@id_demarcacion and r.modulo_registro = 1
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
                    WHERE r.estado_registro<>4 and c.id =@tipo_comunidad${id_distrito ? ' AND cd.id =@id_distrito' : ''} and dt.id =@id_demarcacion and r.modulo_registro = 1
            `);

        const comunidadInd = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                select COUNT(Distinct r.comunidad_pbl) AS total FROM registro r
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE r.estado_registro<>4 and c.id =@tipo_comunidad${id_distrito ? ' AND cd.id =@id_distrito' : ''} and dt.id =@id_demarcacion and r.modulo_registro = 1 and ISNULL(LTRIM(RTRIM(r.comunidad_pbl)), '') <> ''
                    GROUP by dt.demarcacion_territorial
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
                WHERE r.estado_registro<>4 and c.id =@tipo_comunidad${id_distrito ? ' AND cd.id =@id_distrito' : ''} and dt.id =@id_demarcacion and r.modulo_registro = 1
            `);

        const otro_pbl = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                SELECT COUNT(Distinct r.otro_pbl) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE r.estado_registro<>4 and c.id =@tipo_comunidad${id_distrito ? ' AND cd.id =@id_distrito' : ''} and dt.id =@id_demarcacion and r.modulo_registro = 1 and ISNULL(LTRIM(RTRIM(r.otro_pbl)), '') <> ''
                    GROUP by dt.demarcacion_territorial
            `);

        // Comunidad Afro
        const pueblos_afro = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                SELECT COUNT(Distinct r.pueblo_afro) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE r.estado_registro<>4 and c.id =@tipo_comunidad${id_distrito ? ' AND cd.id =@id_distrito' : ''} and dt.id =@id_demarcacion and r.modulo_registro = 1 and ISNULL(LTRIM(RTRIM(r.pueblo_afro)), '') <> ''
                    GROUP by dt.demarcacion_territorial
            `);

        const comunidad_afro = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                SELECT COUNT(Distinct r.comunidad_afro) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE r.estado_registro<>4 and c.id =@tipo_comunidad${id_distrito ? ' AND cd.id =@id_distrito' : ''} and dt.id =@id_demarcacion and r.modulo_registro = 1 and ISNULL(LTRIM(RTRIM(r.comunidad_afro)), '') <> ''
                    GROUP by dt.demarcacion_territorial
            `);

        const organizacion_afro = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                SELECT COUNT(Distinct r.organizacion_afro) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE r.estado_registro<>4 and c.id =@tipo_comunidad${id_distrito ? ' AND cd.id =@id_distrito' : ''} and dt.id =@id_demarcacion and r.modulo_registro = 1 and ISNULL(LTRIM(RTRIM(r.organizacion_afro)), '') <> ''
                    GROUP by dt.demarcacion_territorial
            `);

        const personas_relev = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
               Select COUNT(Distinct r.persona_relevante_afro ) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE r.estado_registro<>4 and c.id =@tipo_comunidad${id_distrito ? ' AND cd.id =@id_distrito' : ''} and dt.id =@id_demarcacion and r.modulo_registro = 1 and ISNULL(LTRIM(RTRIM(r.persona_relevante_afro)), '') <> ''
                    GROUP by dt.demarcacion_territorial 
            `);

        const otro_afro = await pool.request()
            .input('tipo_comunidad', sql.Int, tipo_comunidad)
            .input('id_distrito', sql.Int, id_distrito)
            .input('id_demarcacion', sql.Int, id_demarcacion)
            .query(`
                SELECT COUNT(Distinct r.otro_afro) AS total FROM registro r  
                    join comunidad c on r.comunidad = c.id
                    join demarcacion_territorial dt on r.demarcacion = dt.id 
                    join cat_distrito cd on r.distrito_electoral = cd.id 
                    WHERE r.estado_registro<>4 and c.id =@tipo_comunidad${id_distrito ? ' AND cd.id =@id_distrito' : ''} and dt.id =@id_demarcacion and r.modulo_registro = 1 and ISNULL(LTRIM(RTRIM(r.otro_afro)), '') <> ''
                    GROUP by dt.demarcacion_territorial
            `);

        //datos
        const totalPueblosOriginarios = pueblosOriginarios.recordset[0]?.total || 0;
        const totalPueblos = pueblos.recordset[0]?.total || 0;
        const totalBarrios = barrios.recordset[0]?.total || 0;
        const totalComunidadInd = comunidadInd.recordset[0]?.total || 0;
        const totalUt = unidad_territorial.recordset[0]?.total || 0;
        const totalOtro_pbl = otro_pbl.recordset[0]?.total || 0;

        //afro
        const totalPuebloAfro = pueblos_afro.recordset.length > 0 ? pueblos_afro.recordset[0].total : 0;
        const totalComunidadAfro = comunidad_afro.recordset.length > 0 ? comunidad_afro.recordset[0].total : 0;
        const totalOrganizaciones = organizacion_afro.recordset.length > 0 ? organizacion_afro.recordset[0].total : 0;
        const totalPersoRelevantes = personas_relev.recordset.length > 0 ? personas_relev.recordset[0].total : 0;
        const totalOtroAfro = otro_afro.recordset.length > 0 ? otro_afro.recordset[0].total : 0;




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