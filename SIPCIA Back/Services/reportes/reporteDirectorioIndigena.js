import { connectToDatabase, sql } from "../../Config/Configuracion.js";
import Midleware from "../../Config/Midleware.js";
import express from "express";
import dotenv from "dotenv";
import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";

const API_BASE_URL = process.env.API_BASE_URL;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const router = express.Router();
//tipo_usuario se refiere en donde se registraron en que modulo las ediciones no cambian el estado

//directorio comuniad indigena
router.get("/reporteDirectorioIndig", Midleware.verifyToken, async (req, res) => {
  const { tipo_comunidad, distrito_electoral, tipo_usuario } = req.query;

  if (!tipo_comunidad) {
    return res.status(400).json({ message: "Datos requeridos" })
  }
  try {

    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('tipo_comunidad', sql.Int, tipo_comunidad)
      .input('distrito_electoral', sql.Int, distrito_electoral)
      .input('tipo_usuario', sql.Int, tipo_usuario)
      .query(`SELECT  
          ROW_NUMBER() OVER(ORDER BY r.id) AS numero_consecutivo,
          cd.id AS direccion_distrital,
          dt.demarcacion_territorial AS demarcacion,
          r.nombre_completo,
          cpo.pueblo_originario,
          cp.pueblo,
          cb.barrio,
          r.comunidad_pbl,
          CASE 
              WHEN r.otro_pbl IS NOT NULL THEN r.otro_pbl 
              ELSE ut.ut 
          END AS utotro,
          r.nombre_instancia,
          r.cargo_instancia,
          r.domicilio,
          r.telefono_particular,
          r.telefono_celular,
          r.correo_electronico_oficial,
          r.correo_electronico_personal,
          '1' AS moduloregistro,
          r.fecha_registro,
          CONVERT(VARCHAR(8), r.hora_registro, 108) AS hora_registro
      FROM registro r
      JOIN demarcacion_territorial dt ON r.demarcacion = dt.id 
      JOIN cat_distrito cd ON r.distrito_electoral = cd.id 
      LEFT JOIN cat_pueblos_originarios cpo ON r.pueblo_originario = cpo.id
      LEFT JOIN cat_pueblos cp ON r.pueblo_pbl = cp.id 
      LEFT JOIN cat_barrios cb ON r.barrio_pbl = cb.id 
      LEFT JOIN unidad_territorial ut ON r.unidad_territorial_pbl = ut.id 
      WHERE  
        (r.comunidad = @tipo_comunidad${distrito_electoral ? ' AND r.distrito_electoral = @distrito_electoral' : ''} and r.modulo_registro = @tipo_usuario);`);

    const rows = result.recordset;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("NombreDelReporte");

    //inserta imgaen
    const logoPath = path.join(__dirname, '../../assets/iecm.png');
    const logoId = workbook.addImage({
      filename: logoPath,
      extension: "png",
    });

    worksheet.addImage(logoId, {
      tl: { col: 0.1, row: 0.1 },
      ext: { width: 150, height: 70 },
    });

    // Títulos
    worksheet.mergeCells("C1:M1");
    const anexo = worksheet.getCell("C1");
    anexo.value =
      "ANEXO 1";
    anexo.font = {
      size: 27,
      bold: true,
      color: { argb: "FF6F42C1" }
    };
    anexo.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("N1:P1");
    const direccion = worksheet.getCell("P1");
    direccion.value =
      " Dirección Ejecutiva de Organización Electoral y  Geoestadística";
    direccion.font = { size: 14, bold: true };
    direccion.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("C2:M2");
    const nombre = worksheet.getCell("C2");
    nombre.value =
      "Directorio de Instancias Representativas de Pueblos, Barrios y Comunidades Indígenas";
    nombre.font = { size: 14, bold: true };
    nombre.alignment = { vertical: "middle", horizontal: "center" };

    // Subtítulo
    worksheet.mergeCells("C3:M3");
    const subtitleCell = worksheet.getCell("C3");
    subtitleCell.value = "";
    subtitleCell.font = { size: 12, bold: true };
    subtitleCell.alignment = { vertical: "middle", horizontal: "center" };

    // Encabezados
    const headers = [
      "No.",
      "DD",
      "Demarcación",
      "Nombre completo",
      "Nombre del Pueblo Originario",
      "Nombre de Pueblo",
      "Nombre del Barrio",
      "Nombre de la Comunidad Indígena",
      "UT/Otro",
      "Nombre de la Instancia Representativa a la que pertenece",
      "Cargo que ocupa en la Instancia Representativa",
      "Domicilio",
      "Teléfono particular",
      "Teléfono celular",
      "Correo electrónico oficial",
      "Correo electrónico no oficial",
      "Modulo de registro",
      "Fecha de registro",
      "Hora de registro",
    ];

    worksheet.addRow(headers);

    // Estilos de headers
    worksheet.getRow(4).eachCell((cell) => {
      cell.font = { bold: true, size: 11 };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
    });

    // Filtros
    worksheet.autoFilter = {
      from: "A4",
      to: "S4",
    };

    rows.forEach((row) => {
      worksheet.addRow([
        row.numero_consecutivo,
        row.direccion_distrital,
        row.demarcacion,
        row.nombre_completo,
        row.pueblo_originario,
        row.pueblo,
        row.barrio,
        row.comunidad_pbl,
        row.utotro,
        row.nombre_instancia,
        row.cargo_instancia,
        row.domicilio,
        row.telefono_particular,
        row.telefono_celular,
        row.correo_electronico_oficial,
        row.correo_electronico_personal,
        row.moduloregistro,
        row.fecha_registro,
        row.hora_registro,
      ]);
    });

    // Ancho de columnas
    worksheet.columns = headers.map(() => ({ width: 25 }));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=reporte.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al generar el reporte");
  }
});


//directorio comuniad afromexicana
router.get("/reporteDirectorioAfro", Midleware.verifyToken, async (req, res) => {
  const { tipo_comunidad, distrito_electoral, tipo_usuario } = req.query;


  if (!tipo_comunidad) {
    return res.status(400).json({ message: "Datos requeridos" })
  }

  // fecha y hora
  const original = new Date();
  const offsetInMs = original.getTimezoneOffset() * 60000;
  const fechaLocal = new Date(original.getTime() - offsetInMs);

  // convertir a DD/MM/YYYY
  const fechaFormateada = fechaLocal.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });


  try {

    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('tipo_comunidad', sql.Int, tipo_comunidad)
      .input('distrito_electoral', sql.Int, distrito_electoral)
      .input('tipo_usuario', sql.Int, tipo_usuario)
      .query(`SELECT  
          ROW_NUMBER() OVER(ORDER BY r.id) AS numero_consecutivo,
          cd.id AS direccion_distrital,
          dt.demarcacion_territorial AS demarcacion,
          r.nombre_completo,
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
          '1' AS moduloregistro,
          r.fecha_registro,
          CONVERT(VARCHAR(8), r.hora_registro, 108) AS hora_registro
      FROM registro r
      JOIN demarcacion_territorial dt ON r.demarcacion = dt.id 
      JOIN cat_distrito cd ON r.distrito_electoral = cd.id 
      WHERE  
        (r.comunidad = @tipo_comunidad${distrito_electoral ? ' AND r.distrito_electoral = @distrito_electoral' : ''} and r.modulo_registro = @tipo_usuario);`);

    const rows = result.recordset;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("NombreDelReporte");

    //inserta imgaen
    const logoPath = path.join(__dirname, '../../assets/iecm.png');
    const logoId = workbook.addImage({
      filename: logoPath,
      extension: "png",
    });

    worksheet.addImage(logoId, {
      tl: { col: 0.1, row: 0.1 },
      ext: { width: 150, height: 70 },
    });

    // Títulos
    worksheet.mergeCells("C1:M1");
    const anexo = worksheet.getCell("C1");
    anexo.value =
      "ANEXO 2";
    anexo.font = {
      size: 27,
      bold: true,
      color: { argb: "FF6F42C1" }
    };
    anexo.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("N1:P1");
    const direccion = worksheet.getCell("P1");
    direccion.value =
      "Dirección Ejecutiva de Organización Electoral y  Geoestadística";
    direccion.font = { size: 14, bold: true };
    direccion.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("C2:M2");
    const nombre = worksheet.getCell("C2");
    nombre.value =
      "Directorio de Instancias Representativas, Organizaciones y Personas Relevantes de Pueblos y Comunidades Afromexicanas";
    nombre.font = { size: 14, bold: true };
    nombre.alignment = { vertical: "middle", horizontal: "center" };

    // Subtítulo
    worksheet.mergeCells("C3:M3");
    const subtitleCell = worksheet.getCell("C3");
    subtitleCell.value = "";
    subtitleCell.font = { size: 12, bold: true };
    subtitleCell.alignment = { vertical: "middle", horizontal: "center" };

    //datos en tabla 
    const cellA3 = worksheet.getCell("A3");
    cellA3.value = {
      richText: [
        { text: "Dirección Distrital: ", font: { size: 12, bold: true } },
        { text: String(distrito_electoral), font: { size: 12, bold: true, underline: true } }
      ]
    };
    cellA3.alignment = { vertical: "middle", horizontal: "left" };

    const cellFecha = worksheet.getCell("N3");
    cellFecha.value = {
      richText: [
        { text: "Fecha: ", font: { size: 12, bold: true } },
        { text: String(fechaFormateada), font: { size: 12, bold: true, underline: true } }
      ]
    };
    cellFecha.alignment = { vertical: "middle", horizontal: "left" };

    const cabezera = worksheet.getCell("N2");
    cabezera.value = {
      richText: [
        { text: "Demarcación: ", font: { size: 12, bold: true } },
        { text: String(""), font: { size: 12, bold: true, underline: true } }
      ]
    };
    cabezera.alignment = { vertical: "middle", horizontal: "left" };


    // Encabezados
    const headers = [
      "No.",
      "DD",
      "Demarcación",
      "Nombre completo",
      "Nombre de Pueblo",
      "Nombre de la Comunidad",
      "Nombre de la Organización",
      "Persona relevante",
      "Otro",
      "Nombre de la Instancia Representativa a la que pertenece",
      "Cargo que ocupa en la Instancia Representativa",
      "Domicilio",
      "Teléfono particular",
      "Teléfono celular",
      "Correo electrónico oficial",
      "Correo electrónico no oficial",
      "Modulo de registro",
      "Fecha de registro",
      "Hora de registro",
    ];

    worksheet.addRow(headers);

    // Estilos de headers
    worksheet.getRow(4).eachCell((cell) => {
      cell.font = { bold: true, size: 11 };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
    });

    // Filtros
    worksheet.autoFilter = {
      from: "A4",
      to: "S4",
    };

    rows.forEach((row) => {
      worksheet.addRow([
        row.numero_consecutivo,
        row.direccion_distrital,
        row.demarcacion,
        row.nombre_completo,
        row.pueblo_afro,
        row.comunidad_afro,
        row.organizacion_afro,
        row.persona_relevante_afro,
        row.otro_afro,
        row.nombre_instancia,
        row.cargo_instancia,
        row.domicilio,
        row.telefono_particular,
        row.telefono_celular,
        row.correo_electronico_oficial,
        row.correo_electronico_personal,
        row.moduloregistro,
        row.fecha_registro,
        row.hora_registro,
      ]);
    });

    // Ancho de columnas
    worksheet.columns = headers.map(() => ({ width: 25 }));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=reporte.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al generar el reporte");
  }
});


//reporte instancias representativas de pueblos indigenas
router.get("/reporteInstancias", Midleware.verifyToken, async (req, res) => {
  const { distrito_electoral } = req.query;

  // fecha local formateada
  const original = new Date();
  const offsetInMs = original.getTimezoneOffset() * 60000;
  const fechaLocal = new Date(original.getTime() - offsetInMs);
  const fechaFormateada = fechaLocal.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  try {
    const pool = await connectToDatabase();

    // ====== QUERY 1 ======
    const result1 = await pool
      .request()
      .input("distrito_electoral", sql.Int, distrito_electoral)
      .query(`
        SELECT
          dt.demarcacion_territorial, 
          COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.pueblo_originario)), '')) AS pueblos_originarios,
          COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.pueblo_pbl)), '')) AS pueblos,
          COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.barrio_pbl)), '')) AS barrios,
          COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.comunidad_pbl)), '')) AS comunidades_indigenas,
          COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.unidad_territorial_pbl)), '')) AS ut,
          COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.otro_pbl)), '')) AS otros,
          (
              COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.pueblo_originario)), '')) +
              COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.pueblo_pbl)), '')) +
              COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.barrio_pbl)), '')) +
              COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.comunidad_pbl)), '')) +
              COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.unidad_territorial_pbl)), '')) +
              COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.otro_pbl)), ''))
          ) AS total
        FROM registro r 
        JOIN demarcacion_territorial dt ON r.demarcacion = dt.id 
        JOIN cat_distrito cd ON r.distrito_electoral = cd.id 
        WHERE (r.comunidad = 1${distrito_electoral
          ? " AND r.distrito_electoral = @distrito_electoral"
          : ""
        } and r.modulo_registro = 1)
        GROUP BY dt.demarcacion_territorial
        ORDER BY dt.demarcacion_territorial;
      `);

    const tabla1 = result1.recordset;

    // ====== QUERY 2 ======
    const result2 = await pool
      .request()
      .input("distrito_electoral", sql.Int, distrito_electoral)
      .query(`
        SELECT
          dt.demarcacion_territorial, 
          COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.pueblo_afro)), '')) AS pueblos,
          COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.comunidad_afro)), '')) AS comunidad,
          COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.organizacion_afro)), '')) AS organizacion_afro,
          COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.persona_relevante_afro)), '')) AS persona_relevante_afro,
          COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.otro_afro)), '')) AS otros,
          (
              COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.pueblo_afro)), '')) +
              COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.comunidad_afro)), '')) +
              COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.organizacion_afro)), '')) +
              COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.persona_relevante_afro)), '')) +
              COUNT(DISTINCT NULLIF(LTRIM(RTRIM(r.otro_afro)), ''))
          ) AS total
        FROM registro r 
        JOIN demarcacion_territorial dt ON r.demarcacion = dt.id 
        JOIN cat_distrito cd ON r.distrito_electoral = cd.id
        WHERE (r.comunidad = 2${distrito_electoral
          ? " AND r.distrito_electoral = @distrito_electoral"
          : ""
        } AND r.modulo_registro = 1)
        GROUP BY dt.demarcacion_territorial
        ORDER BY dt.demarcacion_territorial;
      `);

    const tabla2 = result2.recordset;

    // ====== CREACIÓN DEL EXCEL ======
    const workbook = new ExcelJS.Workbook();

    // Helper para aplicar formato
    const crearHojaConEstilo = (worksheet, tituloTexto, headers, tabla, anexoLabel) => {
      // Imagen
      const logoPath = path.join(__dirname, "../../assets/iecm.png");
      const logoId = workbook.addImage({
        filename: logoPath,
        extension: "png",
      });

      worksheet.addImage(logoId, {
        tl: { col: 0.1, row: 0.1 },
        ext: { width: 150, height: 70 },
      });

      worksheet.mergeCells("B5:F5");
      const titulo = worksheet.getCell("B5:F5");
      titulo.value = tituloTexto;
      titulo.font = { size: 14, bold: true };
      titulo.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

      worksheet.mergeCells("H1:H2");
      const anexo = worksheet.getCell("H1");
      anexo.value = anexoLabel;
      anexo.font = { size: 27, bold: true, color: { argb: "FF6F42C1" } };
      anexo.alignment = { vertical: "middle", horizontal: "center" };

      const distrito = worksheet.getCell("B4");
      distrito.value = {
        richText: [
          { text: "Dirección Distrital: ", font: { size: 12, bold: true } },
          {
            text: String(distrito_electoral || "Todos"),
            font: { size: 12, bold: true, underline: true },
          },
        ],
      };
      distrito.alignment = { vertical: "middle", horizontal: "left" };

      const cellFecha = worksheet.getCell("H4");
      cellFecha.value = {
        richText: [
          { text: "Fecha: ", font: { size: 12, bold: true } },
          { text: fechaFormateada, font: { size: 12, bold: true, underline: true } },
        ],
      };
      cellFecha.alignment = { vertical: "middle", horizontal: "left" };

      worksheet.mergeCells("C3:F3");
      const tituloLargo = worksheet.getCell("C3");
      tituloLargo.value =
        "Número de Instancias Representativas de\n" +
        "Pueblos y Barrios Originarios y Comunidades Indígenas\n" +
        "y Afromexicanas Residentes en la Ciudad de México";
      tituloLargo.font = { size: 12, bold: true };
      tituloLargo.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

      worksheet.getRow(3).height = 50;
      worksheet.getRow(5).height = 50;

      worksheet.addRow(headers);
      worksheet.columns = headers.map(() => ({ width: 25 }));

      worksheet.getRow(6).eachCell((cell) => {
        cell.font = { bold: true, size: 11 };
        cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      worksheet.autoFilter = { from: "A6", to: `${String.fromCharCode(65 + headers.length - 1)}6` };

      tabla.forEach((row) => {
        worksheet.addRow(Object.values(row));
      });
    };

    // Hoja 1: Indígenas
    const hoja1 = workbook.addWorksheet("Pueblos y Comunidades Indígenas");
    crearHojaConEstilo(
      hoja1,
      "Número de instancias representativas de pueblos, barrios y comunidades indígenas",
      ["Demarcación", "Pueblos Originarios", "Pueblos", "Barrios", "Comunidades Indígenas", "UT", "Otros", "Total"],
      tabla1,
      "ANEXO 3"
    );

    // Hoja 2: Afromexicanas
    const hoja2 = workbook.addWorksheet("Comunidades Afromexicanas");
    crearHojaConEstilo(
      hoja2,
      "Número de instancias representativas, organizaciones y personas relevantes pertenecientes a pueblos y comunidades afromexicanas",
      ["Demarcación", "Pueblos", "Comunidades", "Organizaciones", "Personas Relevantes", "Otros", "Total"],
      tabla2,
      "ANEXO 4"
    );

    // Enviar Excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=reporte_instancias.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al generar el reporte");
  }
});


//reporte catalogo de instituciones y personas para acompañamiento
router.get("/reporteInstituciones", Midleware.verifyToken, async (req, res) => {

  const { distrito_electoral } = req.query;



  // fecha y hora
  const original = new Date();
  const offsetInMs = original.getTimezoneOffset() * 60000;
  const fechaLocal = new Date(original.getTime() - offsetInMs);

  // convertir a DD/MM/YYYY
  const fechaFormateada = fechaLocal.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  try {


    const pool = await connectToDatabase();

    const result = await pool.request()
      .input("distrito_electoral", sql.Int, distrito_electoral)
      .query(`
            select ROW_NUMBER() OVER(ORDER BY ri.id) AS numero_consecutivo,
            cd.direccion_distrital,
            dt.demarcacion_territorial,
            ri.nombre_completo,
            ri.fotografia,
            cpo.pueblo_originario,
            cp.pueblo,
            cb.barrio,
            ut.ut,
            ri.otro,
            c.comunidad,
            ri.interes_profesional,
            ri.nombre_institucion,
            ri.cargo,
            ri.domicilio,
            ri.telefono,
            ri.correo_electronico,
            ri.cv_enlace
            from registro_instituciones ri 
            join demarcacion_territorial dt on ri.demarcacion_territorial = dt.id
            join cat_distrito cd on ri.distrito_electoral = cd.id 
            left join cat_pueblos_originarios cpo on ri.pueblo_originario = cpo.id 
            left join cat_pueblos cp on ri.pueblo = cp.id
            left join cat_barrios cb on ri.barrio = cb.id 
            left join unidad_territorial ut on ri.unidad_territorial = ut.id 
            join comunidad c on ri.comunidad = c.id
              where (1=1${distrito_electoral ? ' AND ri.distrito_electoral = @distrito_electoral' : ''})`);

    const rows = result.recordset;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("NombreDelReporte");

    //inserta imgaen
    const logoPath = path.join(__dirname, '../../assets/iecm.png');
    const logoId = workbook.addImage({
      filename: logoPath,
      extension: "png",
    });

    worksheet.addImage(logoId, {
      tl: { col: 0.1, row: 0.1 },
      ext: { width: 150, height: 70 },
    });


    worksheet.mergeCells("B3:Q3");
    const titulo = worksheet.getCell("B3:Q3");
    titulo.value =
      "Catálogo de Propuestas de Instituciones, Académicos, Investigadores y/o Especialistas susceptibles de participar en el acompañamiento al \n" +
      "Instituto electoral de la Ciudad de México en la instrumentación de la Consulta de los Pueblos y Barrios Originarios y \n" +
      "Comunidades Indígenas y Afromexicanas Residentes de la Ciudad de México";
    titulo.font = { size: 14, bold: true };
    titulo.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true
    };

    worksheet.getColumn(5).width = 40;

    worksheet.mergeCells("I1:I2");
    const anexo = worksheet.getCell("I1");
    anexo.value =
      "ANEXO 7";
    anexo.font = {
      size: 27,
      bold: true,
      color: { argb: "FF6F42C1" }
    };
    anexo.alignment = { vertical: "middle", horizontal: "center" };

    const distrito = worksheet.getCell("B4");
    distrito.value = {
      richText: [
        { text: "Dirección Distrital: ", font: { size: 12, bold: true } },
        { text: String(distrito_electoral), font: { size: 12, bold: true, underline: true } }
      ]
    };
    distrito.alignment = { vertical: "middle", horizontal: "left" };


    const cellFecha = worksheet.getCell("P4");
    cellFecha.value = {
      richText: [
        { text: "Fecha: ", font: { size: 12, bold: true } },
        { text: String(fechaFormateada), font: { size: 12, bold: true, underline: true } }
      ]
    };
    cellFecha.alignment = { vertical: "middle", horizontal: "left" };

    // Ajustar alto
    worksheet.getRow(3).height = 50;

    worksheet.addRow([]);

    const headers = [
      "No.", "DD", "Demarcación", "Nombre (s) y apellidos completos",
      "Foto", "Pueblo Originario", "Pueblo", "Barrio",
      "Unidad Territorial", "Otro", "Comunidad Indígena/Afromexicana", "Interés Profesional",
      "Datos de la Institución a la que pertenece", "Cargo", "Domicilio",
      "Teléfono", "Correo Electrónico", "Documentos y/o Curriculum vitae(en su caso)"
    ];

    worksheet.addRow(headers);
    worksheet.columns = headers.map(() => ({ width: 20 }));


    worksheet.getRow(6).eachCell((cell) => {
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
    });

    // Filtros
    worksheet.autoFilter = {
      from: "A6",
      to: "R6",
    };

    rows.forEach((row) => {
      //zip
      const nombreArchivo = row.cv_enlace
        ? path.basename(row.cv_enlace)
        : "";

      const archivo =
        nombreArchivo
          ? { text: nombreArchivo, hyperlink: `${API_BASE_URL}/api/descargaDoc/downloadOtrosNorma/${nombreArchivo}` }
          : "";

      //foto
      const nombreFoto = row.fotografia
        ? path.basename(row.fotografia)
        : "";

      const foto =
        nombreFoto
          ? { text: nombreFoto, hyperlink: `${API_BASE_URL}/api/descargaDoc/downloadFoto/${nombreFoto}` }
          : "";

      const rowExcel = worksheet.addRow([
        row.numero_consecutivo,
        row.direccion_distrital,
        row.demarcacion_territorial,
        row.nombre_completo,
        foto,
        row.pueblo_originario,
        row.pueblo,
        row.barrio,
        row.ut,
        row.otro,
        row.comunidad,
        row.interes_profesional,
        row.nombre_institucion,
        row.cargo,
        row.domicilio,
        row.telefono,
        row.correo_electronico,
        archivo
      ]);

      const cellUbicacion = rowExcel.getCell(5);
      const cellArchivo = rowExcel.getCell(18);

      [cellUbicacion, cellArchivo].forEach(cell => {
        cell.font = { color: { argb: 'FF0000FF' }, underline: true };
      });
    });


    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=reporte.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al generar el reporte");
  }

});


//Rporte de mayor afluencia
router.get("/reporteAfluencia", Midleware.verifyToken, async (req, res) => {

  const { distrito_electoral } = req.query;


  // fecha y hora
  const original = new Date();
  const offsetInMs = original.getTimezoneOffset() * 60000;
  const fechaLocal = new Date(original.getTime() - offsetInMs);

  // convertir a DD/MM/YYYY
  const fechaFormateada = fechaLocal.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  try {


    const pool = await connectToDatabase();

    const result = await pool.request()
      .input("distrito_electoral", sql.Int, distrito_electoral)
      .query(`select           
              ROW_NUMBER() OVER(ORDER BY ra.id) AS numero_consecutivo,
              dt.demarcacion_territorial,
              ra.denominacion_lugar,
              ra.domicilio_lugar,
              ra.enlace_ubicacion,
              ra.enlace_foto,
              ra.observaciones 
              from registro_afluencia ra 
              join demarcacion_territorial dt on ra.demarcacion_territorial = dt.id 
              WHERE  (ra.modulo_registro = 1${distrito_electoral ? ' AND ra.distrito_electoral =  @distrito_electoral' : ''})
            `);

    const rows = result.recordset;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("NombreDelReporte");

    //inserta imgaen
    const logoPath = path.join(__dirname, '../../assets/iecm.png');
    const logoId = workbook.addImage({
      filename: logoPath,
      extension: "png",
    });

    worksheet.addImage(logoId, {
      tl: { col: 0.1, row: 0.1 },
      ext: { width: 150, height: 70 },
    });


    worksheet.mergeCells("B3:L3");
    const titulo = worksheet.getCell("B3:L3");
    titulo.value =
      "Registro de lugares de mayor afluencia comunitaria\n" +
      "de los Pueblos, Barrios y Comunidades Indígenas y Afromexicanas"
    titulo.font = { size: 13, bold: true };
    titulo.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true
    };

    worksheet.mergeCells("G1:G2");
    const anexo = worksheet.getCell("G1");
    anexo.value =
      "ANEXO 4";
    anexo.font = {
      size: 27,
      bold: true,
      color: { argb: "FF6F42C1" }
    };
    anexo.alignment = { vertical: "middle", horizontal: "center" };

    const distrito = worksheet.getCell("B4");
    distrito.value = {
      richText: [
        { text: "Dirección Distrital: ", font: { size: 12, bold: true } },
        { text: String(distrito_electoral), font: { size: 12, bold: true, underline: true } }
      ]
    };
    distrito.alignment = { vertical: "middle", horizontal: "left" };

    const numRep = worksheet.getCell("B5");
    numRep.value = {
      richText: [
        { text: "Órgano Desconcentrado Cabecera de Demarcación: ", font: { size: 12, bold: true } },
        { text: String(distrito_electoral), font: { size: 12, bold: true, underline: true } }
      ]
    };
    numRep.alignment = { vertical: "middle", horizontal: "left" };


    const cellFecha = worksheet.getCell("G5");
    cellFecha.value = {
      richText: [
        { text: "Fecha y período: ", font: { size: 12, bold: true } },
        { text: String(fechaFormateada), font: { size: 12, bold: true, underline: true } }
      ]
    };
    cellFecha.alignment = { vertical: "middle", horizontal: "left" };

    // Ajustar alto
    worksheet.getRow(3).height = 60;

    worksheet.addRow([]);

    const headers = [
      "No.",
      "Demarcación Territorial",
      "Denominación Del Lugar",
      "Domicilio del Lugar",
      "Ubicacion georreferenciada kml",
      "Foto del lugar",
      "Observaciones"
    ];

    worksheet.addRow(headers);
    worksheet.columns = headers.map(() => ({ width: 20 }));


    worksheet.getRow(7).eachCell((cell) => {
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
    });

    // Filtros
    worksheet.autoFilter = {
      from: "A7",
      to: "G7",
    };


    rows.forEach((row) => {
      //zip
      const nombreArchivo = row.enlace_foto
        ? path.basename(row.enlace_foto)
        : "";

      const archivo =
        nombreArchivo
          ? { text: nombreArchivo, hyperlink: `${API_BASE_URL}/api/descargaDoc/downloadOtrosNorma/${nombreArchivo}` }
          : "";

      //kml
      const nombreUbicacion = row.enlace_ubicacion
        ? path.basename(row.enlace_ubicacion)
        : "";

      const ubicacion =
        nombreUbicacion
          ? { text: nombreUbicacion, hyperlink: `${API_BASE_URL}/api/descargaDoc/download/${nombreUbicacion}` }
          : "";


        const rowExcel = worksheet.addRow([
        row.numero_consecutivo,
        row.demarcacion_territorial,
        row.denominacion_lugar,
        row.domicilio_lugar,
        ubicacion,
        archivo,
        row.observaciones
      ]);
    

      const cellUbicacion = rowExcel.getCell(5);
      const cellArchivo = rowExcel.getCell(6);

      [cellUbicacion, cellArchivo].forEach(cell => {
        cell.font = { color: { argb: 'FF0000FF' }, underline: true };
      });
    });


    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=reporte.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al generar el reporte");
  }

});


// Reporte de atencion a consultas
router.get("/reporteAtencion", Midleware.verifyToken, async (req, res) => {

  const { distrito_electoral } = req.query;



  // fecha y hora
  const original = new Date();
  const offsetInMs = original.getTimezoneOffset() * 60000;
  const fechaLocal = new Date(original.getTime() - offsetInMs);

  // convertir a DD/MM/YYYY
  const fechaFormateada = fechaLocal.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  try {


    const pool = await connectToDatabase();

    const result = await pool.request()
      .input("distrito_electoral", sql.Int, distrito_electoral)
      .query(`
            select ac.numero_consecutivo,
            ac.fecha_consulta,
            ac.nombre_completo,
            cpo.pueblo_originario,
            cp.pueblo,
            cb.barrio,
            ut.ut,
            ac.otro,
            ac.cargo,
            ac.descripcion_consulta,
            ac.forma_atendio,
            ac.observaciones,
            ac.enlace_documento 
            from atencion_consultas ac 
            left join cat_pueblos_originarios cpo on ac.pueblo_originario = cpo.id 
            left join cat_pueblos cp on ac.pueblo = cp.id
            left join cat_barrios cb on ac.barrio = cb.id 
            left join unidad_territorial ut on ac.unidad_territorial = ut.id
            WHERE  (ac.modulo_registro = 1${distrito_electoral ? ' AND ac.distrito_electoral =  @distrito_electoral' : ''})
          `);

    const rows = result.recordset;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("NombreDelReporte");

    //inserta imgaen
    const logoPath = path.join(__dirname, '../../assets/iecm.png');
    const logoId = workbook.addImage({
      filename: logoPath,
      extension: "png",
    });

    worksheet.addImage(logoId, {
      tl: { col: 0.1, row: 0.1 },
      ext: { width: 150, height: 70 },
    });


    worksheet.mergeCells("B3:L3");
    const titulo = worksheet.getCell("B3:L3");
    titulo.value =
      "Reporte de actividades sobre la atención en los Órganos Desconcentrados a las consultas que, en su caso, \n" +
      "realicen las Instancias Representativas, Autoridades Tradicionales, así como la población indígena y/o afromexicana \n" +
      "sobre temas de geografía, organización, mecanismos de participación ciudadana y otro tipo de ejercicios democráticos";
    titulo.font = { size: 13, bold: true };
    titulo.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true
    };

    worksheet.mergeCells("G1:G2");
    const anexo = worksheet.getCell("G1");
    anexo.value =
      "ANEXO 6";
    anexo.font = {
      size: 27,
      bold: true,
      color: { argb: "FF6F42C1" }
    };
    anexo.alignment = { vertical: "middle", horizontal: "center" };

    const distrito = worksheet.getCell("B4");
    distrito.value = {
      richText: [
        { text: "Dirección Distrital: ", font: { size: 12, bold: true } },
        { text: String(distrito_electoral), font: { size: 12, bold: true, underline: true } }
      ]
    };
    distrito.alignment = { vertical: "middle", horizontal: "left" };

    const numRep = worksheet.getCell("B5");
    numRep.value = {
      richText: [
        { text: "Número de Reporte: ", font: { size: 12, bold: true } },
        { text: String(""), font: { size: 12, bold: true, underline: true } }
      ]
    };
    numRep.alignment = { vertical: "middle", horizontal: "left" };


    const cellFecha = worksheet.getCell("B6");
    cellFecha.value = {
      richText: [
        { text: "Fecha y período: ", font: { size: 12, bold: true } },
        { text: String(fechaFormateada), font: { size: 12, bold: true, underline: true } }
      ]
    };
    cellFecha.alignment = { vertical: "middle", horizontal: "left" };

    // Ajustar alto
    worksheet.getRow(3).height = 60;

    worksheet.addRow([]);

    const headers = [
      "Número consecutivo de Consulta", "Fecha de la consulta", "Nombre Completo",
      "Pueblo Originario", "Pueblo", "Barrio",
      "Unidad Territorial", "Otro",
      "Cargo que ocupa", "Describa la consulta",
      "Forma en la que se atendió la consulta", "Observaciones y/o precisiones", "Solicitudes y documentos (en caso)"
    ];

    worksheet.addRow(headers);
    worksheet.columns = headers.map(() => ({ width: 20 }));


    worksheet.getRow(8).eachCell((cell) => {
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
    });

    // Filtros
    worksheet.autoFilter = {
      from: "A8",
      to: "M8",
    };

    rows.forEach((row) => {
      //zip
      const nombreArchivo = row.enlace_documento
        ? path.basename(row.enlace_documento)
        : "";

      const enlace =
        nombreArchivo
          ? { text: nombreArchivo, hyperlink: `${API_BASE_URL}/api/descargaDoc/downloadOtrosNorma/${nombreArchivo}` }
          : "";


      const rowExcel = worksheet.addRow([
        row.numero_consecutivo,
        row.fecha_consulta,
        row.nombre_completo,
        row.pueblo_originario,
        row.pueblo,
        row.barrio,
        row.ut,
        row.otro,
        row.cargo,
        row.descripcion_consulta,
        row.forma_atendio,
        row.observaciones,
        enlace
      ]);
      
      const cellArchivo = rowExcel.getCell(13);

      [cellArchivo].forEach(cell => {
        cell.font = { color: { argb: 'FF0000FF' }, underline: true };
      });

    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=reporte.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al generar el reporte");
  }

});


// reporte atencion by id registros
router.get("/reporteAtencionById", Midleware.verifyToken, async (req, res) => {

  const { distrito_electoral, id_registro } = req.query;

  if (!id_registro) {
    return res.status(400).json({ message: "Datos requeridos" });
  }

  // fecha y hora
  const original = new Date();
  const offsetInMs = original.getTimezoneOffset() * 60000;
  const fechaLocal = new Date(original.getTime() - offsetInMs);

  // convertir a DD/MM/YYYY
  const fechaFormateada = fechaLocal.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  try {
    const ids = id_registro.split(",").map(id => parseInt(id.trim())).filter(Number.isInteger);

    if (ids.length === 0) {
      return res.status(400).json({ message: "Debes enviar al menos un id_registro válido" });
    }

    const idsString = ids.join(",");


    const pool = await connectToDatabase();

    const result = await pool.request()
      .input("distrito_electoral", sql.Int, distrito_electoral)
      .query(`
            select ac.numero_consecutivo,
            ac.fecha_consulta,
            ac.nombre_completo,
            cpo.pueblo_originario,
            cp.pueblo,
            cb.barrio,
            ut.ut,
            ac.otro,
            ac.cargo,
            ac.descripcion_consulta,
            ac.forma_atendio,
            ac.observaciones,
            ac.enlace_documento 
            from atencion_consultas ac 
            left join cat_pueblos_originarios cpo on ac.pueblo_originario = cpo.id 
            left join cat_pueblos cp on ac.pueblo = cp.id
            left join cat_barrios cb on ac.barrio = cb.id 
            left join unidad_territorial ut on ac.unidad_territorial = ut.id
            WHERE (ac.modulo_registro = 1${distrito_electoral ? ' AND ac.distrito_electoral =  @distrito_electoral' : ''})AND ac.id IN (${idsString})
          `);

    const rows = result.recordset;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("NombreDelReporte");

    //inserta imgaen
    const logoPath = path.join(__dirname, '../../assets/iecm.png');
    const logoId = workbook.addImage({
      filename: logoPath,
      extension: "png",
    });

    worksheet.addImage(logoId, {
      tl: { col: 0.1, row: 0.1 },
      ext: { width: 150, height: 70 },
    });


    worksheet.mergeCells("B3:L3");
    const titulo = worksheet.getCell("B3:L3");
    titulo.value =
      "Reporte de actividades sobre la atención en los Órganos Desconcentrados a las consultas que, en su caso, \n" +
      "realicen las Instancias Representativas, Autoridades Tradicionales, así como la población indígena y/o afromexicana \n" +
      "sobre temas de geografía, organización, mecanismos de participación ciudadana y otro tipo de ejercicios democráticos";
    titulo.font = { size: 13, bold: true };
    titulo.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true
    };

    worksheet.mergeCells("G1:G2");
    const anexo = worksheet.getCell("G1");
    anexo.value =
      "ANEXO 6";
    anexo.font = {
      size: 27,
      bold: true,
      color: { argb: "FF6F42C1" }
    };
    anexo.alignment = { vertical: "middle", horizontal: "center" };

    const distrito = worksheet.getCell("B4");
    distrito.value = {
      richText: [
        { text: "Dirección Distrital: ", font: { size: 12, bold: true } },
        { text: String(distrito_electoral), font: { size: 12, bold: true, underline: true } }
      ]
    };
    distrito.alignment = { vertical: "middle", horizontal: "left" };

    const numRep = worksheet.getCell("B5");
    numRep.value = {
      richText: [
        { text: "Número de Reporte: ", font: { size: 12, bold: true } },
        { text: String(""), font: { size: 12, bold: true, underline: true } }
      ]
    };
    numRep.alignment = { vertical: "middle", horizontal: "left" };


    const cellFecha = worksheet.getCell("B6");
    cellFecha.value = {
      richText: [
        { text: "Fecha y período: ", font: { size: 12, bold: true } },
        { text: String(fechaFormateada), font: { size: 12, bold: true, underline: true } }
      ]
    };
    cellFecha.alignment = { vertical: "middle", horizontal: "left" };

    // Ajustar alto
    worksheet.getRow(3).height = 60;

    worksheet.addRow([]);

    const headers = [
      "Número consecutivo de Consulta", "Fecha de la consulta", "Nombre Completo",
      "Pueblo Originario", "Pueblo", "Barrio",
      "Unidad Territorial", "Otro",
      "Cargo que ocupa", "Describa la consulta",
      "Forma en la que se atendió la consulta", "Observaciones y/o precisiones", "Solicitudes y documentos (en caso)"
    ];

    worksheet.addRow(headers);
    worksheet.columns = headers.map(() => ({ width: 20 }));


    worksheet.getRow(8).eachCell((cell) => {
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
    });

    // Filtros
    worksheet.autoFilter = {
      from: "A8",
      to: "M8",
    };

    const rowExcel =rows.forEach((row) => {
      //zip
      const nombreArchivo = row.enlace_documento
        ? path.basename(row.enlace_documento)
        : "";

      const enlace =
        nombreArchivo
          ? { text: nombreArchivo, hyperlink: `${API_BASE_URL}/api/descargaDoc/downloadOtrosNorma/${nombreArchivo}` }
          : "";

      const rowExcel= worksheet.addRow([
        row.numero_consecutivo,
        row.fecha_consulta,
        row.nombre_completo,
        row.pueblo_originario,
        row.pueblo,
        row.barrio,
        row.ut,
        row.otro,
        row.cargo,
        row.descripcion_consulta,
        row.forma_atendio,
        row.observaciones,
        enlace
      ]);

      const cellArchivo = rowExcel.getCell(13);

      [cellArchivo].forEach(cell => {
        cell.font = { color: { argb: 'FF0000FF' }, underline: true };
      });


    });


    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=reporte.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al generar el reporte");
  }

});



//Reporte asambleas comunitarias
router.get("/reporteAsamblea", Midleware.verifyToken, async (req, res) => {

  const { distrito_electoral } = req.query;


  const original = new Date();
  const offsetInMs = original.getTimezoneOffset() * 60000;
  const fechaLocal = new Date(original.getTime() - offsetInMs);

  const fechaFormateada = fechaLocal.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  try {


    const pool = await connectToDatabase();

    const result = await pool.request()
      .input("distrito_electoral", sql.Int, distrito_electoral)
      .query(`
            select ROW_NUMBER() OVER(ORDER BY rl.id) AS numero_consecutivo,
            rl.distrito_electoral,
            dt.demarcacion_territorial,
            rl.lugar_espacio,
            rl.domicilio,
            rl.enlace_ubicacion,
            rl.enlace_fotografia,
            rl.intitucion_propietaria,
            CASE 
              when rl.prestamo_iecm = 0 then 'No'
              else 'Si' 
            END as prestamo_iecm,
            CASE 
              when rl.nuevo_prestamo = 0 then 'No'
              else 'Si' 
            END as nuevo_prestamo,
            rl.superficie_espacio,
            rl.aforo,
            CASE 
              when rl.ventilacion = 0 then 'No'
              else 'Si' 
            END as ventilacion,
            rl.observaciones 
            from registro_lugares rl 
            join demarcacion_territorial dt on  rl.demarcacion = dt.id
            WHERE  (rl.modulo_registro = 1${distrito_electoral ? ' AND rl.distrito_electoral =  @distrito_electoral' : ''})
          `);

    const rows = result.recordset;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("NombreDelReporte");

    //inserta imgaen
    const logoPath = path.join(__dirname, '../../assets/iecm.png');
    const logoId = workbook.addImage({
      filename: logoPath,
      extension: "png",
    });

    worksheet.addImage(logoId, {
      tl: { col: 0.1, row: 0.1 },
      ext: { width: 150, height: 70 },
    });

    const cellFecha = worksheet.getCell("O4");
    cellFecha.value = {
      richText: [
        { text: "Fecha: ", font: { size: 12, bold: true } },
        { text: String(fechaFormateada), font: { size: 12, bold: true, underline: true } }
      ]
    };
    cellFecha.alignment = { vertical: "middle", horizontal: "left" };

    const cellA3 = worksheet.getCell("B4");
    cellA3.value = {
      richText: [
        { text: "Dirección Distrital: ", font: { size: 12, bold: true } },
        { text: String(distrito_electoral), font: { size: 12, bold: true, underline: true } }
      ]
    };
    cellA3.alignment = { vertical: "middle", horizontal: "left" };

    worksheet.mergeCells("B1:P1");
    const anexo = worksheet.getCell("B1");
    anexo.value =
      "ANEXO 5";
    anexo.font = {
      size: 27,
      bold: true,
      color: { argb: "FF6F42C1" }
    };
    anexo.alignment = { vertical: "middle", horizontal: "center" };


    worksheet.mergeCells("B3:P3");
    const titulo = worksheet.getCell("B3");
    titulo.value =
      "Propuestas de lugares y espacios para la eventual realización de Asambleas Ciudadanas \n" +
      "de Consulta a Pueblos y Barrios Originarios y Comunidades Indígenas Residentes en la Ciudad de México"
    titulo.font = {
      size: 14,
      bold: true
    };
    titulo.alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getRow(3).height = 60;

    // Filtros
    worksheet.autoFilter = {
      from: "A7",
      to: "Q7",
    };

    worksheet.mergeCells("A6:A7");
    worksheet.getCell("A6").value = "No.";
    worksheet.getCell("A6").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    worksheet.getCell("A6").font = { bold: true };

    worksheet.mergeCells("B6:B7");
    worksheet.getCell("B6").value = "DD";
    worksheet.getCell("B6").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    worksheet.getCell("B6").font = { bold: true };

    worksheet.mergeCells("C6:C7");
    worksheet.getCell("C6").value = "Demarcación Territorial";
    worksheet.getCell("C6").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    worksheet.getCell("C6").font = { bold: true };

    worksheet.mergeCells("D6:D7");
    worksheet.getCell("D6").value = "Denominación del lugar o espacio";
    worksheet.getCell("D6").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    worksheet.getCell("D6").font = { bold: true };

    worksheet.mergeCells("E6:E7");
    worksheet.getCell("E6").value = "Domicilio";
    worksheet.getCell("E6").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    worksheet.getCell("E6").font = { bold: true };

    worksheet.mergeCells("F6:F7");
    worksheet.getCell("F6").value = "Ubicación georreferenciada kml";
    worksheet.getCell("F6").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    worksheet.getCell("F6").font = { bold: true };

    worksheet.mergeCells("G6:G7");
    worksheet.getCell("G6").value = "Foto del lugar";
    worksheet.getCell("G6").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    worksheet.getCell("G6").font = { bold: true };

    worksheet.mergeCells("H6:H7");
    worksheet.getCell("H6").value = "Institución propietaria, encargada o responsable del lugar o espacio";
    worksheet.getCell("H6").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    worksheet.getCell("H6").font = { bold: true };

    //SUB COLUMNAS
    worksheet.mergeCells("I6:J6");
    worksheet.getCell("I6").value = "¿Ha sido facilitado el préstamo al IECM con anterioridad?";
    worksheet.getCell("I6").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    worksheet.getCell("I6").font = { bold: true };
    worksheet.getCell("I7").value = "Sí";
    worksheet.getCell("J7").value = "No";

    worksheet.mergeCells("K6:L6");
    worksheet.getCell("K6").value = "¿Considera que sea posible un nuevo préstamo al IECM?";
    worksheet.getCell("K6").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    worksheet.getCell("K6").font = { bold: true };
    worksheet.getCell("K7").value = "Sí";
    worksheet.getCell("L7").value = "No";

    worksheet.mergeCells("M6:M7");
    worksheet.getCell("M6").value = "Superficie aproximada en m2 del lugar o espacio";
    worksheet.getCell("M6").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    worksheet.getCell("M6").font = { bold: true };

    worksheet.mergeCells("N6:N7");
    worksheet.getCell("N6").value = "Aforo (Capacidad de sillas, butacas o asientos)";
    worksheet.getCell("N6").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    worksheet.getCell("N6").font = { bold: true };

    worksheet.mergeCells("O6:P6");
    worksheet.getCell("O6").value = "Suficiente ventilación como medida preventiva Sanitaria";
    worksheet.getCell("O6").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    worksheet.getCell("O6").font = { bold: true };
    worksheet.getCell("O7").value = "Sí";
    worksheet.getCell("P7").value = "No";

    worksheet.mergeCells("Q6:Q7");
    worksheet.getCell("Q6").value = "Observaciones";
    worksheet.getCell("Q6").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    worksheet.getCell("Q6").font = { bold: true };

    ["I7", "J7", "K7", "L7", "O7", "P7"].forEach(c => {
      worksheet.getCell(c).alignment = { horizontal: "center", vertical: "middle" };
      worksheet.getCell(c).font = { bold: true };
    });

    worksheet.columns.forEach((col, i) => {
      col.width = 25;
    });

    worksheet.getColumn(9).width = 40;

    const headerRows = [6, 7];

    headerRows.forEach(rowNumber => {
      worksheet.getRow(rowNumber).eachCell(cell => {
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
      });
    });



    rows.forEach((row) => {
      //zip
      const nombreArchivo = row.enlace_fotografia
        ? path.basename(row.enlace_fotografia)
        : "";

      const archivo =
        nombreArchivo
          ? { text: nombreArchivo, hyperlink: `${API_BASE_URL}/api/descargaDoc/downloadOtrosNorma/${nombreArchivo}` }
          : "";

      //kml
      const nombreUbicacion = row.enlace_ubicacion
        ? path.basename(row.enlace_ubicacion)
        : "";

      const ubicacion =
        nombreUbicacion
          ? { text: nombreUbicacion, hyperlink: `${API_BASE_URL}/api/descargaDoc/download/${nombreUbicacion}` }
          : "";

      const rowExcel = worksheet.addRow([
        row.numero_consecutivo,
        row.distrito_electoral,
        row.demarcacion_territorial,
        row.lugar_espacio,
        row.domicilio,
        ubicacion,
        archivo,
        row.intitucion_propietaria,
        row.prestamo_iecm === "Si" ? "X" : "",
        row.prestamo_iecm === "No" ? "X" : "",
        row.nuevo_prestamo === "Si" ? "X" : "",
        row.nuevo_prestamo === "No" ? "X" : "",
        row.superficie_espacio,
        row.aforo,
        row.ventilacion === "Si" ? "X" : "",
        row.ventilacion === "No" ? "X" : "",
        row.observaciones
      ]);
      
      const cellUbicacion = rowExcel.getCell(6);
      const cellArchivo = rowExcel.getCell(7);

      [cellUbicacion, cellArchivo].forEach(cell => {
        cell.font = { color: { argb: 'FF0000FF' }, underline: true };
      });

    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=reporte.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al generar el reporte");
  }

});


export default router;
