import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const Events = () => {
  const [events, setEvents] = useState([])
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date_start: '',
    date_end: '',
    age_limit: ''
  })

  const fetchEvents = () => {
    api.get('/events')
      .then(res => setEvents(res.data))
      .catch(() => alert('Ошибка загрузки мероприятий'))
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleCreate = async () => {
    try {
      await api.post('/events', newEvent)
      setNewEvent({
        name: '',
        description: '',
        date_start: '',
        date_end: '',
        age_limit: ''
      })
      fetchEvents()
    } catch {
      alert('Ошибка создания мероприятия')
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Мероприятия</h2>
      <ul>
        {events.map(event => (
          <li key={event.event_id}>
            <Link to={`/events/${event.event_id}`}>
              {event.name} — {new Date(event.date_start).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: 30 }}>Добавить мероприятие</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          placeholder="Название"
          value={newEvent.name}
          onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
        />
        <textarea
          placeholder="Описание"
          value={newEvent.description}
          onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
          rows={3}
        />
        <input
          type="datetime-local"
          value={newEvent.date_start}
          onChange={e => setNewEvent({ ...newEvent, date_start: e.target.value })}
        />
        <input
          type="datetime-local"
          value={newEvent.date_end}
          onChange={e => setNewEvent({ ...newEvent, date_end: e.target.value })}
        />
        <input
          type="number"
          placeholder="Возрастное ограничение"
          value={newEvent.age_limit}
          onChange={e => setNewEvent({ ...newEvent, age_limit: e.target.value })}
        />
        <button onClick={handleCreate}>Создать</button>
      </div>
    </div>
  )
}

export default Events
