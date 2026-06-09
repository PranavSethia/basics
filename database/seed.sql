-- Seed Data — run after schema.sql

INSERT INTO departments (name, description) VALUES
  ('Engineering',     'Software development and infrastructure'),
  ('Design',          'Product and UX/UI design'),
  ('Marketing',       'Brand, growth, and communications'),
  ('Human Resources', 'Hiring, onboarding, and employee relations'),
  ('Finance',         'Accounting, budgeting, and reporting')
ON CONFLICT (name) DO NOTHING;
