// jsPDF and jspdf-autotable will be loaded dynamically on request
export const generateInvoice = async (data) => {
  const { jsPDF } = await import('jspdf');
  await import('jspdf-autotable');
  
  const doc = new jsPDF();
  const brandColor = [46, 125, 50]; // Farmliv Green (#2E7D32)
  const darkColor = [26, 26, 26];   // Elite Black (#1A1A1A)

  // --- 1. Header & Branding ---
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, 210, 40, 'F'); // Top Dark Bar

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('FARMLIV', 15, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('INDUSTRIES PRIVATE LIMITED', 15, 32);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('OFFICIAL INVOICE', 140, 25);

  // --- 2. Transaction Info ---
  doc.setTextColor(...darkColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO:', 15, 55);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Customer: ${data.customer_name}`, 15, 62);
  doc.text(`Date: ${new Date(data.sale_date).toLocaleDateString('en-IN')}`, 15, 68);
  
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE NO:', 140, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(`FR-${Math.floor(1000 + Math.random() * 9000)}`, 140, 62);

  // --- 3. Product Table ---
  const tableColumn = ["Product Description", "Quantity", "Unit Price", "Total Amount"];
  const unitPrice = (parseFloat(data.amount) / parseFloat(data.quantity)).toFixed(2);
  const tableRows = [
    [
      data.product_name.toUpperCase(),
      `${data.quantity} Units`,
      `INR ${unitPrice}`,
      `INR ${parseFloat(data.amount).toLocaleString('en-IN')}`
    ]
  ];

  doc.autoTable({
    startY: 80,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { 
      fillColor: brandColor, 
      textColor: [255, 255, 255], 
      fontSize: 10, 
      fontStyle: 'bold',
      halign: 'center' 
    },
    bodyStyles: { 
      fontSize: 10, 
      textColor: darkColor,
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'left', fontStyle: 'bold' }
    }
  });

  // --- 4. Grand Total ---
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFillColor(245, 245, 245);
  doc.rect(130, finalY, 65, 15, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...brandColor);
  doc.text(`GRAND TOTAL:`, 135, finalY + 10);
  doc.text(`INR ${parseFloat(data.amount).toLocaleString('en-IN')}`, 168, finalY + 10);

  // --- 5. Notes & Footer ---
  if (data.notes) {
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Notes:', 15, finalY + 30);
    doc.text(data.notes, 15, finalY + 36, { maxWidth: 100 });
  }

  // Bottom Footer
  doc.setFillColor(...brandColor);
  doc.rect(0, 285, 210, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('This is a computer-generated document. Farmliv Industries Private Limited.', 60, 292);

  // Save the PDF
  doc.save(`Farmliv_Invoice_${data.customer_name.replace(/\s+/g, '_')}.pdf`);
};
