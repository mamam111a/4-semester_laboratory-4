import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

const EmployeeDetail = () => {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedEmployee, setEditedEmployee] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/employees/${id}`)
      .then(res => {
        setEmployee(res.data)
        setEditedEmployee(res.data)
      })
      .catch(() => {
        alert('Ошибка загрузки сотрудника')
        navigate('/employees')
      })
  }, [id, navigate])

  const handleDelete = async () => {
    if (window.confirm('Удалить этого сотрудника?')) {
      try {
        await api.delete(`/employees/${id}`)
        navigate('/employees')
      } catch {
        alert('Ошибка при удалении')
      }
    }
  }

  const handleUpdate = async () => {
    try {
      await api.put(`/employees/${id}`, editedEmployee)
      alert('Обновлено')
      setIsEditing(false)
    } catch {
      alert('Ошибка обновления')
    }
  }

  if (!employee) return <div>Загрузка...</div>

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>{employee.first_name} {employee.middle_name} {employee.last_name}</h2>

      {isEditing ? (
        <div>
          <input
            placeholder="Имя"
            value={editedEmployee.first_name}
            onChange={e => setEditedEmployee({ ...editedEmployee, first_name: e.target.value })}
          />
          <input
            placeholder="Фамилия"
            value={editedEmployee.last_name}
            onChange={e => setEditedEmployee({ ...editedEmployee, last_name: e.target.value })}
          />
          <input
            placeholder="Отчество"
            value={editedEmployee.middle_name}
            onChange={e => setEditedEmployee({ ...editedEmployee, middle_name: e.target.value })}
          />
          <input
            placeholder="Телефон"
            value={editedEmployee.phone_number}
            onChange={e => setEditedEmployee({ ...editedEmployee, phone_number: e.target.value })}
          />
          <input
            placeholder="Логин"
            value={editedEmployee.login}
            onChange={e => setEditedEmployee({ ...editedEmployee, login: e.target.value })}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={editedEmployee.password || ''}
            onChange={e => setEditedEmployee({ ...editedEmployee, password: e.target.value })}
          />
          <input
            placeholder="ID роли"
            value={editedEmployee.role_id}
            onChange={e => setEditedEmployee({ ...editedEmployee, role_id: e.target.value })}
          />
          <button onClick={handleUpdate}>Сохранить</button>
          <button onClick={() => setIsEditing(false)}>Отмена</button>
        </div>
      ) : (
        <>
          <p><b>Телефон:</b> {employee.phone_number}</p>
          <p><b>Логин:</b> {employee.login}</p>
          <p><b>Код роли:</b> {employee.role_id}</p>
          <button onClick={() => setIsEditing(true)}>Редактировать</button>
          <button onClick={handleDelete} style={{ marginLeft: 10, color: 'red' }}>Удалить</button>
        </>
      )}

      <br /><br />
      <button onClick={() => navigate('/employees')}>Назад</button>
    </div>
  )
}

export default EmployeeDetail
