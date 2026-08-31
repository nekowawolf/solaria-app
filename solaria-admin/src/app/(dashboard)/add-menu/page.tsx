"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { menuService } from '@/services/menuService';
import { CreateMenuInput } from '@/types/menu';
import { toast } from 'react-hot-toast';
import { FaTag } from 'react-icons/fa';

export default function AddMenuPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState<CreateMenuInput>({
    code: '',
    name: '',
    description: '',
    price: 0,
    category: 'Nasi',
    image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      if (formData.price <= 0) {
        toast.error("Harga harus lebih dari 0");
        return;
      }

      await menuService.create(formData);
      toast.success("Menu baru berhasil ditambahkan!");
      router.push('/menu');
    } catch (err) {
      toast.error("Gagal menambahkan menu. Kode mungkin sudah ada.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  return (
    <>
      <Header />
      <main className="p-4 md:p-6 container mx-auto max-w-2xl">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800">Tambah Menu Baru</h3>
          <p className="text-gray-500 text-sm">Lengkapi form di bawah untuk menambah data menu</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <Input 
                  label="Kode Menu *" 
                  id="code"
                  name="code"
                  placeholder="Contoh: S1"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1 w-full relative">
                <label className="text-sm font-medium text-gray-700">Kategori *</label>
                <div className="relative">
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaTag />
                    </div>
                    <span>{formData.category || 'Pilih Kategori'}</span>
                    <svg className="w-4 h-4 ml-2 text-gray-400" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-10 mx-auto top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg w-full">
                      <ul className="p-2 text-sm text-gray-700 font-medium">
                        {['Nasi', 'Minuman', 'Mie'].map((cat) => (
                          <li key={cat}>
                            <div 
                              onClick={() => {
                                setFormData(prev => ({ ...prev, category: cat }));
                                setIsDropdownOpen(false);
                              }}
                              className={`cursor-pointer inline-flex items-center w-full p-2 hover:bg-gray-100 hover:text-primary rounded ${formData.category === cat ? 'bg-gray-50 text-primary' : ''}`}
                            >
                              {cat}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Input 
                label="Nama Menu *" 
                id="name"
                name="name"
                placeholder="Contoh: Nasi Goreng Spesial"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">Deskripsi</label>
              <textarea
                name="description"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors min-h-[100px] resize-y"
                placeholder="Penjelasan detail tentang menu..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1 relative">
                <Input 
                  type="number"
                  label="Harga (Rp) *" 
                  id="price"
                  name="price"
                  min="0"
                  step="1000"
                  placeholder="0"
                  value={formData.price || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <Input 
                  label="URL Gambar" 
                  id="image_url"
                  name="image_url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3 border-t">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="w-32"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Menu Baru'}
              </Button>
            </div>

          </form>
        </div>
      </main>
    </>
  );
}