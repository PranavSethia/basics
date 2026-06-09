import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ConfirmModal from '../components/ConfirmModal'
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../services/departmentService'
import '../styles/employees.css'

const EMPTY_FORM = { name: '', description: '' }

export default function Departments() {
  const [departments, setDepts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState('')
  const [showForm, setShowForm]   = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]   = useState(false)

  const fetchDepts = async () => {
    setLoading(true)
    try {
      setDepts(await getDepartments())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDepts() }, [])

  const openAdd = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setShowForm(true)
  }

  const openEdit = (dept) => {
    setEditingId(dept.id)
    setForm({ name: dept.name, description: dept.description || '' })
    setFormError('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setFormError('Name is required'); return }
    setSaving(true)
    try {
      if (editingId) {
        await updateDepartment(editingId, form)
      } else {
        await createDepartment(form)
      }
      closeForm()
      fetchDepts()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteDepartment(deleteTarget.id)
      setDeleteTarget(null)
      fetchDepts()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Layout title="Departments">
      {/* Toolbar */}
      <div className="toolbar">
        <button className="btn btn-primary" onClick={openAdd} style={{ marginLeft: 'auto' }}>
          + Add Department
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="dept-form">
          <h3>{editingId ? 'Edit Department' : 'New Department'}</h3>
          {formError && <div className="error-msg">{formError}</div>}
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Department name *"
              value={form.name}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description (optional)"
              value={form.description}
              onChange={handleChange}
              rows={2}
            />
            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Department cards */}
      {loading ? (
        <div className="loading-wrap">Loading…</div>
      ) : departments.length === 0 ? (
        <div className="empty-state">No departments yet. Add one to get started.</div>
      ) : (
        <div className="dept-grid">
          {departments.map((dept) => (
            <div key={dept.id} className="dept-card">
              <div className="dept-card-header">
                <h3 className="dept-name">{dept.name}</h3>
                <div className="row-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(dept)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(dept)}>
                    Delete
                  </button>
                </div>
              </div>
              {dept.description && <p className="dept-desc">{dept.description}</p>}
              <span className="dept-count">
                <strong>{dept.employee_count}</strong> employee{dept.employee_count !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete "${deleteTarget.name}"? Employees in this department will be unassigned.`}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </Layout>
  )
}
