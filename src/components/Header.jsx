import React from 'react'
import { Bell, User, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const { user, signOut } = useAuth()

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-search">
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="search-input"
          />
        </div>
        
        <div className="header-actions">
          <button className="icon-btn">
            <Bell size={20} />
          </button>
          
          <div className="user-menu">
            <div className="user-avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{user?.email}</span>
            
            <div className="dropdown-menu">
              <button className="dropdown-item">
                <User size={16} />
                Mon profil
              </button>
              <button className="dropdown-item" onClick={signOut}>
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
