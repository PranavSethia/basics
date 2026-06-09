const AuditRepository = require('../repositories/auditRepository');

const AuditController = {
  async getAll(req, res, next) {
    try {
      const data = await AuditRepository.getAll(req.query);
      res.json({ success: true, ...data });
    } catch (err) { next(err); }
  },
};

module.exports = AuditController;
