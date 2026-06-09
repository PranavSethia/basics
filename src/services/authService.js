const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/userRepository');

const AuthService = {
  async register(data) {
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) throw { status: 409, message: 'Email already registered' };
    const hashed = await bcrypt.hash(data.password, 10);
    return UserRepository.create({ ...data, password: hashed });
  },

  async login(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw { status: 401, message: 'Invalid email or password' };
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw { status: 401, message: 'Invalid email or password' };
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  },
};

module.exports = AuthService;
