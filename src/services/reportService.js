const pool = require('../config/database');

const ReportService = {
  async getEmployeeReport() {
    const result = await pool.query(`
      SELECT u.id, u.name, u.email, u.role, u.created_at,
             ep.designation, ep.salary, d.department_name
      FROM users u
      LEFT JOIN employee_profiles ep ON u.id = ep.user_id
      LEFT JOIN departments d ON ep.department_id = d.id
      ORDER BY u.name
    `);
    return result.rows;
  },

  async getAssetReport() {
    const result = await pool.query(`
      SELECT a.id, a.asset_code, a.asset_name, a.asset_type, a.status,
             a.purchase_date, a.purchase_cost,
             u.name as assigned_to, aa.allocated_date
      FROM assets a
      LEFT JOIN asset_allocations aa ON a.id = aa.asset_id AND aa.status = 'active'
      LEFT JOIN users u ON aa.employee_id = u.id
      ORDER BY a.asset_type, a.asset_name
    `);
    return result.rows;
  },

  async getDashboardChartData() {
    const deptCount = await pool.query(`
      SELECT d.department_name, COUNT(ep.user_id)::int as count
      FROM departments d
      LEFT JOIN employee_profiles ep ON d.id = ep.department_id
      GROUP BY d.department_name ORDER BY count DESC
    `);

    const assetStatus = await pool.query(`
      SELECT status, COUNT(*)::int as count FROM assets GROUP BY status
    `);

    const monthlyHiring = await pool.query(`
      SELECT TO_CHAR(created_at, 'Mon YYYY') as month,
             COUNT(*)::int as count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY TO_CHAR(created_at, 'Mon YYYY'), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `);

    return {
      deptWiseEmployees: deptCount.rows,
      assetsByStatus: assetStatus.rows,
      monthlyHiring: monthlyHiring.rows,
    };
  },
};

module.exports = ReportService;
