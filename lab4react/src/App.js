import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './pages/Layout'

import Events from './pages/Events'
import EventDetail from './pages/EventDetail'

import Employees from './pages/Employees'
import EmployeeDetail from './pages/EmployeeDetail'

import Visitors from './pages/Visitors'
import VisitorDetail from './pages/VisitorDetail'

import Incidents from './pages/Incidents'
import IncidentDetail from './pages/IncidentDetail'

import ThreatLevels from './pages/ThreatLevels'
import ThreatLevelDetail from './pages/ThreatLevelDetail'

import Actions from './pages/Actions'
import ActionDetail from './pages/ActionDetail'

import Roles from './pages/Roles'
import RoleDetail from './pages/RoleDetail'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login setToken={setToken} />} />

      {token && (
        <Route element={<Layout />}>
          <Route path="/roles/:id" element={<RoleDetail />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/visitors" element={<Visitors />} />
          <Route path="/visitors/:id" element={<VisitorDetail />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/incidents/:id" element={<IncidentDetail />} />
          <Route path="/threatlevels" element={<ThreatLevels />} />
          <Route path="/threatlevels/:id" element={<ThreatLevelDetail />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/actions/:id" element={<ActionDetail />} />
        </Route>
      )}

      <Route path="*" element={<Navigate to={token ? "/events" : "/login"} />} />
    </Routes>
  )
}

export default App
