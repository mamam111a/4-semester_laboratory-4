import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

const Actions = () => {
  const [actions, setActions] = useState([])
  const [newAction, setNewAction] = useState({ threatlevel_id: '', protocol: '' })
  const navigate = useNavigate()

  useEffect(() => {
    fetchActions()
  }, [])

  const fetchActions = () => {
    api.get('/actions')
      .then(res => setActions(res.data))
      .catch(() => alert('Ошибка загрузки действий'))
  }

  const handleCreate = async () => {
    try {
      await api.post('/actions', newAction)
      setNewAction({ threatlevel_id: '', protocol: '' })
      fetchActions()
    } catch {
      alert('Ошибка создания')
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Действия</h2>
      <ul>
        {actions.map(action => (
          <li key={action.action_id}>
            <Link to={`/actions/${action.action_id}`}>
              {action.protocol}
            </Link>
          </li>
        ))}
      </ul>

      <h3>Создать новое действие</h3>
      <input
        placeholder="ID угрозы"
        value={newAction.threatlevel_id}
        onChange={e => setNewAction({ ...newAction, threatlevel_id: e.target.value })}
        style={{ marginRight: 10 }}
      />
      <input
        placeholder="Протокол"
        value={newAction.protocol}
        onChange={e => setNewAction({ ...newAction, protocol: e.target.value })}
      />
      <br />
      <button onClick={handleCreate} style={{ marginTop: 10 }}>Создать</button>
    </div>
  )
}

export default Actions
