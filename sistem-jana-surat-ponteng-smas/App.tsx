import React, { useState, useRef } from 'react';
import { LetterType, LetterFormData } from './types';
import { generateAbsenceLetter } from './services/pdfService';
import { FileText, Download, School, Info, Calendar, Plus, X, Upload, CheckCircle, ChevronDown, AlertTriangle, User } from 'lucide-react';

export const App: React.FC = () => {
  const [formData, setFormData] = useState<LetterFormData>({
    letterType: LetterType.R1,
    dateOfLetter: new Date().toISOString().split('T')[0],
    parentName: '',
    address: '',
    studentName: '',
    studentClass: '',
    absenceDates: [],
    dateOfR1: '',
    dateOfR2: '',
    attendanceFrom: '',
    attendanceTo: '',
    totalDaysPresent: '',
    totalSchoolDays: '',
  });

  const [currentDateInput, setCurrentDateInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addDate = () => {
    if (!currentDateInput) {
      alert("Sila pilih tarikh terlebih dahulu.");
      return;
    }
    if (formData.absenceDates.includes(currentDateInput)) {
      alert("Tarikh ini sudah ditambah.");
      return;
    }
    setFormData(prev => ({
      ...prev,
      absenceDates: [...prev.absenceDates, currentDateInput].sort()
    }));
    setCurrentDateInput('');
  };

  const removeDate = (date: string) => {
    setFormData(prev => ({
      ...prev,
      absenceDates: prev.absenceDates.filter(d => d !== date)
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.absenceDates.length === 0) {
      alert("Sila pilih sekurang-kurangnya satu tarikh ketidakhadiran.");
      return;
    }
    generateAbsenceLetter(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-black pb-12 sm:pb-24 selection:bg-yellow-400">
      <header className="bg-[#000080] text-white py-6 sm:py-12 px-4 sm:px-8 mb-8 sm:mb-16 border-b-[8px] sm:border-b-[12px] border-black shadow-2xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-12 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-center sm:text-left">
            <button 
              type="button"
              className="p-2 sm:p-4 bg-white rounded-3xl border-[4px] sm:border-[6px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:scale-105 transition-transform" 
              onClick={() => fileInputRef.current?.click()}
              aria-label="Klik untuk muat naik logo"
            >
              {formData.logoUrl ? (
                <img src={formData.logoUrl} className="w-16 h-16 sm:w-24 sm:h-24 object-contain" alt="Logo Sekolah" />
              ) : (
                <div className="flex flex-col items-center">
                  <School className="w-12 h-12 sm:w-20 sm:h-20 text-[#000080]" strokeWidth={2.5} />
                  <span className="text-black text-[8px] sm:text-[10px] font-black mt-1 uppercase">Header SMAS</span>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleLogoUpload} accept="image/*" />
            </button>
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase leading-[0.9] mb-2 sm:mb-4 drop-shadow-lg">Sistem Jana<br/>Surat Ponteng</h1>
              <p className="bg-yellow-400 text-black px-3 py-1 sm:px-6 sm:py-1.5 text-xs sm:text-xl font-black tracking-[0.1em] sm:tracking-[0.2em] uppercase inline-block border-[3px] sm:border-[4px] border-black">
                SM AWANG SEMAUN
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto flex items-center justify-center gap-3 sm:gap-5 bg-[#FFFF00] text-black px-8 sm:px-16 py-4 sm:py-8 rounded-2xl sm:rounded-3xl font-black text-xl sm:text-3xl uppercase tracking-tighter transition-all btn-3d group"
          >
            <Download className="w-6 h-6 sm:w-12 sm:h-12 group-hover:bounce" strokeWidth={3} />
            JANA PDF
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 sm:gap-16">
          <div className="xl:col-span-8 space-y-8 sm:space-y-12">
            
            <div className="bg-white p-6 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] border-[4px] sm:border-[6px] border-black shadow-xl sm:shadow-2xl">
              <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-10 border-b-[4px] sm:border-b-[8px] border-black pb-4 sm:pb-8">
                <div className="bg-red-600 p-2 sm:p-4 rounded-xl sm:rounded-2xl border-[3px] sm:border-4 border-black text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] sm:shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                   <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12" strokeWidth={3} />
                </div>
                <h2 className="text-xl sm:text-4xl font-black text-black uppercase tracking-tighter italic underline decoration-red-600 decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8">1. Pilih Tahap</h2>
              </div>
              
              <div className="space-y-4">
                <label htmlFor="letterType" className="text-sm sm:text-base">Jenis Surat Rasmi:</label>
                <div className="relative">
                  <select
                    id="letterType"
                    name="letterType"
                    value={formData.letterType}
                    onChange={handleInputChange}
                    className="w-full text-lg sm:text-3xl font-black h-16 sm:h-24 rounded-xl sm:rounded-none"
                  >
                    {Object.values(LetterType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] border-[4px] sm:border-[6px] border-black shadow-xl sm:shadow-2xl">
              <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-10 border-b-[4px] sm:border-b-[8px] border-black pb-4 sm:pb-8">
                <div className="bg-yellow-400 p-2 sm:p-4 rounded-xl sm:rounded-2xl border-[3px] sm:border-4 border-black text-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] sm:shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                   <User className="w-8 h-8 sm:w-12 sm:h-12" strokeWidth={3} />
                </div>
                <h2 className="text-xl sm:text-4xl font-black text-black uppercase tracking-tighter italic underline decoration-yellow-400 decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8">2. Maklumat Penjaga</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div>
                   <label className="block text-sm font-bold mb-2">Nama Bapa/Penjaga:</label>
                   <input type="text" name="parentName" value={formData.parentName} onChange={handleInputChange} className="w-full border-2 border-black p-3 rounded-lg" />
                </div>
                <div>
                   <label className="block text-sm font-bold mb-2">Alamat:</label>
                   <textarea name="address" value={formData.address} onChange={handleInputChange} className="w-full border-2 border-black p-3 rounded-lg" rows={3}></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] border-[4px] sm:border-[6px] border-black shadow-xl sm:shadow-2xl">
              <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-10 border-b-[4px] sm:border-b-[8px] border-black pb-4 sm:pb-8">
                <div className="bg-blue-400 p-2 sm:p-4 rounded-xl sm:rounded-2xl border-[3px] sm:border-4 border-black text-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] sm:shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                   <User className="w-8 h-8 sm:w-12 sm:h-12" strokeWidth={3} />
                </div>
                <h2 className="text-xl sm:text-4xl font-black text-black uppercase tracking-tighter italic underline decoration-blue-400 decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8">3. Maklumat Pelajar</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold mb-2">Nama Pelajar:</label>
                   <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} className="w-full border-2 border-black p-3 rounded-lg" />
                </div>
                <div>
                   <label className="block text-sm font-bold mb-2">Kelas:</label>
                   <input type="text" name="studentClass" value={formData.studentClass} onChange={handleInputChange} className="w-full border-2 border-black p-3 rounded-lg" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] border-[4px] sm:border-[6px] border-black shadow-xl sm:shadow-2xl">
              <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-10 border-b-[4px] sm:border-b-[8px] border-black pb-4 sm:pb-8">
                <div className="bg-green-400 p-2 sm:p-4 rounded-xl sm:rounded-2xl border-[3px] sm:border-4 border-black text-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] sm:shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                   <Calendar className="w-8 h-8 sm:w-12 sm:h-12" strokeWidth={3} />
                </div>
                <h2 className="text-xl sm:text-4xl font-black text-black uppercase tracking-tighter italic underline decoration-green-400 decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8">4. Tarikh Ketidakhadiran</h2>
              </div>
              <div className="flex gap-4 mb-4">
                 <input type="date" value={currentDateInput} onChange={(e) => setCurrentDateInput(e.target.value)} className="border-2 border-black p-3 rounded-lg" />
                 <button type="button" onClick={addDate} className="bg-green-400 border-2 border-black px-4 rounded-lg font-bold flex items-center gap-2"><Plus size={20}/> Tambah</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.absenceDates.map(date => (
                  <span key={date} className="bg-gray-200 border border-black px-3 py-1 rounded-full flex items-center gap-2">
                    {date}
                    <button type="button" onClick={() => removeDate(date)}><X size={16}/></button>
                  </span>
                ))}
              </div>
            </div>

            {(formData.letterType === LetterType.R2 || formData.letterType === LetterType.R3) && (
             <div className="bg-white p-6 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] border-[4px] sm:border-[6px] border-black shadow-xl sm:shadow-2xl">
                <h3 className="font-bold text-lg mb-4">Rujukan Terdahulu</h3>
                <label className="block text-sm font-bold mb-2">Tarikh Surat R1:</label>
                <input type="date" name="dateOfR1" value={formData.dateOfR1} onChange={handleInputChange} className="w-full border-2 border-black p-3 rounded-lg mb-4" />
                
                {formData.letterType === LetterType.R3 && (
                  <>
                    <label className="block text-sm font-bold mb-2">Tarikh Surat R2:</label>
                    <input type="date" name="dateOfR2" value={formData.dateOfR2} onChange={handleInputChange} className="w-full border-2 border-black p-3 rounded-lg mb-4" />
                    
                    <h3 className="font-bold text-lg mb-4 mt-6">Statistik Kehadiran</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">Dari Tarikh:</label>
                        <input type="date" name="attendanceFrom" value={formData.attendanceFrom} onChange={handleInputChange} className="w-full border-2 border-black p-3 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Hingga Tarikh:</label>
                        <input type="date" name="attendanceTo" value={formData.attendanceTo} onChange={handleInputChange} className="w-full border-2 border-black p-3 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Jum. Hari Hadir:</label>
                        <input type="number" name="totalDaysPresent" value={formData.totalDaysPresent} onChange={handleInputChange} className="w-full border-2 border-black p-3 rounded-lg" />
                      </div>
                       <div>
                        <label className="block text-sm font-bold mb-2">Jum. Hari Persekolahan:</label>
                        <input type="number" name="totalSchoolDays" value={formData.totalSchoolDays} onChange={handleInputChange} className="w-full border-2 border-black p-3 rounded-lg" />
                      </div>
                    </div>
                  </>
                )}
             </div>
            )}

          </div>
        </form>
      </main>
    </div>
  );
};
