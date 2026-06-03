import { Router } from 'express'
import { list, get, create, update, remove, stats } from '../controllers/employeeController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = Router()

router.use(verifyToken)

router.get('/stats', stats)
router.get('/', list)
router.get('/:id', get)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)

export default router
