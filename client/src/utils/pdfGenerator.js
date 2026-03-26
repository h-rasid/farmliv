// Static imports removed to optimize initial bundle size
// jsPDF and html2canvas will be loaded dynamically on request

export const generateQuotePDF = async (quoteData) => {
  // Create a temporary container for the PDF content
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '210mm'; // A4 width
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#000000';
  container.style.padding = '40px';
  container.style.fontFamily = 'Arial, sans-serif'; 
  
  // Format dates safely
  const submittedDate = quoteData.submittedAt 
    ? new Date(quoteData.submittedAt) 
    : new Date();
  
  const quoteDateStr = submittedDate.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const deliveryDateStr = quoteData.deliveryDate 
    ? new Date(quoteData.deliveryDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      }) 
    : 'To Be Determined';

  // Generate Reference Number FIPL/XXXX
  // If the quote already has a reference number that fits the format, use it.
  // Otherwise generate one based on timestamp or random.
  let refNo = quoteData.referenceNumber;
  if (!refNo || !refNo.startsWith('FIPL/')) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    refNo = `FIPL/${randomNum}`;
  }

  // Construct HTML content template
  container.innerHTML = `
    <div style="padding: 20px;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #2E7D32; padding-bottom: 20px; margin-bottom: 30px;">
        <div>
          <h1 style="color: #2E7D32; font-size: 28px; margin: 0; font-weight: bold; letter-spacing: -0.5px;">Farmliv Industries</h1>
          <p style="margin: 5px 0 0; color: #555; font-size: 14px; font-weight: 500;">Premium Agricultural Solutions</p>
          <div style="margin-top: 10px; font-size: 12px; color: #666; line-height: 1.4;">
            First Floor, Network13, Tangni Chariali,<br>
            Darrang (Assam) – 784146, India
          </div>
        </div>
        <div style="text-align: right;">
          <h2 style="font-size: 20px; margin: 0 0 5px; color: #1a1a1a; font-weight: bold;">QUOTE REQUEST</h2>
          <p style="margin: 2px 0; font-size: 14px; color: #444;">Ref: <strong style="color: #2E7D32;">${refNo}</strong></p>
          <p style="margin: 2px 0; font-size: 14px; color: #666;">Date: ${quoteDateStr}</p>
        </div>
      </div>

      <!-- Customer Info & Supplier Info Grid -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 40px; gap: 40px;">
        <div style="flex: 1;">
          <h3 style="color: #2E7D32; font-size: 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 12px; text-transform: uppercase; font-weight: bold;">Customer Details</h3>
          <p style="margin: 0 0 4px; font-weight: bold; font-size: 14px;">${quoteData.fullName || ''}</p>
          <p style="margin: 0 0 4px; font-size: 14px;">${quoteData.companyName || ''}</p>
          <p style="margin: 0 0 4px; font-size: 14px; color: #444;">${quoteData.companyAddress || ''}</p>
          <p style="margin: 0 0 4px; font-size: 14px;">${quoteData.email || ''}</p>
          <p style="margin: 0; font-size: 14px;">${quoteData.phone || ''}</p>
        </div>
        <div style="flex: 1;">
          <h3 style="color: #2E7D32; font-size: 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 12px; text-transform: uppercase; font-weight: bold;">Contact Us</h3>
          <p style="margin: 0 0 4px; font-weight: bold; font-size: 14px;">Farmliv Industries</p>
          <p style="margin: 0 0 4px; font-size: 14px;">Sales Department</p>
          <p style="margin: 0 0 4px; font-size: 14px;">sales@farmliv.com</p>
          <p style="margin: 0; font-size: 14px;">+91 98765 43210</p>
        </div>
      </div>

      <!-- Product Details Table -->
      <div style="margin-bottom: 40px;">
        <h3 style="color: white; background-color: #2E7D32; font-size: 15px; padding: 10px 15px; margin-bottom: 0; font-weight: bold; border-top-left-radius: 4px; border-top-right-radius: 4px;">Requirement Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tbody>
            <tr style="border-bottom: 1px solid #eee;">
              <th style="text-align: left; padding: 12px 15px; background-color: #f8f9fa; color: #444; width: 35%;">Product Name</th>
              <td style="padding: 12px 15px; color: #000; font-weight: 600;">${quoteData.productName || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <th style="text-align: left; padding: 12px 15px; background-color: #f8f9fa; color: #444;">Category</th>
              <td style="padding: 12px 15px; text-transform: capitalize;">${quoteData.productCategory?.replace(/-/g, ' ') || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <th style="text-align: left; padding: 12px 15px; background-color: #f8f9fa; color: #444;">Quantity Requested</th>
              <td style="padding: 12px 15px;">${quoteData.quantity || '0'} ${quoteData.unit || 'Units'}</td>
            </tr>
            ${quoteData.variant ? `
            <tr style="border-bottom: 1px solid #eee;">
              <th style="text-align: left; padding: 12px 15px; background-color: #f8f9fa; color: #444;">Variant / Spec</th>
              <td style="padding: 12px 15px;">${quoteData.variant}</td>
            </tr>` : ''}
            <tr style="border-bottom: 1px solid #eee;">
              <th style="text-align: left; padding: 12px 15px; background-color: #f8f9fa; color: #444;">Required By</th>
              <td style="padding: 12px 15px;">${deliveryDateStr}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <th style="text-align: left; padding: 12px 15px; background-color: #f8f9fa; color: #444;">Delivery Location</th>
              <td style="padding: 12px 15px;">${quoteData.deliveryLocation || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Detailed Requirements Section -->
      ${quoteData.requirements ? `
      <div style="margin-bottom: 40px; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #eee;">
        <h3 style="color: #2E7D32; font-size: 15px; margin: 0 0 15px; padding-bottom: 8px; border-bottom: 1px solid #ddd;">Customer Requirements</h3>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-line; color: #333;">${quoteData.requirements}</p>
      </div>
      ` : ''}

      <!-- Footer -->
      <div style="margin-top: 60px; padding-top: 20px; border-top: 2px solid #f0f0f0; text-align: center;">
        <p style="color: #666; font-size: 12px; margin: 0 0 6px;">
          This document serves as an acknowledgment of your quote request. A formal commercial proposal including pricing, availability, and shipping terms will be sent to the provided email address within 24 hours.
        </p>
        <p style="color: #2E7D32; font-size: 12px; font-weight: bold; margin: 0;">
          Farmliv Industries &bull; www.farmliv.com
        </p>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // --- Dynamic Imports for Heavy Libraries ---
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf')
    ]);

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const filename = `Quote_${refNo.replace('/', '-')}.pdf`;
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};
