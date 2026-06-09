-- ============================================================
-- DATASET: Employee Management System (EMS)
-- Company : i-SOFTZONE Technologies Pvt Ltd
-- ============================================================
-- Covers:
--   ✅ INSERT Queries
--   ✅ Foreign Keys
--   ✅ JOINs
--   ✅ GROUP BY
--   ✅ Reports
--   ✅ Dashboard Analytics
--   ✅ Approval Workflow
-- ============================================================


-- ============================================================
-- STEP 1: CREATE DATABASE
-- ============================================================

-- Run this in psql or pgAdmin first:
-- CREATE DATABASE ems_db;
-- \c ems_db


-- ============================================================
-- STEP 2: CREATE TABLES
-- ============================================================

-- Table 1: Departments
CREATE TABLE IF NOT EXISTS departments (
    id              SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL
);

-- Table 2: Users
CREATE TABLE IF NOT EXISTS users (
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(100)  NOT NULL,
    email    VARCHAR(100)  UNIQUE NOT NULL,
    password VARCHAR(255)  NOT NULL,
    role     VARCHAR(20)   DEFAULT 'employee'
);

-- Table 3: Employee Profiles
CREATE TABLE IF NOT EXISTS employee_profiles (
    id            SERIAL PRIMARY KEY,
    user_id       INT REFERENCES users(id) ON DELETE CASCADE,
    department_id INT REFERENCES departments(id),
    phone         VARCHAR(20),
    address       TEXT,
    designation   VARCHAR(100),
    salary        NUMERIC(10, 2),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 4: Employee Images (One-to-Many)
CREATE TABLE IF NOT EXISTS employee_images (
    id          SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employee_profiles(id) ON DELETE CASCADE,
    image_url   TEXT
);

-- Table 5: Skills
CREATE TABLE IF NOT EXISTS skills (
    id         SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL
);

-- Table 6: Employee Skills (Many-to-Many)
CREATE TABLE IF NOT EXISTS employee_skills (
    id          SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employee_profiles(id) ON DELETE CASCADE,
    skill_id    INT REFERENCES skills(id) ON DELETE CASCADE
);

-- Table 7: Leave Types
CREATE TABLE IF NOT EXISTS leave_types (
    id          SERIAL PRIMARY KEY,
    leave_name  VARCHAR(100) NOT NULL,
    total_days  INT          NOT NULL
);

-- Table 8: Leave Balance
CREATE TABLE IF NOT EXISTS leave_balance (
    id             SERIAL PRIMARY KEY,
    employee_id    INT REFERENCES employee_profiles(id) ON DELETE CASCADE,
    leave_type_id  INT REFERENCES leave_types(id),
    available_days INT DEFAULT 0
);

-- Table 9: Leave Applications
CREATE TABLE IF NOT EXISTS leave_applications (
    id            SERIAL PRIMARY KEY,
    employee_id   INT REFERENCES employee_profiles(id) ON DELETE CASCADE,
    leave_type_id INT REFERENCES leave_types(id),
    from_date     DATE NOT NULL,
    to_date       DATE NOT NULL,
    total_days    INT  NOT NULL,
    reason        TEXT,
    status        VARCHAR(20) DEFAULT 'Pending',
    applied_at    TIMESTAMP  DEFAULT CURRENT_TIMESTAMP
);

-- Table 10: Approval History
CREATE TABLE IF NOT EXISTS approval_history (
    id          SERIAL PRIMARY KEY,
    leave_id    INT REFERENCES leave_applications(id) ON DELETE CASCADE,
    approved_by INT REFERENCES users(id),
    action      VARCHAR(20),
    remarks     TEXT,
    actioned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- STEP 3: INSERT DATA
-- ============================================================

-- 1. Departments
INSERT INTO departments (department_name)
VALUES
    ('Software Development'),
    ('Quality Assurance'),
    ('Human Resources'),
    ('Finance'),
    ('Digital Marketing'),
    ('Sales'),
    ('Operations'),
    ('Technical Support');


-- 2. Users
INSERT INTO users (name, email, password, role)
VALUES
    ('Pranay Gupta',  'pranay@isoftzone.com',  '123456', 'admin'),
    ('Rahul Sharma',  'rahul@isoftzone.com',   '123456', 'manager'),
    ('Priya Verma',   'priya@isoftzone.com',   '123456', 'hr'),
    ('Amit Patel',    'amit@isoftzone.com',    '123456', 'employee'),
    ('Neha Jain',     'neha@isoftzone.com',    '123456', 'employee'),
    ('Rohit Singh',   'rohit@isoftzone.com',   '123456', 'employee'),
    ('Anjali Gupta',  'anjali@isoftzone.com',  '123456', 'employee'),
    ('Vikas Mehta',   'vikas@isoftzone.com',   '123456', 'employee'),
    ('Pooja Shah',    'pooja@isoftzone.com',   '123456', 'employee'),
    ('Sandeep Kumar', 'sandeep@isoftzone.com', '123456', 'employee');


-- 3. Employee Profiles
INSERT INTO employee_profiles (user_id, department_id, phone, address, designation, salary)
VALUES
    (1,  1, '9876543210', 'Indore', 'Director',           150000),
    (2,  1, '9876543211', 'Indore', 'Project Manager',     85000),
    (3,  3, '9876543212', 'Indore', 'HR Manager',          70000),
    (4,  1, '9876543213', 'Indore', 'React Developer',     45000),
    (5,  1, '9876543214', 'Indore', 'Node Developer',      50000),
    (6,  2, '9876543215', 'Indore', 'QA Engineer',         40000),
    (7,  5, '9876543216', 'Indore', 'Marketing Executive', 35000),
    (8,  6, '9876543217', 'Indore', 'Sales Executive',     38000),
    (9,  8, '9876543218', 'Indore', 'Support Engineer',    32000),
    (10, 4, '9876543219', 'Indore', 'Accountant',          42000);


-- 4. Skills
INSERT INTO skills (skill_name)
VALUES
    ('React'),
    ('NodeJS'),
    ('PostgreSQL'),
    ('JavaScript'),
    ('HTML'),
    ('CSS'),
    ('MongoDB'),
    ('Python'),
    ('Testing'),
    ('Salesforce');


-- 5. Employee Skills (Many-to-Many)
INSERT INTO employee_skills (employee_id, skill_id)
VALUES
    -- Amit Patel (employee_id=4): React, JavaScript, HTML
    (4, 1),
    (4, 4),
    (4, 5),

    -- Neha Jain (employee_id=5): NodeJS, PostgreSQL, JavaScript
    (5, 2),
    (5, 3),
    (5, 4),

    -- Rohit Singh (employee_id=6): Testing
    (6, 9),

    -- Anjali Gupta (employee_id=7): JavaScript
    (7, 4),

    -- Vikas Mehta (employee_id=8): Salesforce
    (8, 10),

    -- Pooja Shah (employee_id=9): NodeJS, PostgreSQL
    (9, 2),
    (9, 3),

    -- Sandeep Kumar (employee_id=10): Python
    (10, 8);


-- 6. Leave Types
INSERT INTO leave_types (leave_name, total_days)
VALUES
    ('Casual Leave',    12),
    ('Sick Leave',      10),
    ('Earned Leave',    15),
    ('Maternity Leave', 90);


-- 7. Leave Balance
INSERT INTO leave_balance (employee_id, leave_type_id, available_days)
VALUES
    (4, 1, 10),
    (4, 2,  8),

    (5, 1, 12),
    (5, 2, 10),

    (6, 1,  8),
    (6, 2,  6),

    (7, 1, 10),
    (7, 2,  7),

    (8, 1, 12),
    (8, 2, 10);


-- 8. Leave Applications
INSERT INTO leave_applications (employee_id, leave_type_id, from_date, to_date, total_days, reason, status)
VALUES
    (4, 1, '2026-06-01', '2026-06-03', 3, 'Family Function', 'Approved'),
    (5, 2, '2026-06-10', '2026-06-11', 2, 'Fever',           'Pending'),
    (6, 1, '2026-05-20', '2026-05-21', 2, 'Personal Work',   'Approved'),
    (7, 1, '2026-06-15', '2026-06-17', 3, 'Travel',          'Pending'),
    (8, 2, '2026-06-18', '2026-06-20', 3, 'Medical',         'Rejected');


-- 9. Approval History
INSERT INTO approval_history (leave_id, approved_by, action, remarks)
VALUES
    (1, 2, 'Approved', 'Manager Approved'),
    (1, 3, 'Approved', 'HR Approved'),
    (3, 2, 'Approved', 'Manager Approved'),
    (3, 3, 'Approved', 'HR Approved'),
    (5, 2, 'Rejected', 'Insufficient Reason');


-- ============================================================
-- STEP 4: PRACTICE JOIN QUERIES
-- ============================================================

-- Query 1: Employee + Department
SELECT
    u.name,
    ep.designation,
    d.department_name
FROM employee_profiles ep
INNER JOIN users u       ON ep.user_id       = u.id
INNER JOIN departments d ON ep.department_id = d.id;


-- Query 2: Employee + Skills
SELECT
    u.name,
    s.skill_name
FROM employee_skills es
INNER JOIN employee_profiles ep ON es.employee_id = ep.id
INNER JOIN users u              ON ep.user_id      = u.id
INNER JOIN skills s             ON es.skill_id     = s.id;


-- Query 3: Pending Leaves
SELECT
    u.name,
    lt.leave_name,
    la.from_date,
    la.to_date,
    la.status
FROM leave_applications la
INNER JOIN users u        ON la.employee_id   = u.id
INNER JOIN leave_types lt ON la.leave_type_id = lt.id
WHERE la.status = 'Pending';


-- Query 4: Department-wise Employee Count
SELECT
    d.department_name,
    COUNT(*) AS total_employees
FROM employee_profiles ep
INNER JOIN departments d ON ep.department_id = d.id
GROUP BY d.department_name
ORDER BY total_employees DESC;


-- ============================================================
-- STEP 5: DASHBOARD ANALYTICS QUERIES
-- ============================================================

-- Total Employees
SELECT COUNT(*) AS total_employees FROM employee_profiles;

-- Total Departments
SELECT COUNT(*) AS total_departments FROM departments;

-- Total Skills
SELECT COUNT(*) AS total_skills FROM skills;

-- Pending Leaves
SELECT COUNT(*) AS pending_leaves
FROM leave_applications
WHERE status = 'Pending';

-- Approved Leaves
SELECT COUNT(*) AS approved_leaves
FROM leave_applications
WHERE status = 'Approved';

-- Rejected Leaves
SELECT COUNT(*) AS rejected_leaves
FROM leave_applications
WHERE status = 'Rejected';

-- Total Salary Expense
SELECT SUM(salary) AS total_salary_expense FROM employee_profiles;

-- ============================================================
-- EXPECTED DASHBOARD OUTPUT:
--   Total Employees      : 10
--   Total Departments    : 8
--   Total Skills         : 10
--   Pending Leaves       : 2
--   Approved Leaves      : 2
--   Rejected Leaves      : 1
--   Total Salary Expense : ₹5,87,000
-- ============================================================


-- ============================================================
-- STEP 6: REPORT QUERIES
-- ============================================================

-- Report 1: Full Employee Report (Name, Designation, Department, Salary)
SELECT
    u.name,
    ep.designation,
    d.department_name,
    ep.salary
FROM employee_profiles ep
INNER JOIN users u       ON ep.user_id       = u.id
INNER JOIN departments d ON ep.department_id = d.id
ORDER BY ep.salary DESC;


-- Report 2: Employee Skills Report
SELECT
    u.name,
    ep.designation,
    STRING_AGG(s.skill_name, ', ') AS skills
FROM employee_skills es
INNER JOIN employee_profiles ep ON es.employee_id = ep.id
INNER JOIN users u              ON ep.user_id      = u.id
INNER JOIN skills s             ON es.skill_id     = s.id
GROUP BY u.name, ep.designation
ORDER BY u.name;


-- Report 3: Leave Summary per Employee
SELECT
    u.name,
    lt.leave_name,
    lb.available_days
FROM leave_balance lb
INNER JOIN employee_profiles ep ON lb.employee_id   = ep.id
INNER JOIN users u              ON ep.user_id        = u.id
INNER JOIN leave_types lt       ON lb.leave_type_id  = lt.id
ORDER BY u.name;


-- Report 4: Approval History with Manager/HR Names
SELECT
    u_emp.name      AS employee_name,
    lt.leave_name,
    la.from_date,
    la.to_date,
    la.status,
    u_mgr.name      AS actioned_by,
    ah.action,
    ah.remarks
FROM approval_history ah
INNER JOIN leave_applications la ON ah.leave_id     = la.id
INNER JOIN employee_profiles ep  ON la.employee_id  = ep.id
INNER JOIN users u_emp           ON ep.user_id       = u_emp.id
INNER JOIN leave_types lt        ON la.leave_type_id = lt.id
INNER JOIN users u_mgr           ON ah.approved_by   = u_mgr.id
ORDER BY ah.actioned_at DESC;


-- ============================================================
-- END OF DATASET
-- ============================================================
