import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '@/utils/axios';
import { isValidPhone } from '@/utils/formValidation';
// ⭐ IMPORT FIXED: Added 'Phone' icon here to fix the "Phone is not defined" error
import { User, Package, Loader2, MapPin, Building2, Download, MessageSquare, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import QuoteSuccessModal from './QuoteSuccessModal';
// jsPDF and jspdf-autotable will be loaded dynamically on request

const QuoteForm = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [dbProducts, setDbProducts] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    companyName: '',
    productId: '',
    productCategory: '',
    quantity: '',
    deliveryLocation: '',
    requirements: '', 
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastQuoteData, setLastQuoteData] = useState(null);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products');
        setDbProducts(res.data);
        const productIdParam = searchParams.get('productId');
        if (productIdParam) {
          const selected = res.data.find(p => p.id.toString() === productIdParam);
          if (selected) {
            setFormData(prev => ({ 
              ...prev, 
              productId: selected.id, 
              productCategory: selected.category 
            }));
          }
        }
      } catch (err) {
        console.error("Inventory Node Sync Failure:", err);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const generatePDF = async (data, pName) => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    
    const doc = new jsPDF();
    const dateToday = new Date().toLocaleDateString('en-GB', { 
      day: '2-digit', month: 'long', year: 'numeric' 
    });
    
    // ... existing logic ...
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(46, 125, 50); 
    doc.text("Farmliv Industries", 14, 22);
    
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.setFont("helvetica", "normal");
    doc.text("Premium Agricultural Solutions", 14, 28);

    doc.setFontSize(8);
    doc.text("First Floor, Network13, Tangni Chariali,", 14, 35);
    doc.text("Darrang (Assam) - 784146, India", 14, 39);
    
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("QUOTE REQUEST", 196, 22, { align: "right" });
    
    const refNo = `FIPL/${Math.floor(1000 + Math.random() * 9000)}`;
    doc.setFontSize(10);
    doc.setTextColor(46, 125, 50);
    doc.text(`Ref: ${refNo}`, 196, 30, { align: "right" });
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Date: ${dateToday}`, 196, 36, { align: "right" });

    doc.setDrawColor(46, 125, 50);
    doc.setLineWidth(0.5);
    doc.line(14, 45, 196, 45);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(46, 125, 50);
    doc.text("CUSTOMER DETAILS", 14, 55);
    doc.text("CONTACT US", 115, 55);

    doc.setDrawColor(220);
    doc.setLineWidth(0.2);
    doc.line(14, 57, 95, 57);
    doc.line(115, 57, 196, 57);

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(data.fullName, 14, 65);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.text(data.companyName || "Individual Procurement", 14, 71);
    doc.text(`Contact: ${data.phone}`, 14, 77);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Farmliv Industries", 115, 65);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.text("Sales Department", 115, 71);
    doc.text("sales@farmliv.com", 115, 77);
    doc.text("+91 XXXXX XXXXX", 115, 83);

    autoTable(doc, {
      startY: 95,
      head: [['Requirement Details', 'Value / Specification']],
      body: [
        ['Product Name', pName],
        ['Category', data.productCategory || 'Agri Plastics'],
        ['Quantity Requested', `${data.quantity} Units`],
        ['Delivery Location', data.deliveryLocation],
        ['Additional Notes', data.requirements || 'None'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [46, 125, 50], fontSize: 10, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 5, font: 'helvetica' },
      columnStyles: { 0: { fontStyle: 'bold', fillColor: [245, 245, 245], cellWidth: 55 } }
    });

    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.setFont("helvetica", "italic");
    doc.text("This document acknowledges your quote request in the Farmliv Admin Portal. A formal commercial proposal will be sent within 24 hours.", 105, finalY, { align: 'center', maxWidth: 160 });

    doc.save(`Farmliv_Quote_${data.fullName.replace(/\s+/g, '_')}.pdf`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // ⭐ Only allow numbers for phone field
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      // ⭐ Strict: If not empty, first digit must be 6-9 for Indian mobile numbers
      if (numericValue.length > 0 && !/[6-9]/.test(numericValue[0])) return;
      
      if (numericValue.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Enter valid 10-digit mobile number';
    }
    if (!formData.productId) newErrors.productId = 'Select Product';
    if (!formData.quantity) newErrors.quantity = 'Invalid Volume';
    if (!formData.deliveryLocation.trim()) newErrors.deliveryLocation = 'Required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedProduct = dbProducts.find(p => p.id.toString() === formData.productId.toString());
      const pName = selectedProduct?.name || 'Inquiry';

      const payload = {
        customer_name: formData.fullName,
        company: formData.companyName,
        phone: formData.phone,
        location: formData.deliveryLocation,
        product_id: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
        notes: formData.requirements || ''
      };

      await API.post('/leads', payload);
      generatePDF(formData, pName);
      toast({ title: "Success!", description: "Quote generated and inquiry sent." });
      
      // Redirect to thank you page
      setTimeout(() => {
        navigate('/thank-you');
      }, 500);
    } catch (err) {
      toast({ variant: "destructive", title: "Sync Error", description: "Backend connection failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full bg-white border border-gray-200 px-6 py-4 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 focus:ring-green-50 focus:border-[#2E7D32] transition-all font-sans";
  const labelClasses = "text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-2 flex items-center gap-2 font-sans";

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-10 p-6 sm:p-10 font-sans bg-white rounded-[3rem] border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}><User size={10}/> Customer Name *</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={inputClasses} placeholder="Full Name" />
            {errors.fullName && <p className="text-red-500 text-[9px] font-bold uppercase ml-4 mt-1">{errors.fullName}</p>}
          </div>
          <div className="space-y-1">
            <label className={labelClasses}><Building2 size={10}/> Company / Others</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={inputClasses} placeholder="Company Name" />
          </div>
          <div className="space-y-1">
            <label className={labelClasses}><Phone size={10}/> Customer Contact Number *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} placeholder="Phone Number" />
            {errors.phone && <p className="text-red-500 text-[9px] font-bold uppercase ml-4 mt-1">{errors.phone}</p>}
          </div>
          <div className="space-y-1">
            <label className={labelClasses}><MapPin size={10}/> Customer Location *</label>
            <input type="text" name="deliveryLocation" value={formData.deliveryLocation} onChange={handleChange} className={inputClasses} placeholder="City, State" />
            {errors.deliveryLocation && <p className="text-red-500 text-[9px] font-bold uppercase ml-4 mt-1">{errors.deliveryLocation}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50 mt-4">
          <div className="space-y-1">
            <label className={labelClasses}><Package size={10}/> Products *</label>
            <select name="productId" value={formData.productId} onChange={handleChange} className={inputClasses}>
              <option value="">Select Product Name </option>
              {dbProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {errors.productId && <p className="text-red-500 text-[9px] font-bold uppercase ml-4 mt-1">{errors.productId}</p>}
          </div>
          <div className="space-y-1">
            {/* ⭐ SYNTAX FIXED: Added missing '>' bracket here */}
            <label className={labelClasses}>Order Quantity *</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className={inputClasses} placeholder="Units" />
            {errors.quantity && <p className="text-red-500 text-[9px] font-bold uppercase ml-4 mt-1">{errors.quantity}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelClasses}><MessageSquare size={10}/> Order Description</label>
          <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows="3" className={`${inputClasses} resize-none`} placeholder="Specific instructions..."></textarea>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-[#2E7D32] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
          {isSubmitting ? <Loader2 className="animate-spin" /> : <><Download size={16}/> SUBMIT & Download Quote</>}
        </button>
      </form>
      <QuoteSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} quoteData={lastQuoteData} />
    </>
  );
};

export default QuoteForm;

