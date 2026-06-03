import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { findUserByEmail, findUserById, createUser } from '../models/userModel.js'
import {
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
} from '../models/tokenModel.js'

const SALT_ROUNDS = 10

const signAccessToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
  )

const makeRefreshExpiry = () => {
  const days = parseInt(process.env.REFRESH_TOKEN_DAYS || '7', 10)
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

const issueTokenPair = async (user) => {
  const accessToken = signAccessToken(user)
  const refreshToken = crypto.randomBytes(64).toString('hex')
  await saveRefreshToken(user.id, refreshToken, makeRefreshExpiry())
  return { accessToken, refreshToken }
}

export const signup = async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  try {
    const existing = await findUserByEmail(email)
    if (existing) return res.status(409).json({ message: 'Email already registered' })

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await createUser(name, email, passwordHash)
    const { accessToken, refreshToken } = await issueTokenPair(user)

    res.status(201).json({ accessToken, refreshToken, user })
  } catch (err) {
    console.error('signup error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }
  try {
    const user = await findUserByEmail(email)
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) return res.status(401).json({ message: 'Invalid credentials' })

    const { password_hash, ...safeUser } = user
    const { accessToken, refreshToken } = await issueTokenPair(safeUser)

    res.json({ accessToken, refreshToken, user: safeUser })
  } catch (err) {
    console.error('login error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const refresh = async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required' })
  }
  try {
    const stored = await findRefreshToken(refreshToken)
    if (!stored) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' })
    }

    // Rotate: delete the used token before issuing a new pair
    await deleteRefreshToken(refreshToken)

    const user = await findUserById(stored.user_id)
    if (!user) return res.status(401).json({ message: 'User not found' })

    const { accessToken, refreshToken: newRefreshToken } = await issueTokenPair(user)
    res.json({ accessToken, refreshToken: newRefreshToken })
  } catch (err) {
    console.error('refresh error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const logout = async (req, res) => {
  const { refreshToken } = req.body
  try {
    if (refreshToken) await deleteRefreshToken(refreshToken)
    res.json({ message: 'Logged out successfully' })
  } catch (err) {
    console.error('logout error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}
