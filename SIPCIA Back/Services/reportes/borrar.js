// ---- Encabezados de varias filas ----
worksheet.mergeCells("I6:J6");
worksheet.getCell("I6").value = "¿Ha sido facilitado el préstamo al IECM con anterioridad?";
worksheet.getCell("I6").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
worksheet.getCell("I6").font = { bold: true };

// Subencabezados
worksheet.getCell("I7").value = "Sí";
worksheet.getCell("J7").value = "No";
worksheet.getCell("I7").alignment = { horizontal: "center" };
worksheet.getCell("J7").alignment = { horizontal: "center" };
worksheet.getCell("I7").font = { bold: true };
worksheet.getCell("J7").font = { bold: true };

worksheet.mergeCells("K6:L6");
worksheet.getCell("K6").value = "¿Considera que sea posible un nuevo préstamo al IECM?";
worksheet.getCell("K6").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
worksheet.getCell("K6").font = { bold: true };

worksheet.getCell("K7").value = "Sí";
worksheet.getCell("L7").value = "No";
worksheet.getCell("K7").alignment = { horizontal: "center" };
worksheet.getCell("L7").alignment = { horizontal: "center" };
worksheet.getCell("K7").font = { bold: true };
worksheet.getCell("L7").font = { bold: true };
