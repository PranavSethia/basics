const pool = require('../config/database');

const NotificationRepository = {
  async create({ userId, title, message }) {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, title, message, is_read, created_at)
       VALUES ($1, $2, $3, FALSE, NOW()) RETURNING *`,
      [userId, title, message]
    );
    return result.rows[0];
  },

  async getByUser(userId, unreadOnly = false) {
    const where = unreadOnly ? 'AND is_read = FALSE' : '';
    const result = await pool.query(
      `SELECT * FROM notifications WHERE user_id = $1 ${where} ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );
    return result.rows;
  },

  async markRead(id, userId) {
    const result = await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );
    return result.rows[0];
  },

  async markAllRead(userId) {
    await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE user_id = $1`,
      [userId]
    );
  },

  async getUnreadCount(userId) {
    const result = await pool.query(
      `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE`,
      [userId]
    );
    return parseInt(result.rows[0].count);
  },
};

module.exports = NotificationRepository;
