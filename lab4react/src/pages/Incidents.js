import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const Incidents = () => {
  const [incidents, setIncidents] = useState([])
  const [newIncident, setNewIncident] = useState({
    status: '',
    date_incident: '',
    date_elimination: '',
    threatlevel_id: '',
    event_id: ''
  })

  const fetchIncidents = () => {
    api.get('/incidents')
      .then(res => setIncidents(res.data))
      .catch(() => alert('Ошибка загрузки инцидентов'))
  }

  useEffect(() => {
    fetchIncidents()
  }, [])

  const handleCreate = async () => {
    try {
      await api.post('/incidents', newIncident)
      setNewIncident({
        status: '',
        date_incident: '',
        date_elimination: '',
        threatlevel_id: '',
        event_id: ''
      })
      fetchIncidents()
    } catch {
      alert('Ошибка создания инцидента')
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Инциденты</h2>
      <ul>
        {incidents.map(inc => (
          <li key={inc.incident_id}>
            <Link to={`/incidents/${inc.incident_id}`}>
              {inc.status} — {new Date(inc.date_incident).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: 30 }}>Добавить инцидент</h3>
      <input
        placeholder="Статус"
        value={newIncident.status}
        onChange={e => setNewIncident({ ...newIncident, status: e.target.value })}
      />
      <input
        type="datetime-local"
        value={newIncident.date_incident}
        onChange={e => setNewIncident({ ...newIncident, date_incident: e.target.value })}
      />
      <input
        type="datetime-local"
        value={newIncident.date_elimination}
        onChange={e => setNewIncident({ ...newIncident, date_elimination: e.target.value })}
      />
      <input
        type="number"
        placeholder="Код угрозы"
        value={newIncident.threatlevel_id}
        onChange={e => setNewIncident({ ...newIncident, threatlevel_id: e.target.value })}
      />
      <input
        type="number"
        placeholder="Код мероприятия"
        value={newIncident.event_id}
        onChange={e => setNewIncident({ ...newIncident, event_id: e.target.value })}
      />
      <br />
      <button onClick={handleCreate} style={{ marginTop: 10 }}>Создать</button>
    </div>
  )
}

export default Incidents
