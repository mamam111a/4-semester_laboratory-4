import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

const ActionDetail = () => {
  const { id } = useParams()
  const [action, setAction] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedAction, setEditedAction] = useState({ threatlevel_id: '', protocol: '' })
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/actions/${id}`)
      .then(res => {
        setAction(res.data)
        setEditedAction(res.data)
      })
      .catch(() => {
        alert('Ошибка загрузки действия')
        navigate('/actions')
      })
  }, [id, navigate])

  const handleDelete = async () => {
    if (window.confirm('Удалить это действие?')) {
      try {
        await api.delete(`/actions/${id}`)
        navigate('/actions')
      } catch {
        alert('Ошибка при удалении')
      }
    }
  }

  const handleUpdate = async () => {
    try {
      await api.put(`/actions/${id}`, editedAction)
      alert('Обновлено успешно')
      setIsEditing(false)
    } catch {
      alert('Ошибка обновления')
    }
  }

  if (!action) return <div>Загрузка...</div>

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Действие #{action.action_id}</h2>

      {isEditing ? (
        <>
          <label>Код угрозы:</label>
          <input
            value={editedAction.threatlevel_id}
            onChange={e => setEditedAction({ ...editedAction, threatlevel_id: e.target.value })}
          />
          <label>Протокол:</label>
          <input
            value={editedAction.protocol}
            onChange={e => setEditedAction({ ...editedAction, protocol: e.target.value })}
          />
          <button onClick={handleUpdate}>Сохранить</button>
          <button onClick={() => setIsEditing(false)}>Отмена</button>
        </>
      ) : (
        <>
          <p><b>Код угрозы:</b> {action.threatlevel_id}</p>
          <p><b>Протокол:</b> {action.protocol}</p>
          <button onClick={() => setIsEditing(true)}>Редактировать</button>
          <button onClick={handleDelete} style={{ marginLeft: 10, color: 'red' }}>Удалить</button>
        </>
      )}

      <br /><br />
      <button onClick={() => navigate('/actions')}>Назад</button>
    </div>
  )
}

export default ActionDetail
