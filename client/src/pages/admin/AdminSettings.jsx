import React, { useState, useEffect } from 'react';
// ⭐ Path updated: Go up two levels, then into utils
import API from '../../utils/axios'; 

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    gstNumber: '',
    whatsapp: '',
    isMaintenance: false,
    smtpHost: '',
    smtpUser: '',
    smtpPass: '',
    facebook: '',
    instagram: '',
    linkedin: ''
  });

  // Files ke liye alag state
  const [logo, setLogo] = useState(null);
  const [favicon, setFavicon] = useState(null);
  const [brochure, setBrochure] = useState(null);
  
  // ⭐ Image Previews (New UI Logic)
  const [previews, setPreviews] = useState({ logo: null, favicon: null });
  const [brochureUrl, setBrochureUrl] = useState(null);
  
  // ⭐ Loading State (To prevent double clicks during image processing)
  const [isUpdating, setIsUpdating] = useState(false);

  // --- ⭐ Database se existing settings load karne ke liye ---
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get('/settings');
        if (res.data) {
          setSettings(res.data);
          
          // Logic to show existing images from Hostinger
          const baseHost = API.defaults.baseURL.replace('/api', '');
          setPreviews({
            logo: res.data.logo ? `${baseHost}${res.data.logo}` : null,
            favicon: res.data.favicon ? `${baseHost}${res.data.favicon}` : null
          });
          // Set existing brochure URL
          if (res.data.brochure) setBrochureUrl(res.data.brochure);
        }
      } catch (err) {
        console.error("Settings load karne mein error:", err);
      }
    };
    fetchSettings();
  }, []);

  // ⭐ Handle Image Change with Preview Logic
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'logo') {
        setLogo(file);
        setPreviews(prev => ({ ...prev, logo: URL.createObjectURL(file) }));
      } else if (type === 'favicon') {
        setFavicon(file);
        setPreviews(prev => ({ ...prev, favicon: URL.createObjectURL(file) }));
      } else if (type === 'brochure') {
        setBrochure(file);
        setBrochureUrl(null); // clear old preview so user sees new filename
      }
    }
  };

  const handleSave = async () => {
    setIsUpdating(true); // Start loading
    try {
      // 2. FormData banayein kyunki humein files (Logo/Favicon) bhi bhejni hain
      const formData = new FormData();
      
      // Settings object ko append karein
      Object.keys(settings).forEach(key => {
        // ⭐ Skip brochure from body if we're uploading a new file to avoid confusion
        if (key === 'brochure' && brochure) return;
        
        // Fix for SQL tinyint (Boolean to String for Multer/FormData)
        const value = key === 'isMaintenance' ? (settings[key] ? 'true' : 'false') : settings[key];
        formData.append(key, value || '');
      });

      // Agar nayi files select ki hain toh unhe append karein
      if (logo) formData.append('logo', logo);
      if (favicon) formData.append('favicon', favicon);
      if (brochure) formData.append('brochure', brochure);

      // 3. Backend API call
      const response = await API.post('/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log("Saving to Database:", response.data);
      if (response.data.brochure) {
        setBrochureUrl(response.data.brochure);
        setSettings(prev => ({ ...prev, brochure: response.data.brochure }));
        setBrochure(null); // clear file state after success
      }
      alert("✅ Settings updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update settings. Please try again.");
    } finally {
      setIsUpdating(false); // Stop loading
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h2 className="text-3xl font-bold text-gray-800">Admin Settings</h2>
            {isUpdating && <span className="text-emerald-600 animate-pulse font-medium">Syncing...</span>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* --- Branding Section --- */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-600">Branding</h3>
            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border">
               <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Website Logo</label>
                  <input 
                    type="file" 
                    className="block w-full text-xs border rounded-lg p-1 bg-white" 
                    onChange={(e) => handleFileChange(e, 'logo')}
                    accept="image/*"
                  />
               </div>
               {previews.logo && (
                 <div className="relative">
                    <img src={previews.logo} alt="Logo" className="h-12 w-12 object-contain border p-1 rounded bg-white shadow-sm" />
                 </div>
               )}
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border">
               <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Favicon</label>
                  <input 
                    type="file" 
                    className="block w-full text-xs border rounded-lg p-1 bg-white" 
                    onChange={(e) => handleFileChange(e, 'favicon')}
                    accept="image/x-icon,image/png"
                  />
               </div>
               {previews.favicon && (
                 <img src={previews.favicon} alt="Fav" className="h-8 w-8 object-contain border p-1 rounded bg-white shadow-sm" />
               )}
            </div>

            {/* Brochure PDF Upload */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <label className="block text-sm font-medium mb-1 text-blue-800">📄 E-Catalogue / Brochure (PDF)</label>
              <input 
                type="file"
                accept="application/pdf"
                className="block w-full text-xs border rounded-lg p-1 bg-white mb-2"
                onChange={(e) => handleFileChange(e, 'brochure')}
              />
              {brochure && <p className="text-xs text-green-700 font-medium">✅ New file selected: {brochure.name}</p>}
              {brochureUrl && !brochure && (
                <a href={brochureUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">View Current Brochure ↗</a>
              )}
              <p className="text-xs text-gray-400 mt-1">Max size: 20MB. Will appear as E-Catalogue button in footer.</p>
            </div>
          </section>

          {/* --- Business & GST --- */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-600">Business Details</h3>
            <div>
              <label className="block text-sm font-medium mb-1">GST Number</label>
              <input 
                type="text" 
                value={settings.gstNumber || ''}
                placeholder="22AAAAA0000A1Z5"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                onChange={(e) => setSettings({...settings, gstNumber: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp Business Number</label>
              <input 
                type="tel" 
                value={settings.whatsapp || ''}
                placeholder="+91..."
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                onChange={(e) => setSettings({...settings, whatsapp: e.target.value})}
              />
            </div>
          </section>

          {/* --- SMTP Email Setup --- */}
          <section className="space-y-4 md:col-span-2 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-emerald-600">SMTP Email Setup</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" value={settings.smtpHost || ''} placeholder="SMTP Host" className="p-2 border rounded-md bg-white text-sm" onChange={(e) => setSettings({...settings, smtpHost: e.target.value})} />
              <input type="email" value={settings.smtpUser || ''} placeholder="SMTP User" className="p-2 border rounded-md bg-white text-sm" onChange={(e) => setSettings({...settings, smtpUser: e.target.value})} />
              <input type="password" value={settings.smtpPass || ''} placeholder="SMTP Password" className="p-2 border rounded-md bg-white text-sm" onChange={(e) => setSettings({...settings, smtpPass: e.target.value})} />
            </div>
          </section>

          {/* --- Social Media Links --- */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-600">Social Media</h3>
            <input type="text" value={settings.facebook || ''} placeholder="Facebook URL" className="w-full p-2 border rounded-lg text-sm" onChange={(e) => setSettings({...settings, facebook: e.target.value})} />
            <input type="text" value={settings.instagram || ''} placeholder="Instagram URL" className="w-full p-2 border rounded-lg text-sm" onChange={(e) => setSettings({...settings, instagram: e.target.value})} />
          </section>

          {/* --- System Status --- */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-600">System Control</h3>
            <div className="flex items-center justify-between p-4 border-2 border-dashed rounded-lg bg-red-50">
              <div>
                <span className="font-bold text-red-700">Maintenance Mode</span>
                <p className="text-xs text-gray-500">Enable this to block public access</p>
              </div>
              <input 
                type="checkbox" 
                disabled={isUpdating}
                checked={settings.isMaintenance || false}
                className="w-8 h-8 cursor-pointer accent-red-600"
                onChange={(e) => setSettings({...settings, isMaintenance: e.target.checked})}
              />
            </div>
          </section>

        </div>

        <div className="mt-10 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isUpdating}
            className={`px-10 py-3 text-white font-bold rounded-xl shadow-lg transform transition active:scale-95 ${
                isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isUpdating ? 'Processing...' : 'Update All Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
