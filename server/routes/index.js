import { Router } from 'express'
import authRouter from './authRoutes.js'

const router = Router()

router.use('/auth', authRouter)

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default router
