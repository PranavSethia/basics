import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../models/departmentModel.js'

export const list = async (_req, res) => {
  try {
    const departments = await getAllDepartments()
    res.json(departments)
  } catch (err) {
    console.error('department list error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const get = async (req, res) => {
  try {
    const dept = await getDepartmentById(req.params.id)
    if (!dept) return res.status(404).json({ message: 'Department not found' })
    res.json(dept)
  } catch (err) {
    console.error('department get error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const create = async (req, res) => {
  const { name, description } = req.body
  if (!name) return res.status(400).json({ message: 'Name is required' })
  try {
    const dept = await createDepartment(name, description)
    res.status(201).json(dept)
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Department name already exists' })
    console.error('department create error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const update = async (req, res) => {
  const { name, description } = req.body
  if (!name) return res.status(400).json({ message: 'Name is required' })
  try {
    const dept = await updateDepartment(req.params.id, name, description)
    if (!dept) return res.status(404).json({ message: 'Department not found' })
    res.json(dept)
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Department name already exists' })
    console.error('department update error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const remove = async (req, res) => {
  try {
    await deleteDepartment(req.params.id)
    res.json({ message: 'Department deleted' })
  } catch (err) {
    console.error('department delete error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}
