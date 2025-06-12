import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    phone_number: '',
    login: '',
    password: '',
    role_id: ''
  })

  const fetchEmployees = () => {
    api.get('/employees')
      .then(res => setEmployees(res.data))
      .catch(() => alert('Ошибка загрузки сотрудников'))
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleCreate = async () => {
    try {
      await api.post('/employees', newEmployee)
      setNewEmployee({
        first_name: '',
        last_name: '',
        middle_name: '',
        phone_number: '',
        login: '',
        password: '',
        role_id: ''
      })
      fetchEmployees()
    } catch {
      alert('Ошибка создания')
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Сотрудники</h2>
      <ul>
        {employees.map(emp => (
          <li key={emp.employee_id}>
            <Link to={`/employees/${emp.employee_id}`}>
              {emp.first_name} {emp.middle_name} {emp.last_name}
            </Link>
          </li>
        ))}
      </ul>

      <h3>Создать сотрудника</h3>
      <input
        placeholder="Имя"
        value={newEmployee.first_name}
        onChange={e => setNewEmployee({ ...newEmployee, first_name: e.target.value })}
      />
      <input
        placeholder="Фамилия"
        value={newEmployee.last_name}
        onChange={e => setNewEmployee({ ...newEmployee, last_name: e.target.value })}
      />
      <input
        placeholder="Отчество"
        value={newEmployee.middle_name}
        onChange={e => setNewEmployee({ ...newEmployee, middle_name: e.target.value })}
      />
      <input
        placeholder="Телефон"
        value={newEmployee.phone_number}
        onChange={e => setNewEmployee({ ...newEmployee, phone_number: e.target.value })}
      />
      <input
        placeholder="Логин"
        value={newEmployee.login}
        onChange={e => setNewEmployee({ ...newEmployee, login: e.target.value })}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={newEmployee.password}
        onChange={e => setNewEmployee({ ...newEmployee, password: e.target.value })}
      />
      <input
        placeholder="ID роли"
        value={newEmployee.role_id}
        onChange={e => setNewEmployee({ ...newEmployee, role_id: e.target.value })}
      />
      <br />
      <button onClick={handleCreate} style={{ marginTop: 10 }}>Создать</button>
    </div>
  )
}

export default Employees
