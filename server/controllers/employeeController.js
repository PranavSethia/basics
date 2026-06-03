import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDashboardStats,
} from '../models/employeeModel.js'

export const list = async (req, res) => {
  try {
    const { search, department_id, status } = req.query
    const employees = await getAllEmployees({ search, department_id, status })
    res.json(employees)
  } catch (err) {
    console.error('employee list error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const get = async (req, res) => {
  try {
    const employee = await getEmployeeById(req.params.id)
    if (!employee) return res.status(404).json({ message: 'Employee not found' })
    res.json(employee)
  } catch (err) {
    console.error('employee get error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const create = async (req, res) => {
  const { name, email, position, hire_date } = req.body
  if (!name || !email || !position || !hire_date) {
    return res.status(400).json({ message: 'Name, email, position, and hire date are required' })
  }
  try {
    const employee = await createEmployee(req.body)
    res.status(201).json(employee)
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Email already in use' })
    console.error('employee create error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const update = async (req, res) => {
  const { name, email, position, hire_date } = req.body
  if (!name || !email || !position || !hire_date) {
    return res.status(400).json({ message: 'Name, email, position, and hire date are required' })
  }
  try {
    const employee = await updateEmployee(req.params.id, req.body)
    if (!employee) return res.status(404).json({ message: 'Employee not found' })
    res.json(employee)
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Email already in use' })
    console.error('employee update error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const remove = async (req, res) => {
  try {
    await deleteEmployee(req.params.id)
    res.json({ message: 'Employee deleted' })
  } catch (err) {
    console.error('employee delete error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const stats = async (_req, res) => {
  try {
    const data = await getDashboardStats()
    res.json(data)
  } catch (err) {
    console.error('stats error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}
