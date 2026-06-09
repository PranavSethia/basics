import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import StatsCard from '../components/StatsCard'
import { getDashboardStats, getEmployees } from '../services/employeeService'
import '../styles/dashboard.css'
import '../styles/employees.css'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getEmployees(),
    ]).then(([s, emps]) => {
      setStats(s)
      setRecent(emps.slice(0, 5))
    }).finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Dashboard">
      {loading ? (
        <div className="loading-wrap">Loading…</div>
      ) : (
        <>
          <div className="stats-grid">
            <StatsCard icon="👥" label="Total Employees"  value={stats?.total_employees}  color="#6366f1" />
            <StatsCard icon="✅" label="Active"           value={stats?.active_employees}  color="#22c55e" />
            <StatsCard icon="🏢" label="Departments"      value={stats?.department_count}  color="#f59e0b" />
            <StatsCard icon="🆕" label="New This Month"   value={stats?.new_hires}         color="#06b6d4" />
            <StatsCard icon="💰" label="Avg Salary"
              value={stats?.avg_salary ? `$${Number(stats.avg_salary).toLocaleString()}` : '—'}
              color="#8b5cf6"
            />
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Recent Employees</h2>
              <Link to="/employees" className="section-link">View all →</Link>
            </div>
            {recent.length === 0 ? (
              <div className="empty-state">No employees yet. <Link to="/employees/new">Add one →</Link></div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map(emp => (
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
                      <td><span className={`badge badge-${emp.status}`}>{emp.status.replace('_', ' ')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </Layout>
  )
}
