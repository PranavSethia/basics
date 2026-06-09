const pool = require('../config/database');

const UserRepository = {
  async getAll({ page = 1, limit = 10, search, department_id }) {
    const offset = (page - 1) * limit;
    let where = [];
    let values = [];
    let idx = 1;

    if (search) {
      where.push(`(u.name ILIKE $${idx} OR u.email ILIKE $${idx})`);
      values.push(`%${search}%`); idx++;
    }
    if (department_id) { where.push(`ep.department_id = $${idx++}`); values.push(department_id); }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    values.push(limit, offset);

    const rows = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.created_at,
              ep.designation, ep.department_id, d.department_name
       FROM users u
       LEFT JOIN employee_profiles ep ON u.id = ep.user_id
       LEFT JOIN departments d ON ep.department_id = d.id
       ${whereClause}
       ORDER BY u.id DESC LIMIT $${idx} OFFSET $${idx+1}`,
      values
    );
    const count = await pool.query(
      `SELECT COUNT(*) FROM users u LEFT JOIN employee_profiles ep ON u.id = ep.user_id ${whereClause}`,
      values.slice(0, -2)
    );
    return { data: rows.rows, total: parseInt(count.rows[0].count), page, limit };
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT u.*, ep.designation, ep.department_id, ep.salary, d.department_name
       FROM users u
       LEFT JOIN employee_profiles ep ON u.id = ep.user_id
       LEFT JOIN departments d ON ep.department_id = d.id
       WHERE u.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return result.rows[0];
  },

  async create({ name, email, password, role }) {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, created_at) VALUES ($1,$2,$3,$4,NOW()) RETURNING id, name, email, role, created_at`,
      [name, email, password, role || 'employee']
    );
    return result.rows[0];
  },

  async getDashboardStats() {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users) as total_employees,
        (SELECT COUNT(*) FROM assets) as total_assets,
        (SELECT COUNT(*) FROM assets WHERE status='allocated') as allocated_assets,
        (SELECT COUNT(*) FROM departments) as total_departments
    `);
    return result.rows[0];
  },

  async getDeptWiseCount() {
    const result = await pool.query(`
      SELECT d.department_name, COUNT(ep.user_id) as count
      FROM departments d
      LEFT JOIN employee_profiles ep ON d.id = ep.department_id
      GROUP BY d.id, d.department_name
      ORDER BY count DESC
    `);
    return result.rows;
  },
};

module.exports = UserRepository;
