import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const Roles = () => {
  const [roles, setRoles] = useState([])
  const [newRole, setNewRole] = useState({ name: '' })

  const fetchRoles = () => {
    api.get('/roles')
      .then(res => setRoles(res.data))
      .catch(() => alert('Ошибка загрузки ролей'))
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleCreate = async () => {
    try {
      await api.post('/roles', newRole)
      setNewRole({ name: '' })
      fetchRoles()
    } catch {
      alert('Ошибка создания роли')
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Роли</h2>
      <ul>
        {roles.map(role => (
          <li key={role.role_id}>
            <Link to={`/roles/${role.role_id}`}>{role.name}</Link>
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: 30 }}>Добавить роль</h3>
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          placeholder="Название роли"
          value={newRole.name}
          onChange={e => setNewRole({ name: e.target.value })}
        />
        <button onClick={handleCreate}>Создать</button>
      </div>
    </div>
  )
}

export default Roles
