import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const Register = () => {
  const [form, setForm] = useState({ first_name: '', middle_name: '', last_name: '', phone_number: '', login: '', password: '', role_id: 2 })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/register', form)
      alert('Регистрация успешна, теперь войдите')
      navigate('/login')
    } catch (error) {
      alert(error.response?.data?.detail || 'Ошибка регистрации')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '20px auto' }}>
      <h2>Регистрация</h2>
      <input name="first_name" placeholder="Имя" value={form.first_name} onChange={handleChange} required />
      <input name="middle_name" placeholder="Фамилия" value={form.middle_name} onChange={handleChange} required />
      <input name="last_name" placeholder="Отчество" value={form.last_name} onChange={handleChange} />
      <input name="phone_number" placeholder="Телефон" value={form.phone_number} onChange={handleChange} required />
      <input name="login" placeholder="Логин" value={form.login} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Пароль" value={form.password} onChange={handleChange} required />
      <button type="submit">Зарегистрироваться</button>
    </form>
  )
}

export default Register
