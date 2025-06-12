// components/Layout.jsx
import { Link, Outlet } from 'react-router-dom'

const Layout = () => (
  <div style={{ display: 'flex' }}>
    <nav style={{ padding: 20, width: 200, background: '#FFFFFF' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><Link to="/events">События</Link></li>
        <li><Link to="/employees">Сотрудники</Link></li>
        <li><Link to="/visitors">Посетители</Link></li>
        <li><Link to="/incidents">Инциденты</Link></li>
        <li><Link to="/threatlevels">Уровни угроз</Link></li>
        <li><Link to="/actions">Действия</Link></li>
        <li><Link to="/roles">Роли</Link></li>
      </ul>
    </nav>
    <main style={{ flex: 1, padding: 20 }}>
      <Outlet />
    </main>
  </div>
)

export default Layout
