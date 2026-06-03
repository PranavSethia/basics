import Sidebar from './Sidebar'
import '../styles/layout.css'

export default function Layout({ children, title }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {title && (
          <header className="page-header">
            <h1 className="page-title">{title}</h1>
          </header>
        )}
        <div className="page-body">{children}</div>
      </main>
    </div>
  )
}
