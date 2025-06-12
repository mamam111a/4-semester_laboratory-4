import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

const EventDetail = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedEvent, setEditedEvent] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(res => {
        setEvent(res.data)
        setEditedEvent(res.data)
      })
      .catch(() => {
        alert('Ошибка загрузки мероприятия')
        navigate('/events')
      })
  }, [id, navigate])

  const handleDelete = async () => {
    if (window.confirm('Удалить это мероприятие?')) {
      try {
        await api.delete(`/events/${id}`)
        navigate('/events')
      } catch {
        alert('Ошибка удаления')
      }
    }
  }

  const handleUpdate = async () => {
    try {
      await api.put(`/events/${id}`, editedEvent)
      alert('Обновлено')
      setIsEditing(false)
    } catch {
      alert('Ошибка обновления')
    }
  }

  if (!event) return <div>Загрузка...</div>

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>{event.name}</h2>

      {isEditing ? (
        <>
          <input
            placeholder="Название"
            value={editedEvent.name}
            onChange={e => setEditedEvent({ ...editedEvent, name: e.target.value })}
          />
          <textarea
            placeholder="Описание"
            value={editedEvent.description}
            onChange={e => setEditedEvent({ ...editedEvent, description: e.target.value })}
          />
          <input
            type="datetime-local"
            value={editedEvent.date_start?.slice(0, 16)}
            onChange={e => setEditedEvent({ ...editedEvent, date_start: e.target.value })}
          />
          <input
            type="datetime-local"
            value={editedEvent.date_end?.slice(0, 16)}
            onChange={e => setEditedEvent({ ...editedEvent, date_end: e.target.value })}
          />
          <input
            type="number"
            placeholder="Возрастное ограничение"
            value={editedEvent.age_limit}
            onChange={e => setEditedEvent({ ...editedEvent, age_limit: e.target.value })}
          />
          <button onClick={handleUpdate}>Сохранить</button>
          <button onClick={() => setIsEditing(false)}>Отмена</button>
        </>
      ) : (
        <>
          <p><b>Описание:</b> {event.description}</p>
          <p><b>Дата начала:</b> {new Date(event.date_start).toLocaleString()}</p>
          <p><b>Дата окончания:</b> {new Date(event.date_end).toLocaleString()}</p>
          <p><b>Возрастное ограничение:</b> {event.age_limit}+</p>
          <button onClick={() => setIsEditing(true)}>Редактировать</button>
          <button onClick={handleDelete} style={{ marginLeft: 10, color: 'red' }}>Удалить</button>
        </>
      )}

      <br /><br />
      <button onClick={() => navigate('/events')}>Назад</button>
    </div>
  )
}

export default EventDetail
