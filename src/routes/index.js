const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const AuthController = require('../controllers/authController');
const AssetController = require('../controllers/assetController');
const NotificationController = require('../controllers/notificationController');
const AuditController = require('../controllers/auditController');
const ReportController = require('../controllers/reportController');
const EmployeeController = require('../controllers/employeeController');

// Auth
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth/me', auth, AuthController.me);

// Employees
router.get('/employees', auth, EmployeeController.getAll);
router.get('/employees/:id', auth, EmployeeController.getById);
router.get('/departments', auth, EmployeeController.getDepartments);

// Assets
router.get('/assets/summary', auth, AssetController.getSummary);
router.get('/assets', auth, AssetController.getAll);
router.post('/assets', auth, AssetController.create);
router.get('/assets/:id', auth, AssetController.getById);
router.put('/assets/:id', auth, AssetController.update);
router.post('/assets/allocate', auth, AssetController.allocate);
router.put('/assets/return/:id', auth, AssetController.returnAsset);
router.get('/assets/:id/history', auth, AssetController.getHistory);

// Notifications
router.get('/notifications', auth, NotificationController.getAll);
router.get('/notifications/unread-count', auth, NotificationController.getUnreadCount);
router.put('/notifications/:id/read', auth, NotificationController.markRead);
router.put('/notifications/mark-all-read', auth, NotificationController.markAllRead);

// Audit
router.get('/audit-logs', auth, AuditController.getAll);

// Reports
router.get('/reports/dashboard', auth, ReportController.dashboard);
router.get('/reports/employees', auth, ReportController.employees);
router.get('/reports/assets', auth, ReportController.assets);

module.exports = router;
