const AuthService = require('../services/authService');

const AuthController = {
  async register(req, res, next) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (err) { next(err); }
  },

  async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body.email, req.body.password);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  async me(req, res) {
    res.json({ success: true, data: req.user });
  },
};

module.exports = AuthController;
