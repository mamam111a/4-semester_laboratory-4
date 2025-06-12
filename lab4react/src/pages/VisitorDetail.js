import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

const VisitorDetail = () => {
  const { id } = useParams()
  const [visitor, setVisitor] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editedVisitor, setEditedVisitor] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/visitors/${id}`)
      .then(res => {
        setVisitor(res.data)
        setEditedVisitor(res.data)
      })
      .catch(() => {
        alert('Ошибка загрузки посетителя')
        navigate('/visitors')
      })
  }, [id, navigate])

  const handleDelete = async () => {
    if (window.confirm('Удалить этого посетителя?')) {
      try {
        await api.delete(`/visitors/${id}`)
        navigate('/visitors')
      } catch {
        alert('Ошибка при удалении')
      }
    }
  }

  const handleUpdate = async () => {
    try {
      await api.put(`/visitors/${id}`, editedVisitor)
      setVisitor(editedVisitor)
      setEditMode(false)
      alert('Посетитель обновлён')
    } catch {
      alert('Ошибка при обновлении')
    }
  }

  if (!visitor) return <div>Загрузка...</div>

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Посетитель #{visitor.visitor_id}</h2>

      {editMode ? (
        <>
          <input value={editedVisitor.first_name} onChange={e => setEditedVisitor({ ...editedVisitor, first_name: e.target.value })} />
          <input value={editedVisitor.middle_name} onChange={e => setEditedVisitor({ ...editedVisitor, middle_name: e.target.value })} />
          <input value={editedVisitor.last_name} onChange={e => setEditedVisitor({ ...editedVisitor, last_name: e.target.value })} />
          <input value={editedVisitor.phone_number} onChange={e => setEditedVisitor({ ...editedVisitor, phone_number: e.target.value })} />
          <input type="date" value={editedVisitor.date_birth?.slice(0, 10)} onChange={e => setEditedVisitor({ ...editedVisitor, date_birth: e.target.value })} />
          <br />
          <button onClick={handleUpdate}>Сохранить</button>
          <button onClick={() => setEditMode(false)}>Отмена</button>
        </>
      ) : (
        <>
          <p><b>Имя:</b> {visitor.first_name}</p>
          <p><b>Отчество:</b> {visitor.middle_name}</p>
          <p><b>Фамилия:</b> {visitor.last_name}</p>
          <p><b>Телефон:</b> {visitor.phone_number}</p>
          <p><b>Дата рождения:</b> {new Date(visitor.date_birth).toLocaleDateString()}</p>
          <p><b>Дата регистрации:</b> {new Date(visitor.date_registration).toLocaleString()}</p>
          <button onClick={() => setEditMode(true)}>Редактировать</button>
          <button onClick={handleDelete} style={{ marginLeft: 10, color: 'red' }}>Удалить</button>
        </>
      )}

      <br /><br />
      <button onClick={() => navigate('/visitors')}>Назад</button>
    </div>
  )
}

export default VisitorDetail
