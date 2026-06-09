const NotificationRepository = require('../repositories/notificationRepository');

const NotificationService = {
  async send(userId, title, message) {
    return NotificationRepository.create({ userId, title, message });
  },

  // Event-driven notification triggers
  async onAssetAssigned(employeeId, assetName) {
    return this.send(employeeId, '🖥️ Asset Assigned', `${assetName} has been assigned to you.`);
  },

  async onAssetReturned(employeeId, assetName) {
    return this.send(employeeId, '📦 Asset Returned', `${assetName} has been marked as returned.`);
  },

  async onLeaveApproved(employeeId) {
    return this.send(employeeId, '✅ Leave Approved', 'Your leave request has been approved.');
  },

  async onLeaveRejected(employeeId) {
    return this.send(employeeId, '❌ Leave Rejected', 'Your leave request was not approved.');
  },

  async getForUser(userId, unreadOnly) {
    return NotificationRepository.getByUser(userId, unreadOnly);
  },

  async markRead(id, userId) {
    return NotificationRepository.markRead(id, userId);
  },

  async markAllRead(userId) {
    return NotificationRepository.markAllRead(userId);
  },

  async getUnreadCount(userId) {
    return NotificationRepository.getUnreadCount(userId);
  },
};

module.exports = NotificationService;
