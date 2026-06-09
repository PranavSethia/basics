const NotificationService = require('../services/notificationService');

const NotificationController = {
  async getAll(req, res, next) {
    try {
      const unreadOnly = req.query.unread === 'true';
      const data = await NotificationService.getForUser(req.user.id, unreadOnly);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async getUnreadCount(req, res, next) {
    try {
      const count = await NotificationService.getUnreadCount(req.user.id);
      res.json({ success: true, count });
    } catch (err) { next(err); }
  },

  async markRead(req, res, next) {
    try {
      const notif = await NotificationService.markRead(req.params.id, req.user.id);
      res.json({ success: true, data: notif });
    } catch (err) { next(err); }
  },

  async markAllRead(req, res, next) {
    try {
      await NotificationService.markAllRead(req.user.id);
      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (err) { next(err); }
  },
};

module.exports = NotificationController;
