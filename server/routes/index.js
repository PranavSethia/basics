import { Router } from 'express'
import authRouter from './authRoutes.js'
import employeeRouter from './employeeRoutes.js'
import departmentRouter from './departmentRoutes.js'

const router = Router()

router.use('/auth', authRouter)
router.use('/employees', employeeRouter)
router.use('/departments', departmentRouter)

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default router
