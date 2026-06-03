import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import ConfirmModal from '../components/ConfirmModal'
import { getEmployees, deleteEmployee } from '../services/employeeService'
import { getDepartments } from '../services/departmentService'
import '../styles/employees.css'

export default function Employees() {
  const navigate = useNavigate()

  const [employees, setEmployees]     = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading]         = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]       = useState(false)

  const [filters, setFilters] = useState({ search: '', department_id: '', status: '' })

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const active = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      )
      const data = await getEmployees(active)
      setEmployees(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchEmployees() }, [fetchEmployees])

  useEffect(() => {
    getDepartments().then(setDepartments)
  }, [])

  const handleFilter = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteEmployee(deleteTarget.id)
      setDeleteTarget(null)
      fetchEmployees()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Layout title="Employees">
      {/* Toolbar */}
      <div className="toolbar">
        <input
          className="search-box"
          type="text"
          name="search"
          placeholder="Search by name, email, position…"
          value={filters.search}
          onChange={handleFilter}
        />
        <select className="filter-select" name="department_id" value={filters.department_id} onChange={handleFilter}>
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select className="filter-select" name="status" value={filters.status} onChange={handleFilter}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on_leave">On Leave</option>
        </select>
        <Link to="/employees/new" className="btn btn-primary" style={{ marginLeft: 'auto' }}>
          + Add Employee
        </Link>
      </div>

      {/* Table */}
      <div className="table-card">
        {loading ? (
          <div className="loading-wrap">Loading…</div>
        ) : employees.length === 0 ? (
          <div className="empty-state">No employees found.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Position</th>
                <th>Department</th>
                <th>Status</th>
                <th>Hire Date</th>
                <th>Salary</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="emp-name-cell">
                      <div className="emp-avatar">{emp.name[0].toUpperCase()}</div>
                      <div>
                        <div className="emp-name">{emp.name}</div>
                        <div className="emp-email">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{emp.position}</td>
                  <td>{emp.department_name || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                  <td>
                    <span className={`badge badge-${emp.status}`}>
                      {emp.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{new Date(emp.hire_date).toLocaleDateString()}</td>
                  <td>
                    {emp.salary
                      ? `$${Number(emp.salary).toLocaleString()}`
                      : <span style={{ color: '#94a3b8' }}>—</span>}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => navigate(`/employees/${emp.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTarget(emp)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteTarget && (
        <ConfirmModal
          message={`Delete "${deleteTarget.name}"? This cannot be undone.`}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </Layout>
  )
}
