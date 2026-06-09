import pool from '../config/db.js'

export const getAllEmployees = async ({ search, department_id, status } = {}) => {
  let query = `
    SELECT e.*, d.name AS department_name
    FROM employees e
    LEFT JOIN departments d ON d.id = e.department_id
    WHERE 1=1
  `
  const params = []

  if (search) {
    params.push(`%${search}%`)
    const idx = params.length
    query += ` AND (e.name ILIKE $${idx} OR e.email ILIKE $${idx} OR e.position ILIKE $${idx})`
  }
  if (department_id) {
    params.push(department_id)
    query += ` AND e.department_id = $${params.length}`
  }
  if (status) {
    params.push(status)
    query += ` AND e.status = $${params.length}`
  }

  query += ' ORDER BY e.name'
  const { rows } = await pool.query(query, params)
  return rows
}

export const getEmployeeById = async (id) => {
  const { rows } = await pool.query(
    `SELECT e.*, d.name AS department_name
     FROM employees e
     LEFT JOIN departments d ON d.id = e.department_id
     WHERE e.id = $1`,
    [id]
  )
  return rows[0]
}

export const createEmployee = async (data) => {
  const { name, email, phone, position, department_id, salary, hire_date, status } = data
  const { rows } = await pool.query(
    `INSERT INTO employees (name, email, phone, position, department_id, salary, hire_date, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [name, email, phone || null, position, department_id || null, salary || null, hire_date, status || 'active']
  )
  return rows[0]
}

export const updateEmployee = async (id, data) => {
  const { name, email, phone, position, department_id, salary, hire_date, status } = data
  const { rows } = await pool.query(
    `UPDATE employees SET
      name=$1, email=$2, phone=$3, position=$4,
      department_id=$5, salary=$6, hire_date=$7, status=$8
     WHERE id=$9 RETURNING *`,
    [name, email, phone || null, position, department_id || null, salary || null, hire_date, status, id]
  )
  return rows[0]
}

export const deleteEmployee = async (id) => {
  await pool.query('DELETE FROM employees WHERE id = $1', [id])
}

export const getDashboardStats = async () => {
  const { rows } = await pool.query(`
    SELECT
      COUNT(*)::int                                            AS total_employees,
      COUNT(*) FILTER (WHERE status = 'active')::int          AS active_employees,
      COUNT(*) FILTER (WHERE status = 'on_leave')::int        AS on_leave,
      COUNT(*) FILTER (WHERE status = 'inactive')::int        AS inactive_employees,
      ROUND(AVG(salary)::numeric, 2)                          AS avg_salary,
      COUNT(DISTINCT department_id)::int                      AS department_count,
      COUNT(*) FILTER (WHERE hire_date >= NOW() - INTERVAL '30 days')::int AS new_hires
    FROM employees
  `)
  return rows[0]
}
