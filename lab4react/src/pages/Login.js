import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const response = await api.post(
        '/token',
        new URLSearchParams({ username, password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )

      const token = response.data.access_token
      localStorage.setItem('token', token)
      setToken(token)  
      navigate('/events')
    } catch (error) {
      console.error('Ошибка при входе:', error)
      alert('Неверный логин или пароль')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10 }}>Войти</button>
      </form>
      <p style={{ marginTop: 15, textAlign: 'center' }}>
        Нет аккаунта? <Link to="/register">Регистрация</Link>
      </p>
    </div>
  )
}

export default Login
