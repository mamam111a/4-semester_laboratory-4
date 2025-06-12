import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

const IncidentDetail = () => {
  const { id } = useParams()
  const [incident, setIncident] = useState(null)
  const [editedIncident, setEditedIncident] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/incidents/${id}`)
      .then(res => {
        setIncident(res.data)
        setEditedIncident(res.data)
      })
      .catch(() => {
        alert('Ошибка загрузки инцидента')
        navigate('/incidents')
      })
  }, [id, navigate])

  const handleDelete = async () => {
    if (window.confirm('Удалить инцидент?')) {
      try {
        await api.delete(`/incidents/${id}`)
        navigate('/incidents')
      } catch {
        alert('Ошибка при удалении')
      }
    }
  }

  const handleUpdate = async () => {
    try {
      await api.put(`/incidents/${id}`, editedIncident)
      alert('Инцидент обновлён')
      setIsEditing(false)
      setIncident(editedIncident)
    } catch {
      alert('Ошибка при обновлении')
    }
  }

  if (!incident) return <div>Загрузка...</div>

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Инцидент #{incident.incident_id}</h2>

      {isEditing ? (
        <>
          <label>Статус:
            <input value={editedIncident.status} onChange={e => setEditedIncident({ ...editedIncident, status: e.target.value })} />
          </label><br />
          <label>Дата инцидента:
            <input
              type="datetime-local"
              value={editedIncident.date_incident?.slice(0, 16)}
              onChange={e => setEditedIncident({ ...editedIncident, date_incident: e.target.value })}
            />
          </label><br />
          <label>Дата устранения:
            <input
              type="datetime-local"
              value={editedIncident.date_elimination?.slice(0, 16) || ''}
              onChange={e => setEditedIncident({ ...editedIncident, date_elimination: e.target.value })}
            />
          </label><br />
          <label>Код угрозы:
            <input type="number" value={editedIncident.threatlevel_id} onChange={e => setEditedIncident({ ...editedIncident, threatlevel_id: e.target.value })} />
          </label><br />
          <label>Код мероприятия:
            <input type="number" value={editedIncident.event_id} onChange={e => setEditedIncident({ ...editedIncident, event_id: e.target.value })} />
          </label><br />
          <button onClick={handleUpdate}>Сохранить</button>
          <button onClick={() => setIsEditing(false)}>Отмена</button>
        </>
      ) : (
        <>
          <p><b>Статус:</b> {incident.status}</p>
          <p><b>Дата инцидента:</b> {new Date(incident.date_incident).toLocaleString()}</p>
          <p><b>Дата устранения:</b> {incident.date_elimination ? new Date(incident.date_elimination).toLocaleString() : '—'}</p>
          <p><b>Код угрозы:</b> {incident.threatlevel_id}</p>
          <p><b>Код мероприятия:</b> {incident.event_id}</p>
          <button onClick={() => setIsEditing(true)}>Редактировать</button>
          <button onClick={handleDelete} style={{ marginLeft: 10, color: 'red' }}>Удалить</button>
        </>
      )}

      <br /><br />
      <button onClick={() => navigate('/incidents')}>Назад</button>
    </div>
  )
}

export default IncidentDetail
