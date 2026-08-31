"use client";
import React, { useState } from 'react';
import { useMenus } from '@/hooks/useMenus';
import { MenuTable } from '@/components/menu/MenuTable';
import { Header } from '@/components/layout/Header';
import { Menu, UpdateMenuInput } from '@/types/menu';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { menuService } from '@/services/menuService';
import { toast } from 'react-hot-toast';

export default function MenuPage() {
  const { menus, isLoading, error, refetch } = useMenus();
  
  // Modals state
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState<UpdateMenuInput>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEditClick = (menu: Menu) => {
    setSelectedMenu(menu);
    setEditForm({
      name: menu.name,
      price: menu.price,
      description: menu.description,
      category: menu.category,
      code: menu.code,
      image_url: menu.image_url
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenu) return;
    
    try {
      setIsSubmitting(true);
      await menuService.update(selectedMenu.id, editForm);
      toast.success('Menu berhasil diperbarui!');
      setIsEditModalOpen(false);
      refetch();
    } catch (err) {
      toast.error('Gagal memperbarui menu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMenu) return;
    
    try {
      setIsSubmitting(true);
      await menuService.delete(selectedMenu.id);
      toast.success('Menu berhasil dihapus!');
      setIsDeleteModalOpen(false);
      refetch();
    } catch (err) {
      toast.error('Gagal menghapus menu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="p-4 md:p-6 container mx-auto">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800">Manajemen Menu</h3>
          <p className="text-gray-500 text-sm">Daftar semua menu yang tersedia</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-4 border border-red-100">
            {error}
          </div>
        )}

        <MenuTable 
          menus={menus} 
          isLoading={isLoading} 
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        {/* Edit Modal */}
        <Modal 
          isOpen={isEditModalOpen} 
          onClose={() => !isSubmitting && setIsEditModalOpen(false)}
          title="Edit Menu"
        >
          {selectedMenu && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <Input 
                label="Kode Menu" 
                value={editForm.code || ''} 
                onChange={(e) => setEditForm({...editForm, code: e.target.value})}
                required
              />
              <Input 
                label="Nama Menu" 
                value={editForm.name || ''} 
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 w-full relative">
                  <label className="text-sm font-medium text-gray-700">Kategori *</label>
                  <div className="relative">
                    <div 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>{editForm.category || 'Pilih Kategori'}</span>
                      <svg className="w-4 h-4 ml-2 text-gray-400" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                    
                    {isDropdownOpen && (
                      <div className="absolute z-10 mx-auto top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg w-full">
                        <ul className="p-2 text-sm text-gray-700 font-medium">
                          {['Nasi', 'Minuman', 'Mie'].map((cat) => (
                            <li key={cat}>
                              <div 
                                onClick={() => {
                                  setEditForm(prev => ({ ...prev, category: cat }));
                                  setIsDropdownOpen(false);
                                }}
                                className={`cursor-pointer inline-flex items-center w-full p-2 hover:bg-gray-100 hover:text-primary rounded ${editForm.category === cat ? 'bg-gray-50 text-primary' : ''}`}
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

                <Input 
                  type="number"
                  label="Harga *" 
                  value={editForm.price || ''} 
                  onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})}
                  required
                />
              </div>

              <Input 
                label="URL Gambar" 
                value={editForm.image_url || ''} 
                onChange={(e) => setEditForm({...editForm, image_url: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
              <div className="pt-2 flex gap-3">
                <Button 
                  type="button" 
                  variant="secondary" 
                  fullWidth 
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  fullWidth 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </form>
          )}
        </Modal>

        {/* Delete Modal */}
        <Modal 
          isOpen={isDeleteModalOpen} 
          onClose={() => !isSubmitting && setIsDeleteModalOpen(false)}
          title="Konfirmasi Hapus"
        >
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">
              !
            </div>
            <p className="text-gray-600">
              Apakah Anda yakin ingin menghapus <strong>{selectedMenu?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="pt-2 flex gap-3">
              <Button 
                variant="secondary" 
                fullWidth 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button 
                variant="danger" 
                fullWidth 
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </>
  );
}