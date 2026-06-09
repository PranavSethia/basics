const pool = require('../config/database');

const AssetRepository = {
  async create(data) {
    const { asset_code, asset_name, asset_type, purchase_date, purchase_cost, status } = data;
    const result = await pool.query(
      `INSERT INTO assets (asset_code, asset_name, asset_type, purchase_date, purchase_cost, status)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [asset_code, asset_name, asset_type, purchase_date, purchase_cost, status || 'available']
    );
    return result.rows[0];
  },

  async getAll({ page = 1, limit = 10, status, asset_type, search }) {
    const offset = (page - 1) * limit;
    let where = [];
    let values = [];
    let idx = 1;

    if (status) { where.push(`status = $${idx++}`); values.push(status); }
    if (asset_type) { where.push(`asset_type = $${idx++}`); values.push(asset_type); }
    if (search) {
      where.push(`(asset_name ILIKE $${idx} OR asset_code ILIKE $${idx})`);
      values.push(`%${search}%`); idx++;
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    values.push(limit, offset);

    const rows = await pool.query(
      `SELECT * FROM assets ${whereClause} ORDER BY id DESC LIMIT $${idx} OFFSET $${idx+1}`,
      values
    );
    const count = await pool.query(`SELECT COUNT(*) FROM assets ${whereClause}`, values.slice(0,-2));
    return { data: rows.rows, total: parseInt(count.rows[0].count), page, limit };
  },

  async getById(id) {
    const result = await pool.query(`SELECT * FROM assets WHERE id = $1`, [id]);
    return result.rows[0];
  },

  async update(id, data) {
    const fields = Object.keys(data).map((k, i) => `${k} = $${i + 2}`).join(', ');
    const values = [...Object.values(data), id];
    const result = await pool.query(`UPDATE assets SET ${fields} WHERE id = $1 RETURNING *`, values);
    return result.rows[0];
  },

  async allocate({ asset_id, employee_id, allocated_by, allocated_date }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const alloc = await client.query(
        `INSERT INTO asset_allocations (asset_id, employee_id, allocated_by, allocated_date, status)
         VALUES ($1,$2,$3,$4,'active') RETURNING *`,
        [asset_id, employee_id, allocated_by, allocated_date || new Date()]
      );
      await client.query(`UPDATE assets SET status='allocated' WHERE id=$1`, [asset_id]);
      await client.query(
        `INSERT INTO asset_history (asset_id, action, remarks, created_by, created_at)
         VALUES ($1,'allocated','Asset allocated to employee',$2,NOW())`,
        [asset_id, allocated_by]
      );
      await client.query('COMMIT');
      return alloc.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  async returnAsset(allocation_id, returned_by) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const alloc = await client.query(
        `UPDATE asset_allocations SET status='returned', return_date=NOW() WHERE id=$1 RETURNING *`,
        [allocation_id]
      );
      if (!alloc.rows[0]) throw new Error('Allocation not found');
      await client.query(`UPDATE assets SET status='available' WHERE id=$1`, [alloc.rows[0].asset_id]);
      await client.query(
        `INSERT INTO asset_history (asset_id, action, remarks, created_by, created_at)
         VALUES ($1,'returned','Asset returned by employee',$2,NOW())`,
        [alloc.rows[0].asset_id, returned_by]
      );
      await client.query('COMMIT');
      return alloc.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  async getHistory(asset_id) {
    const result = await pool.query(
      `SELECT ah.*, u.name as created_by_name FROM asset_history ah
       LEFT JOIN users u ON ah.created_by = u.id
       WHERE ah.asset_id = $1 ORDER BY ah.created_at DESC`,
      [asset_id]
    );
    return result.rows;
  },

  async getSummary() {
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status='available') as available,
        COUNT(*) FILTER (WHERE status='allocated') as allocated,
        COUNT(*) FILTER (WHERE status='returned') as returned,
        COUNT(*) FILTER (WHERE status='damaged') as damaged,
        COUNT(*) FILTER (WHERE status='lost') as lost,
        COUNT(*) as total
      FROM assets
    `);
    return result.rows[0];
  },
};

module.exports = AssetRepository;
