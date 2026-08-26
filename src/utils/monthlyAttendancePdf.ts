import { jsPDF } from "jspdf";
import autoTable, { RowInput, UserOptions } from "jspdf-autotable";
import { MonthlyReportMatrixData } from "./monthlyReportEngine";

/**
 * Generates and downloads the exact LaTeX-template styled Monthly Attendance PDF report.
 * Matches the layout, multi-row header structure, mini-summary box, 39 data columns,
 * and summary totals (Total Present, Total Absent, Total no of Students, Sign).
 */
export function generateMonthlyAttendancePdf(data: MonthlyReportMatrixData): void {
  // 1. Initialize Landscape A4 Document (297mm x 210mm)
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const leftMargin = 10;
  const rightMargin = 10;
  const topMargin = 10;

  // --- Top Section: 3 Columns matching LaTeX minipages ---
  // Left Minipage: School Name line & Academic Year
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  const schoolTitle = data.schoolName ? `${data.schoolName.toUpperCase()}` : "CLASSROOM ATTENDANCE";
  doc.text(schoolTitle, leftMargin, topMargin + 4);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Class: ${data.className}`, leftMargin, topMargin + 9);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(`Academic Year: ${data.academicYear}`, leftMargin, topMargin + 15);

  // Center Minipage: "Attendance For The Month Of" & Month Name
  const centerX = pageWidth / 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Attendance For The Month Of", centerX, topMargin + 5, { align: "center" });
  doc.setFontSize(11.5);
  doc.text(data.monthName.toUpperCase(), centerX, topMargin + 12, { align: "center" });
  
  // Underline for month title
  const monthTextWidth = doc.getTextWidth(data.monthName.toUpperCase());
  doc.setLineWidth(0.3);
  doc.line(centerX - (monthTextWidth / 2) - 4, topMargin + 14, centerX + (monthTextWidth / 2) + 4, topMargin + 14);

  // Right Minipage: Summary Box Mini-Table
  // Layout matching LaTeX tabular:
  // | Current month | WD | ID | Total WD | Total ID |
  // |               | 22 | 22 | 95       | 95       |
  // | Cumulative: Beginning of term to current month | PCA: <avg/val> |
  const rightTableX = pageWidth - rightMargin - 85;
  const rightTableY = topMargin;

  const options = data.options || {};
  const showTa = options.includeTa !== false;
  const showTaPercent = options.includeTaPercent !== false;
  const showPca = options.includePca !== false;
  const showTca = options.includeTca !== false;
  const showTcaPercent = options.includeTcaPercent !== false;

  autoTable(doc, {
    startY: rightTableY,
    margin: { left: rightTableX, right: rightMargin },
    theme: "plain",
    tableWidth: 85,
    styles: {
      fontSize: 6.5,
      cellPadding: 1.2,
      lineColor: [0, 0, 0],
      lineWidth: 0.15,
      textColor: [0, 0, 0],
      font: "helvetica",
      halign: "center",
      valign: "middle",
    },
    headStyles: {
      fontStyle: "bold",
      fillColor: [245, 245, 245],
    },
    head: [
      [
        { content: "Current month", styles: { halign: "left", fontStyle: "bold" } },
        { content: "WD", styles: { fontStyle: "bold" } },
        { content: "ID", styles: { fontStyle: "bold" } },
        { content: "Total WD", styles: { fontStyle: "bold" } },
        { content: "Total ID", styles: { fontStyle: "bold" } },
      ],
    ],
    body: [
      [
        { content: "", styles: { halign: "left" } },
        { content: String(data.workingDays) },
        { content: String(data.instructionalDays) },
        { content: String(data.totalWorkingDays) },
        { content: String(data.totalInstructionalDays) },
      ],
      [
        {
          content: "Cumulative: Beginning of\nterm to current month",
          styles: { halign: "left", fontStyle: "bold", cellPadding: 1 },
        },
        {
          content: showPca ? `PCA: ${data.totalPca}` : "PCA: -",
          colSpan: 4,
          styles: { fontStyle: "bold", halign: "center" },
        },
      ],
    ],
  });

  // --- Main 39-Column Table ---
  const startMainTableY = topMargin + 22;

  // Build Head Rows
  const headRow1: any[] = [
    { content: "Sl", rowSpan: 2, styles: { halign: "center", valign: "middle" } },
    { content: "Name of the Student", rowSpan: 2, styles: { halign: "left", valign: "middle" } },
    { content: "Adm\nNo", rowSpan: 2, styles: { halign: "center", valign: "middle" } },
    { content: "Days of the Month", colSpan: 31, styles: { halign: "center", fontStyle: "bold" } },
    { content: "Total Monthly\nAttendance", colSpan: 2, styles: { halign: "center", fontStyle: "bold" } },
    { content: "Prev\nCum.", rowSpan: 1, colSpan: 1, styles: { halign: "center", fontStyle: "bold" } },
    { content: "Total Cum.\nAttendance", colSpan: 2, styles: { halign: "center", fontStyle: "bold" } },
  ];

  const headRow2: any[] = [];
  // Sub-headers for Days 1..31
  for (let d = 1; d <= 31; d++) {
    headRow2.push({
      content: String(d),
      styles: {
        halign: "center",
        fontStyle: "bold",
        fillColor: data.sundayDays.has(d)
          ? [240, 240, 240]
          : data.holidayDays.has(d)
          ? [255, 235, 235]
          : [250, 250, 250],
      },
    });
  }
  // Sub-headers for TA, % TA, PCA, TCA, % TCA
  headRow2.push({ content: "TA", styles: { halign: "center", fontStyle: "bold" } });
  headRow2.push({ content: "% TA", styles: { halign: "center", fontStyle: "bold" } });
  headRow2.push({ content: "PCA", styles: { halign: "center", fontStyle: "bold" } });
  headRow2.push({ content: "TCA", styles: { halign: "center", fontStyle: "bold" } });
  headRow2.push({ content: "% TCA", styles: { halign: "center", fontStyle: "bold" } });

  // Build Body Rows (Student Records)
  const bodyRows: RowInput[] = [];

  data.rows.forEach((r) => {
    const rowCells: any[] = [
      { content: String(r.sl), styles: { halign: "center" } },
      {
        content: r.studentName,
        styles: { halign: "left", fontStyle: r.isActive ? "normal" : "italic" },
      },
      { content: r.rollNumber, styles: { halign: "center" } },
    ];

    // Day 1 to 31 values
    for (let d = 1; d <= 31; d++) {
      const val = r.days[d] || "";
      const isSunday = data.sundayDays.has(d);
      const isHoliday = data.holidayDays.has(d);

      let cellFill: [number, number, number] | undefined = undefined;
      let textColor: [number, number, number] | undefined = undefined;
      let textStyle: "normal" | "bold" = "normal";

      if (val === "P") {
        textStyle = "bold";
        textColor = [27, 94, 32]; // Leaf Green Dark (#1b5e20)
        cellFill = [232, 245, 233]; // Light Green background tint (#e8f5e9)
      } else if (val === "A") {
        textStyle = "bold";
        textColor = [183, 28, 28]; // Dark Red (#b71c1c)
        cellFill = [255, 235, 238]; // Light Red background tint (#ffebee)
      } else if (val === "L") {
        textStyle = "bold";
        textColor = [180, 100, 0]; // Dark Yellow / Ochre (#b76e00)
        cellFill = [255, 243, 224]; // Light Yellow / Warm Orange background tint (#fff3e0)
      } else if (isSunday) {
        cellFill = [245, 245, 245];
      } else if (isHoliday) {
        cellFill = [255, 240, 240];
      }

      rowCells.push({
        content: val,
        styles: {
          halign: "center",
          fontStyle: textStyle,
          textColor: textColor,
          fillColor: cellFill,
        },
      });
    }

    // TA, % TA, PCA, TCA, % TCA
    rowCells.push({
      content: showTa ? String(r.ta) : "-",
      styles: { halign: "center", fontStyle: "bold" },
    });
    rowCells.push({
      content: showTaPercent ? `${r.taPercentage}%` : "-",
      styles: { halign: "center" },
    });
    rowCells.push({
      content: showPca ? String(r.pca) : "-",
      styles: { halign: "center" },
    });
    rowCells.push({
      content: showTca ? String(r.tca) : "-",
      styles: { halign: "center", fontStyle: "bold" },
    });
    rowCells.push({
      content: showTcaPercent ? `${r.tcaPercentage}%` : "-",
      styles: { halign: "center", fontStyle: "bold" },
    });

    bodyRows.push(rowCells);
  });

  // Build Summary Footer Rows
  // 1. Total Present
  const totalPresentRow: any[] = [
    {
      content: "Total Present",
      colSpan: 3,
      styles: { halign: "right", fontStyle: "bold", fillColor: [240, 248, 240] },
    },
  ];
  for (let d = 1; d <= 31; d++) {
    const pCount = data.dayTotals.present[d];
    totalPresentRow.push({
      content: d <= data.daysInMonth && pCount > 0 ? String(pCount) : d <= data.daysInMonth ? "0" : "",
      styles: { halign: "center", fontStyle: "bold", fillColor: [240, 248, 240] },
    });
  }
  totalPresentRow.push({
    content: showTa ? String(data.summaryTotals.totalTa) : "-",
    styles: { halign: "center", fontStyle: "bold", fillColor: [240, 248, 240] },
  });
  totalPresentRow.push({ content: "", styles: { fillColor: [240, 248, 240] } });
  totalPresentRow.push({
    content: showPca ? String(data.summaryTotals.totalPca) : "-",
    styles: { halign: "center", fontStyle: "bold", fillColor: [240, 248, 240] },
  });
  totalPresentRow.push({
    content: showTca ? String(data.summaryTotals.totalTca) : "-",
    styles: { halign: "center", fontStyle: "bold", fillColor: [240, 248, 240] },
  });
  totalPresentRow.push({ content: "", styles: { fillColor: [240, 248, 240] } });
  bodyRows.push(totalPresentRow);

  // 2. Total Absent
  const totalAbsentRow: any[] = [
    {
      content: "Total Absent",
      colSpan: 3,
      styles: { halign: "right", fontStyle: "bold", fillColor: [255, 245, 245] },
    },
  ];
  for (let d = 1; d <= 31; d++) {
    const aCount = data.dayTotals.absent[d];
    totalAbsentRow.push({
      content: d <= data.daysInMonth && aCount > 0 ? String(aCount) : d <= data.daysInMonth ? "0" : "",
      styles: { halign: "center", fontStyle: "bold", fillColor: [255, 245, 245] },
    });
  }
  totalAbsentRow.push({ content: "", styles: { fillColor: [255, 245, 245] } });
  totalAbsentRow.push({ content: "", styles: { fillColor: [255, 245, 245] } });
  totalAbsentRow.push({ content: "", styles: { fillColor: [255, 245, 245] } });
  totalAbsentRow.push({ content: "", styles: { fillColor: [255, 245, 245] } });
  totalAbsentRow.push({ content: "", styles: { fillColor: [255, 245, 245] } });
  bodyRows.push(totalAbsentRow);

  // 3. Total no of Students
  const totalStudentsRow: any[] = [
    {
      content: "Total no of Students",
      colSpan: 3,
      styles: { halign: "right", fontStyle: "bold", fillColor: [245, 245, 245] },
    },
  ];
  for (let d = 1; d <= 31; d++) {
    totalStudentsRow.push({
      content: d <= data.daysInMonth ? String(data.dayTotals.totalStudents) : "",
      styles: { halign: "center", fontStyle: "bold", fillColor: [245, 245, 245] },
    });
  }
  totalStudentsRow.push({ content: String(data.dayTotals.totalStudents), styles: { halign: "center", fontStyle: "bold", fillColor: [245, 245, 245] } });
  totalStudentsRow.push({ content: "", styles: { fillColor: [245, 245, 245] } });
  totalStudentsRow.push({ content: "", styles: { fillColor: [245, 245, 245] } });
  totalStudentsRow.push({ content: "", styles: { fillColor: [245, 245, 245] } });
  totalStudentsRow.push({ content: "", styles: { fillColor: [245, 245, 245] } });
  bodyRows.push(totalStudentsRow);

  // 4. Sign Row
  const signRow: any[] = [
    {
      content: "Sign",
      colSpan: 3,
      styles: { halign: "right", fontStyle: "bold", minCellHeight: 6 },
    },
  ];
  for (let d = 1; d <= 31; d++) {
    signRow.push({ content: "" });
  }
  signRow.push({ content: "" });
  signRow.push({ content: "" });
  signRow.push({ content: "" });
  signRow.push({ content: "" });
  signRow.push({ content: "" });
  bodyRows.push(signRow);

  // Column Width Definitions (39 Columns Total)
  // Total printable width = 277mm
  // Sl: 6.5mm, Name: 37mm, AdmNo: 11mm
  // Days 1..31: 4.6mm * 31 = 142.6mm
  // TA: 9mm, % TA: 11.5mm, PCA: 10mm, TCA: 10mm, % TCA: 12.5mm
  // Sum = 6.5 + 37 + 11 + 142.6 + 9 + 11.5 + 10 + 10 + 12.5 = 250.1mm (Perfect fit!)
  const columnStylesConfig: { [key: number]: any } = {
    0: { cellWidth: 6.5, halign: "center" }, // Sl
    1: { cellWidth: 37, halign: "left" }, // Name of the Student
    2: { cellWidth: 11, halign: "center" }, // Adm No
  };

  // Set day columns (index 3 to 33)
  for (let i = 3; i <= 33; i++) {
    columnStylesConfig[i] = { cellWidth: 4.6, halign: "center" };
  }

  // Summary columns
  columnStylesConfig[34] = { cellWidth: 9, halign: "center" }; // TA
  columnStylesConfig[35] = { cellWidth: 11.5, halign: "center" }; // % TA
  columnStylesConfig[36] = { cellWidth: 10, halign: "center" }; // PCA
  columnStylesConfig[37] = { cellWidth: 10, halign: "center" }; // TCA
  columnStylesConfig[38] = { cellWidth: 12.5, halign: "center" }; // % TCA

  autoTable(doc, {
    startY: startMainTableY,
    margin: { left: leftMargin, right: rightMargin, bottom: 10 },
    theme: "plain",
    tableWidth: 250.1,
    styles: {
      fontSize: 5.8,
      cellPadding: 0.8,
      lineColor: [0, 0, 0],
      lineWidth: 0.12,
      textColor: [0, 0, 0],
      font: "helvetica",
      valign: "middle",
      overflow: "ellipsize",
    },
    headStyles: {
      fillColor: [240, 240, 240],
      fontStyle: "bold",
      textColor: [0, 0, 0],
      lineWidth: 0.15,
      lineColor: [0, 0, 0],
    },
    columnStyles: columnStylesConfig,
    head: [headRow1, headRow2],
    body: bodyRows,
    didDrawPage: (dataHook) => {
      // Page numbering at bottom right
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()} | Page ${dataHook.pageNumber}`,
        pageWidth - rightMargin - 40,
        pageHeight - 5
      );
    },
  });

  // Trigger Save
  const cleanClassName = data.className.replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `Monthly_Attendance_${cleanClassName}_${data.month}.pdf`;
  doc.save(fileName);
}
