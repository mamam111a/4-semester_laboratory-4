import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const ThreatLevels = () => {
  const [levels, setLevels] = useState([])
  const [newLevel, setNewLevel] = useState({ threat_level: '', description: '' })

  const fetchLevels = () => {
    api.get('/threatlevels')
      .then(res => setLevels(res.data))
      .catch(() => alert('Ошибка загрузки уровней угроз'))
  }

  useEffect(() => {
    fetchLevels()
  }, [])

  const handleCreate = async () => {
    try {
      await api.post('/threatlevels', newLevel)
      setNewLevel({ threat_level: '', description: '' })
      fetchLevels()
    } catch {
      alert('Ошибка создания')
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Уровни угроз</h2>
      <ul>
        {levels.map(level => (
          <li key={level.threatlevel_id}>
            <Link to={`/threatlevels/${level.threatlevel_id}`}>
              {level.threat_level} — {level.description}
            </Link>
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: 30 }}>Добавить уровень угрозы</h3>
      <input
        placeholder="Степень угрозы"
        value={newLevel.threat_level}
        onChange={e => setNewLevel({ ...newLevel, threat_level: e.target.value })}
      />
      <input
        placeholder="Описание"
        value={newLevel.description}
        onChange={e => setNewLevel({ ...newLevel, description: e.target.value })}
      />
      <br />
      <button onClick={handleCreate} style={{ marginTop: 10 }}>Создать</button>
    </div>
  )
}

export default ThreatLevels
