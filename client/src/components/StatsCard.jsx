export default function StatsCard({ icon, label, value, color = '#6366f1' }) {
  return (
    <div className="stats-card" style={{ '--card-color': color }}>
      <div className="stats-icon">{icon}</div>
      <div className="stats-body">
        <span className="stats-value">{value ?? '—'}</span>
        <span className="stats-label">{label}</span>
      </div>
    </div>
  )
}
