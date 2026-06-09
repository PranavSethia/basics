const ReportService = require('../services/reportService');
const UserRepository = require('../repositories/userRepository');

const ReportController = {
  async employees(req, res, next) {
    try {
      const data = await ReportService.getEmployeeReport();
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async assets(req, res, next) {
    try {
      const data = await ReportService.getAssetReport();
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async dashboard(req, res, next) {
    try {
      const [stats, charts] = await Promise.all([
        UserRepository.getDashboardStats(),
        ReportService.getDashboardChartData(),
      ]);
      res.json({ success: true, data: { stats, charts } });
    } catch (err) { next(err); }
  },
};

module.exports = ReportController;
