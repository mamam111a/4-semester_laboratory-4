import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const Visitors = () => {
  const [visitors, setVisitors] = useState([])
  const [newVisitor, setNewVisitor] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    phone_number: '',
    date_birth: '',
  })

  const fetchVisitors = () => {
    api.get('/visitors')
      .then(res => setVisitors(res.data))
      .catch(() => alert('Ошибка загрузки посетителей'))
  }

  useEffect(() => {
    fetchVisitors()
  }, [])

  const handleCreate = async () => {
    try {
      await api.post('/visitors', newVisitor)
      setNewVisitor({
        first_name: '',
        middle_name: '',
        last_name: '',
        phone_number: '',
        date_birth: '',
      })
      fetchVisitors()
    } catch {
      alert('Ошибка при создании посетителя')
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Посетители</h2>
      <ul>
        {visitors.map(visitor => (
          <li key={visitor.visitor_id}>
            <Link to={`/visitors/${visitor.visitor_id}`}>
              {visitor.first_name} {visitor.middle_name} {visitor.last_name}
            </Link>
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: 30 }}>Добавить нового посетителя</h3>
      <input placeholder="Имя" value={newVisitor.first_name}
        onChange={e => setNewVisitor({ ...newVisitor, first_name: e.target.value })} />
      <input placeholder="Отчество" value={newVisitor.middle_name}
        onChange={e => setNewVisitor({ ...newVisitor, middle_name: e.target.value })} />
      <input placeholder="Фамилия" value={newVisitor.last_name}
        onChange={e => setNewVisitor({ ...newVisitor, last_name: e.target.value })} />
      <input placeholder="Телефон" value={newVisitor.phone_number}
        onChange={e => setNewVisitor({ ...newVisitor, phone_number: e.target.value })} />
      <input type="date" placeholder="Дата рождения" value={newVisitor.date_birth}
        onChange={e => setNewVisitor({ ...newVisitor, date_birth: e.target.value })} />
      <br />
      <button onClick={handleCreate} style={{ marginTop: 10 }}>Создать</button>
    </div>
  )
}

export default Visitors
