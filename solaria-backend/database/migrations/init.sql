-- Create database
CREATE DATABASE IF NOT EXISTS solaria_db;

-- Create menu table
CREATE TABLE IF NOT EXISTS menus (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_code VARCHAR(100) UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_id INTEGER REFERENCES menus(id),
    menu_code VARCHAR(10),
    menu_name VARCHAR(100),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample menu data
INSERT INTO menus (code, name, description, price, image_url, category) VALUES
('S1', 'Nasi Goreng Spesial', 'Nasi goreng spesial dengan telur mata sapi dan ayam', 40910, 'https://dcostseafood.id/wp-content/uploads/2023/04/Nasi-Goreng-Spesial.jpg', 'Nasi'),
('S2', 'Nasi Ayam Bakar', 'Nasi putih hangat dengan ayam bakar madu spesial', 30910, 'https://dcostseafood.id/wp-content/uploads/2024/07/Nasi-ayam-bakar.jpg', 'Nasi'),
('S3', 'Es Teh Manis', 'Es teh manis segar', 21819, 'https://asset.kompas.com/crops/VEMd5H4lRZYH6QAc3zr0b003UfU=/0x0:880x587/1200x800/data/photo/2023/08/16/64dc53ca9f3db.jpg', 'Minuman'),
('S4', 'Mie Ayam Jamur', 'Mie ayam dengan siraman kuah jamur yang gurih', 35455, 'https://asset.kompas.com/crops/mVnCI4bJp7d-HHETQtFEQf4akqY=/18x9:670x444/1200x800/data/photo/2021/03/12/604b5acbc3075.jpg', 'Mie'),
('S5', 'Nasi Capcay Seafood', 'Nasi hangat dengan capcay sayur dan aneka seafood segar', 43637, 'https://dcostseafood.id/wp-content/uploads/2021/12/Nasi-cacpcay-seafood.jpg', 'Nasi'),
('S6', 'Kwetiau Goreng Sapi', 'Kwetiau goreng spesial dengan irisan daging sapi pilihan', 52728, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=600&auto=format&fit=crop', 'Mie');

-- Insert admin data (username: admin, password: admin123)
INSERT INTO admins (username, password) VALUES 
('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_code ON orders(order_code);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_admins_username ON admins(username);