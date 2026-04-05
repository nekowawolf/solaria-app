import { MenuItem } from '../types/menu';

export const menuItems: MenuItem[] = [
  {
    id: 1,
    code: "S1",
    name: "Nasi Goreng Spesial",
    description: "Nasi goreng spesial dengan telur mata sapi dan ayam",
    price: 40910,
    image: "https://dcostseafood.id/wp-content/uploads/2023/04/Nasi-Goreng-Spesial.jpg",
    category: "Nasi"
  },
  {
    id: 2,
    code: "S2",
    name: "Nasi Ayam Bakar",
    description: "Nasi putih hangat dengan ayam bakar madu spesial",
    price: 30910,
    image: "https://dcostseafood.id/wp-content/uploads/2024/07/Nasi-ayam-bakar.jpg",
    category: "Nasi"
  },
  {
    id: 3,
    code: "S3",
    name: "Es Teh Manis",
    description: "Es teh manis segar",
    price: 21819,
    image: "https://asset.kompas.com/crops/VEMd5H4lRZYH6QAc3zr0b003UfU=/0x0:880x587/1200x800/data/photo/2023/08/16/64dc53ca9f3db.jpg",
    category: "Minuman"
  },
  {
    id: 4,
    code: "S4",
    name: "Mie Ayam Jamur",
    description: "Mie ayam dengan siraman kuah jamur yang gurih",
    price: 35455,
    image: "https://asset.kompas.com/crops/mVnCI4bJp7d-HHETQtFEQf4akqY=/18x9:670x444/1200x800/data/photo/2021/03/12/604b5acbc3075.jpg",
    category: "Mie"
  },
  {
    id: 5,
    code: "S5",
    name: "Nasi Capcay Seafood",
    description: "Nasi hangat dengan capcay sayur dan aneka seafood segar",
    price: 43637,
    image: "https://dcostseafood.id/wp-content/uploads/2021/12/Nasi-cacpcay-seafood.jpg",
    category: "Nasi"
  },
  {
    id: 6,
    code: "S6",
    name: "Kwetiau Goreng Sapi",
    description: "Kwetiau goreng spesial dengan irisan daging sapi pilihan",
    price: 52728,
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=600&auto=format&fit=crop",
    category: "Mie"
  }
];

export const menuCategories = ["Semua", "Nasi", "Mie", "Minuman"];