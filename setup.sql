-- =============================================
-- ERP SYSTEM - Database Setup Script
-- Run this in psql or pgAdmin
-- =============================================

-- Create database (run separately if needed)
-- CREATE DATABASE erp_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    role VARCHAR(50) DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Employee Profiles
CREATE TABLE IF NOT EXISTS employee_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    designation VARCHAR(200),
    department_id INT REFERENCES departments(id),
    salary NUMERIC(12,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Asset Master
CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    asset_code VARCHAR(50) UNIQUE,
    asset_name VARCHAR(200) NOT NULL,
    asset_type VARCHAR(100),
    purchase_date DATE,
    purchase_cost NUMERIC(12,2),
    status VARCHAR(50) DEFAULT 'available'
);

-- Asset Allocations
CREATE TABLE IF NOT EXISTS asset_allocations (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id),
    employee_id INT REFERENCES users(id),
    allocated_by INT REFERENCES users(id),
    allocated_date DATE DEFAULT NOW(),
    return_date DATE,
    status VARCHAR(50) DEFAULT 'active'
);

-- Asset History
CREATE TABLE IF NOT EXISTS asset_history (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id),
    action VARCHAR(100),
    remarks TEXT,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100),
    action_type VARCHAR(50),
    record_id INT,
    old_data JSONB,
    new_data JSONB,
    performed_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- Views
-- =============================================
CREATE OR REPLACE VIEW employee_summary AS
SELECT
    u.id,
    u.name,
    u.email,
    u.role,
    d.department_name,
    ep.designation,
    ep.salary,
    u.created_at
FROM users u
LEFT JOIN employee_profiles ep ON u.id = ep.user_id
LEFT JOIN departments d ON d.id = ep.department_id;

-- =============================================
-- Stored Procedure: Calculate leave balance (stub)
-- =============================================
CREATE OR REPLACE FUNCTION get_employee_asset_count(emp_id INT)
RETURNS INT AS $$
DECLARE
  cnt INT;
BEGIN
  SELECT COUNT(*) INTO cnt FROM asset_allocations
  WHERE employee_id = emp_id AND status = 'active';
  RETURN cnt;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Seed Data
-- =============================================

-- Departments
INSERT INTO departments (department_name) VALUES
    ('Engineering'), ('HR'), ('Finance'), ('Marketing'), ('Operations')
ON CONFLICT DO NOTHING;

-- Admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
    ('Admin User', 'admin@erp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT DO NOTHING;

-- Sample assets
INSERT INTO assets (asset_code, asset_name, asset_type, purchase_date, purchase_cost, status) VALUES
    ('LAP001', 'Dell Laptop 15 Pro', 'Laptop', '2023-01-10', 75000, 'available'),
    ('LAP002', 'MacBook Air M2', 'Laptop', '2023-03-15', 120000, 'available'),
    ('MON001', 'LG 27" Monitor', 'Monitor', '2023-02-20', 25000, 'available'),
    ('MSE001', 'Logitech MX Master 3', 'Mouse', '2023-01-10', 5000, 'available'),
    ('ID001', 'ID Card - ERP001', 'ID Card', '2023-01-01', 200, 'available')
ON CONFLICT DO NOTHING;

SELECT 'Database setup complete! ✅' as status;
