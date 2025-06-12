import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

const RoleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [role, setRole] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedRole, setEditedRole] = useState({})

  useEffect(() => {
    api.get(`/roles/${id}`)
      .then(res => {
        setRole(res.data)
        setEditedRole(res.data)
      })
      .catch(() => {
        alert('Ошибка загрузки')
        navigate('/roles')
      })
  }, [id, navigate])

  const handleUpdate = async () => {
    try {
      await api.put(`/roles/${id}`, editedRole)
      alert('Обновлено')
      setIsEditing(false)
    } catch {
      alert('Ошибка обновления')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Удалить эту роль?')) {
      try {
        await api.delete(`/roles/${id}`)
        navigate('/roles')
      } catch {
        alert('Ошибка удаления')
      }
    }
  }

  if (!role) return <div>Загрузка...</div>

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Роль: {role.name}</h2>

      {isEditing ? (
        <>
          <input
            value={editedRole.name}
            onChange={e => setEditedRole({ ...editedRole, name: e.target.value })}
          />
          <button onClick={handleUpdate}>Сохранить</button>
          <button onClick={() => setIsEditing(false)}>Отмена</button>
        </>
      ) : (
        <>
          <p><b>Название:</b> {role.name}</p>
          <button onClick={() => setIsEditing(true)}>Редактировать</button>
          <button onClick={handleDelete} style={{ marginLeft: 10, color: 'red' }}>Удалить</button>
        </>
      )}

      <br /><br />
      <button onClick={() => navigate('/roles')}>Назад</button>
    </div>
  )
}

export default RoleDetail
