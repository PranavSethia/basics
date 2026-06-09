const UserRepository = require('../repositories/userRepository');
const AuditRepository = require('../repositories/auditRepository');
const pool = require('../config/database');

const EmployeeController = {
  async getAll(req, res, next) {
    try {
      const data = await UserRepository.getAll(req.query);
      res.json({ success: true, ...data });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const user = await UserRepository.getById(req.params.id);
      if (!user) return res.status(404).json({ success: false, error: 'Employee not found' });
      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  },

  async getDepartments(req, res, next) {
    try {
      const result = await pool.query(`SELECT * FROM departments ORDER BY department_name`);
      res.json({ success: true, data: result.rows });
    } catch (err) { next(err); }
  },
};

module.exports = EmployeeController;
