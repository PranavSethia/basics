import pool from '../config/db.js'

export const getAllDepartments = async () => {
  const { rows } = await pool.query(`
    SELECT d.*, COUNT(e.id)::int AS employee_count
    FROM departments d
    LEFT JOIN employees e ON e.department_id = d.id
    GROUP BY d.id
    ORDER BY d.name
  `)
  return rows
}

export const getDepartmentById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM departments WHERE id = $1', [id])
  return rows[0]
}

export const createDepartment = async (name, description) => {
  const { rows } = await pool.query(
    `INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING *`,
    [name, description || null]
  )
  return rows[0]
}

export const updateDepartment = async (id, name, description) => {
  const { rows } = await pool.query(
    `UPDATE departments SET name=$1, description=$2 WHERE id=$3 RETURNING *`,
    [name, description || null, id]
  )
  return rows[0]
}

export const deleteDepartment = async (id) => {
  await pool.query('DELETE FROM departments WHERE id = $1', [id])
}
