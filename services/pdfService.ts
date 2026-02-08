import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LetterFormData, LetterType } from '../types';

// Helper to format dates like "10 JULAI 2024" or "10/07/2024"
const formatDate = (dateString?: string, longFormat = false) => {
  if (!dateString) return "........................";
  const date = new Date(dateString);
  if (longFormat) {
    return date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  }
  return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
};

export const generateAbsenceLetter = (data: LetterFormData) => {
  const doc = new jsPDF();
  
  // -- CONFIGURATION --
  // Typography: Helvetica (Arial-like) as standard for jsPDF.
  const primaryFont = 'Helvetica';
  const fontSizeMain = 10;
  const fontSizeSmall = 9; // For 'sk:' section
  const lineHeight = 1.0; // Tighter line height for single page fit
  
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - (margin * 2);
  
  // -- 1. HEADER (Preserved Base64) --
  // Logo area: 45mm height.
  if (data.logoUrl) {
    try {
      doc.addImage(data.logoUrl, 'PNG', 10, 5, 190, 45); 
    } catch (e) {
      console.error("Image load error", e);
    }
  }

  // Start content slightly higher to ensure fit
  let currentY = 52;

  // -- 2. TITLE (Centered, Bold, Uppercase) --
  doc.setFont(primaryFont, 'bold');
  doc.setFontSize(fontSizeMain);

  let title = "";
  if (data.letterType === LetterType.R1) {
    title = "SURAT PERINGATAN PERTAMA 3 HARI SECARA BERKALA TIDAK HADIR SEKOLAH";
  } else if (data.letterType === LetterType.R2) {
    title = "SURAT PERINGATAN KEDUA 7 HARI SECARA BERKALA TIDAK HADIR SEKOLAH";
  } else {
    title = "SURAT PERINGATAN TERAKHIR 7 HARI SECARA BERKALA TIDAK HADIR SEKOLAH";
  }

  doc.text(title, pageWidth / 2, currentY, { align: 'center' });
  currentY += 6; // Reduced gap

  // -- 3. REF & DATE --
  doc.setFont(primaryFont, 'normal');
  doc.setFontSize(fontSizeMain);

  let refNo = "SMAS/REG/SP/R1";
  if (data.letterType === LetterType.R2) refNo = "SMAS/REG/SP/R2";
  if (data.letterType === LetterType.R3) refNo = "SMAS/REG/SP/R3";

  // Left: Rujukan
  doc.text(`Rujukan: ${refNo}`, margin, currentY);

  // Right: Tarikh
  const dateLabelX = 140;
  doc.text("Tarikh:", dateLabelX, currentY);
  doc.text(formatDate(data.dateOfLetter, false), dateLabelX + 15, currentY);
  doc.line(dateLabelX + 15, currentY + 1, pageWidth - margin, currentY + 1);

  currentY += 8; // Reduced gap

  // -- 4. RECIPIENT INFO --
  doc.text("Yang Mulia", margin, currentY);
  currentY += 5;

  // Name (Bold)
  doc.setFont(primaryFont, 'bold');
  doc.text(data.parentName.toUpperCase() || "................................................", margin, currentY);
  doc.line(margin, currentY + 1, margin + 80, currentY + 1);
  currentY += 5;

  // Address
  doc.setFont(primaryFont, 'normal');
  const addressLines = doc.splitTextToSize(data.address || "................................................", 80);
  doc.text(addressLines, margin, currentY);
  currentY += (addressLines.length * 4) + 2; // Tighter line spacing for address
  doc.line(margin, currentY, margin + 80, currentY);
  currentY += 6;

  doc.text("NEGARA BRUNEI DARUSSALAM", margin, currentY);
  currentY += 8;

  // -- 5. STUDENT INFO BOX --
  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'plain',
    styles: { 
      font: primaryFont, 
      fontSize: fontSizeMain, 
      textColor: [0, 0, 0],
      cellPadding: 1, // Compact padding
      lineColor: [0, 0, 0], 
      lineWidth: 0.1,
      valign: 'middle'
    },
    body: [
      [
        { content: 'Nama Pelajar', styles: { cellWidth: 30, fontStyle: 'normal' } }, 
        { content: data.studentName.toUpperCase(), styles: { fontStyle: 'bold' } }, 
        { content: 'Kelas', styles: { cellWidth: 15, fontStyle: 'normal' } }, 
        { content: data.studentClass.toUpperCase(), styles: { fontStyle: 'bold', cellWidth: 30 } }
      ]
    ],
    didParseCell: (data) => {
       data.cell.styles.lineWidth = 0.2;
    }
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 6;

  // -- 6. INTRODUCTORY PARAGRAPH --
  doc.setFont(primaryFont, 'normal');
  
  let introText = "";
  if (data.letterType === LetterType.R1) {
    introText = "Dengan hormat merujuk perkara di atas, dukacita dimaklumkan bahawa pelajar yang tersebut di atas telah tidak hadir bersekolah tanpa sebarang makluman atau alasan munsabah daripada Tuan/Puan selama 3 hari secara berkala.";
  } else if (data.letterType === LetterType.R2) {
    introText = "Dengan hormat merujuk perkara di atas, dukacita dimaklumkan bahawa pelajar yang tersebut di atas telah tidak hadir bersekolah tanpa sebarang makluman atau alasan munsabah daripada Tuan/Puan selama 7 hari secara berkala.";
  } else {
    // R3
    introText = "Dengan hormat merujuk perkara di atas, dukacita dimaklumkan bahawa pelajar yang bernama di atas telah tidak hadir bersekolah selama 7 hari secara berkala tanpa ada makluman daripada pihak Tuan/Puan pada tarikh-tarikh berikut:";
  }

  doc.text(introText, margin, currentY, { maxWidth: contentWidth, align: 'justify', lineHeightFactor: lineHeight });
  currentY += doc.getTextDimensions(introText, { maxWidth: contentWidth }).h + 4;

  if (data.letterType !== LetterType.R3) {
    doc.text("Untuk makluman, berikut adalah tarikh-tarikh pelajar berkenaan tidak hadir bersekolah:", margin, currentY);
    currentY += 5;
  }

  // -- 7. ABSENCE DATES TABLE --
  const formattedDates = data.absenceDates.map(d => formatDate(d)).sort();
  const cols = 4;
  const dateRows = [];
  let row = [];
  for (let i = 0; i < formattedDates.length; i++) {
    row.push(formattedDates[i]);
    if (row.length === cols) {
      dateRows.push(row);
      row = [];
    }
  }
  if (row.length > 0) {
    while (row.length < cols) row.push("");
    dateRows.push(row);
  }
  if (dateRows.length === 0) dateRows.push(["", "", "", ""]);

  const tableHeader = data.letterType === LetterType.R3 ? "Tarikh-Tarikh Ketidakhadiran" : "Tarikh Ketidakhadiran";

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    head: [[{ content: tableHeader, colSpan: cols }]],
    body: dateRows,
    styles: { 
      font: primaryFont, 
      fontSize: fontSizeMain, 
      textColor: [0, 0, 0], // Black Body Text
      cellPadding: 1, // Compact
      lineColor: [0, 0, 0], 
      lineWidth: 0.1,
      halign: 'center',
      valign: 'middle'
    },
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [0, 0, 0], // Black Header Text
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      lineColor: [0, 0, 0],
      lineWidth: 0.1
    }
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 6;

  // -- 8. STATISTICS TABLE (R3 ONLY) --
  if (data.letterType === LetterType.R3) {
    const from = formatDate(data.attendanceFrom);
    const to = formatDate(data.attendanceTo);
    const present = data.totalDaysPresent || "0";
    const total = data.totalSchoolDays || "0";
    const percent = total !== "0" ? ((parseFloat(present)/parseFloat(total))*100).toFixed(1) + "%" : "0%";

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: 'plain',
      styles: { 
        font: primaryFont, 
        fontSize: fontSizeMain, 
        textColor: [0, 0, 0],
        cellPadding: 1, // Compact
        lineColor: [0,0,0], 
        lineWidth: 0.1 
      },
      body: [
        [
           { content: 'Kehadiran dari', styles: { fontStyle: 'bold', halign: 'right' }}, 
           { content: from, styles: { halign: 'center' }},
           { content: 'hingga', styles: { fontStyle: 'bold', halign: 'center' }},
           { content: to, styles: { halign: 'center' }},
           { content: 'Jumlah hari hadir', styles: { fontStyle: 'bold', halign: 'right' }},
           { content: present, styles: { halign: 'center' }}
        ],
        [
          { content: '', colSpan: 4, styles: { lineWidth: 0 } },
          { content: 'Jumlah hari persekolahan', styles: { fontStyle: 'bold', halign: 'right' }},
          { content: total, styles: { halign: 'center' }}
        ],
        [
           { content: '', colSpan: 4, styles: { lineWidth: 0 } },
           { content: 'Peratus kedatangan', styles: { fontStyle: 'bold', halign: 'right' }},
           { content: percent, styles: { halign: 'center' }}
        ]
      ],
      columnStyles: {
        0: { cellWidth: 25 }, 1: { cellWidth: 25 }, 2: { cellWidth: 15 },
        3: { cellWidth: 25 }, 4: { cellWidth: 40 }, 5: { cellWidth: 20 }
      }
    });
     // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 6;
  }

  // -- 9. MIDDLE PARAGRAPH --
  let middleText = "";
  if (data.letterType === LetterType.R2) {
     middleText = `Surat peringatan ini adalah merupakan peringatan kedua kepada Tuan mengenai ketidakhadiran pelajar yang tersebut kerana pihak sekolah telah mengirim surat Peringatan pertama, rujukan: SMAS/REG/SP/R1 bertarikh: ${formatDate(data.dateOfR1, true)}`;
  } else if (data.letterType === LetterType.R3) {
     middleText = `Surat peringatan ini adalah merupakan peringatan terakhir kepada Tuan/Puan mengenai ketidakhadiran pelajar berkenaan kerana pihak sekolah telah mengirim Peringatan kedua, rujukan: SMAS/REG/SP/R2 yang bertarikh: ${formatDate(data.dateOfR2, true)}`;
  }

  if (middleText) {
    doc.text(middleText, margin, currentY, { maxWidth: contentWidth, align: 'justify', lineHeightFactor: lineHeight });
    currentY += doc.getTextDimensions(middleText, { maxWidth: contentWidth }).h + 4;
  }

  // -- 10. ACTION PARAGRAPH --
  let actionText = "";
  if (data.letterType === LetterType.R3) {
    actionText = "Sehubungan itu, pihak Sekolah memohon kerjasama Tuan/Puan untuk segera datang ke sekolah bersama pelajar yang bernama di atas bagi sesi perjumpaan dengan Pengetua sejurus Tuan/Puan menerima surat peringatan ini, dan seterusnya menyain surat perjanjian untuk sentiasa hadir bersekolah. Untuk makluman juga, pelajar ini akan dirujuk kepada Kaunselor Sekolah bagi sesi kaunseling.";
  } else {
    actionText = "Sehubungan itu, dipohonkan kerjasama Tuan/Puan supaya akan dapat mempastikan pelajar berkenaan untuk sentiasa hadir bersekolah dan mengulangkaji pelajaran yang telah teringgal selama ketidakhadiran.";
  }

  doc.text(actionText, margin, currentY, { maxWidth: contentWidth, align: 'justify', lineHeightFactor: lineHeight });
  currentY += doc.getTextDimensions(actionText, { maxWidth: contentWidth }).h + 4;

  // -- 11. EXTRA R3 PARAGRAPH --
  if (data.letterType === LetterType.R3) {
    const r3Extra = "Jika Tuan/Puan gagal hadir berjumpa dengan Pengetua dalam tempoh 2 minggu setelah surat ini dikirim, pelajar diatas akan dirujuk ke Bahagian Hal Ehwal Pelajar, Jabatan Sekolah-Sekolah, Kementerian Pendidikan untuk tindakan selanjutnya.";
    doc.text(r3Extra, margin, currentY, { maxWidth: contentWidth, align: 'justify', lineHeightFactor: lineHeight });
    currentY += doc.getTextDimensions(r3Extra, { maxWidth: contentWidth }).h + 4;
  }

  // -- 12. WARNING SECTION (R1 & R2 Only) --
  if (data.letterType !== LetterType.R3) {
    doc.setFont(primaryFont, 'bold');
    doc.text("Sila ambil maklum jika kedatangan kurang dari 85%:", margin, currentY);
    currentY += 4;
    
    doc.setFont(primaryFont, 'normal');
    const bulletText1 = "•   Pelajar akan ditahan dari naik kelas pada tahun hadapan.";
    const bulletText2 = "•   Bagi Pelajar Tahun 11, pelajar akan dikenakan bayaran untuk menduduki Peperiksaan Brunei Cambridge GCE 'O' Level / IGCSE Oktober/November.";
    
    doc.text(bulletText1, margin, currentY);
    currentY += 4;
    
    const splitBullet2 = doc.splitTextToSize(bulletText2, contentWidth);
    doc.text(splitBullet2, margin, currentY);
    currentY += (splitBullet2.length * 4) + 4;
  }

  // Closing
  doc.text("Sekian disampaikan untuk makluman dan tindakan Tuan/Puan selanjutnya.", margin, currentY);
  currentY += 8;

  // -- 13. FOOTER (Compact Logic) --
  // Calculate required footer height.
  // "Pengetua" (5) + "SMAS" (5) + Gap (5) + "sk:" (5) + (2 items * 5) = ~30mm
  const footerHeight = 35; 
  
  // To ensure single page, we try not to addPage.
  // If currentY is high (middle of page), push footer down to bottom.
  // If currentY is low (near bottom), just place it after text with small padding.
  
  const bottomThreshold = pageHeight - footerHeight - 10;
  
  // Position the footer. 
  // If we have plenty of space, align to bottom (pageHeight - footerHeight - 5).
  // If space is tight, place it right after content (currentY + 5).
  let footerY = 0;
  
  if (currentY < bottomThreshold) {
      // Plenty of space -> Push to bottom
      footerY = pageHeight - footerHeight - 10;
  } else {
      // Tight space -> Place immediately after text
      footerY = currentY + 5;
  }
  
  // Double check strict page limit (A4 ~297mm). 
  if (footerY + footerHeight > 290) {
      // If absolutely no space, we might be forced to add page, 
      // but with the compaction above, this should be rare.
      // We will try to squeeze it.
      footerY = currentY + 2; 
  }

  doc.setFont(primaryFont, 'bold');
  doc.setFontSize(fontSizeMain);
  doc.text("Pengetua", margin, footerY);
  doc.text("Sekolah Menengah Awang Semaun", margin, footerY + 5);

  const skY = footerY + 12;
  doc.setFont(primaryFont, 'normal');
  doc.setFontSize(fontSizeSmall); // Use Size 9 for sk:
  doc.text("sk:", margin, skY);
  
  if (data.letterType === LetterType.R3) {
    doc.text("•   Kaunselor SM Awang semaun.", margin + 5, skY + 5);
    doc.text("•   Fail Persendirian Penuntut", margin + 5, skY + 9);
  } else {
    doc.text("•   Fail Persendirian Penuntut", margin + 5, skY + 5);
  }

  // Save
  const safeName = (data.studentName || "student").replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`${data.letterType.split(' ')[0]}_${safeName}.pdf`);
};
