import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from './Sidebar'
import Header from './Header'
import LoadingSpinner from './LoadingSpinner'

const Layout = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
