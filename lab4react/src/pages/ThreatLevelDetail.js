import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

const ThreatLevelDetail = () => {
  const { id } = useParams()
  const [level, setLevel] = useState(null)
  const [editedLevel, setEditedLevel] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/threatlevels/${id}`)
      .then(res => {
        setLevel(res.data)
        setEditedLevel(res.data)
      })
      .catch(() => {
        alert('Ошибка загрузки уровня угрозы')
        navigate('/threatlevels')
      })
  }, [id, navigate])

  const handleDelete = async () => {
    if (window.confirm('Удалить уровень угрозы?')) {
      try {
        await api.delete(`/threatlevels/${id}`)
        navigate('/threatlevels')
      } catch {
        alert('Ошибка при удалении')
      }
    }
  }

  const handleUpdate = async () => {
    try {
      await api.put(`/threatlevels/${id}`, editedLevel)
      setLevel(editedLevel)
      setIsEditing(false)
      alert('Уровень угрозы обновлён')
    } catch {
      alert('Ошибка при обновлении')
    }
  }

  if (!level) return <div>Загрузка...</div>

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Уровень угрозы #{level.threatlevel_id}</h2>

      {isEditing ? (
        <>
          <label>Степень угрозы:
            <input value={editedLevel.threat_level} onChange={e => setEditedLevel({ ...editedLevel, threat_level: e.target.value })} />
          </label><br />
          <label>Описание:
            <input value={editedLevel.description} onChange={e => setEditedLevel({ ...editedLevel, description: e.target.value })} />
          </label><br />
          <button onClick={handleUpdate}>Сохранить</button>
          <button onClick={() => setIsEditing(false)}>Отмена</button>
        </>
      ) : (
        <>
          <p><b>Степень угрозы:</b> {level.threat_level}</p>
          <p><b>Описание:</b> {level.description}</p>
          <button onClick={() => setIsEditing(true)}>Редактировать</button>
          <button onClick={handleDelete} style={{ marginLeft: 10, color: 'red' }}>Удалить</button>
        </>
      )}

      <br /><br />
      <button onClick={() => navigate('/threatlevels')}>Назад</button>
    </div>
  )
}

export default ThreatLevelDetail
