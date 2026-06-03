import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { getEmployee, createEmployee, updateEmployee } from '../services/employeeService'
import { getDepartments } from '../services/departmentService'
import '../styles/employees.css'

const EMPTY = {
  name: '', email: '', phone: '', position: '',
  department_id: '', salary: '', hire_date: '', status: 'active',
}

export default function EmployeeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm]           = useState(EMPTY)
  const [departments, setDepts]   = useState([])
  const [error, setError]         = useState('')
  const [saving, setSaving]       = useState(false)
  const [fetching, setFetching]   = useState(isEdit)

  useEffect(() => {
    getDepartments().then(setDepts)
  }, [])

  useEffect(() => {
    if (!isEdit) return
    getEmployee(id)
      .then((emp) => {
        setForm({
          name:          emp.name,
          email:         emp.email,
          phone:         emp.phone        || '',
          position:      emp.position,
          department_id: emp.department_id || '',
          salary:        emp.salary        || '',
          hire_date:     emp.hire_date?.slice(0, 10) || '',
          status:        emp.status,
        })
      })
      .catch(() => navigate('/employees'))
      .finally(() => setFetching(false))
  }, [id, isEdit, navigate])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) {
        await updateEmployee(id, form)
      } else {
        await createEmployee(form)
      }
      navigate('/employees')
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const title = isEdit ? 'Edit Employee' : 'Add Employee'

  if (fetching) return <Layout title={title}><div className="loading-wrap">Loading…</div></Layout>

  return (
    <Layout title={title}>
      <div className="form-card">
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name" name="name" type="text"
                value={form.name} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email" name="email" type="email"
                value={form.email} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone" name="phone" type="tel"
                value={form.phone} onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">Position *</label>
              <input
                id="position" name="position" type="text"
                value={form.position} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department_id">Department</label>
              <select
                id="department_id" name="department_id"
                value={form.department_id} onChange={handleChange}
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="salary">Salary</label>
              <input
                id="salary" name="salary" type="number"
                value={form.salary} onChange={handleChange}
                min="0" step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="hire_date">Hire Date *</label>
              <input
                id="hire_date" name="hire_date" type="date"
                value={form.hire_date} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/employees')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
