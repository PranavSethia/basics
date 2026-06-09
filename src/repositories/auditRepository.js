const pool = require('../config/database');

const AuditRepository = {
  async log({ tableName, actionType, recordId, oldData, newData, performedBy }) {
    const query = `
      INSERT INTO audit_logs (table_name, action_type, record_id, old_data, new_data, performed_by, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;
    const values = [
      tableName,
      actionType,
      recordId,
      oldData ? JSON.stringify(oldData) : null,
      newData ? JSON.stringify(newData) : null,
      performedBy,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getAll({ page = 1, limit = 20, tableName, actionType }) {
    const offset = (page - 1) * limit;
    let where = [];
    let values = [];
    let idx = 1;

    if (tableName) { where.push(`table_name = $${idx++}`); values.push(tableName); }
    if (actionType) { where.push(`action_type = $${idx++}`); values.push(actionType); }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    values.push(limit, offset);

    const query = `
      SELECT al.*, u.name as performed_by_name
      FROM audit_logs al
      LEFT JOIN users u ON al.performed_by = u.id
      ${whereClause}
      ORDER BY al.created_at DESC
      LIMIT $${idx} OFFSET $${idx + 1}
    `;
    const countQuery = `SELECT COUNT(*) FROM audit_logs ${whereClause}`;

    const [rows, count] = await Promise.all([
      pool.query(query, values),
      pool.query(countQuery, values.slice(0, -2)),
    ]);

    return {
      data: rows.rows,
      total: parseInt(count.rows[0].count),
      page,
      limit,
    };
  },
};

module.exports = AuditRepository;
