import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  CreditCard
} from 'lucide-react'
import { useShop } from '../contexts/ShopContext'

const Sidebar = () => {
  const { currentShop } = useShop()

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/builder', icon: Store, label: 'Constructeur' },
    { path: '/products', icon: Package, label: 'Produits' },
    { path: '/orders', icon: ShoppingCart, label: 'Commandes' },
    { path: '/customers', icon: Users, label: 'Clients' },
    { path: '/analytics', icon: BarChart3, label: 'Analytiques' },
    { path: '/subscription', icon: CreditCard, label: 'Abonnement' },
    { path: '/settings', icon: Settings, label: 'Paramètres' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="shop-info">
          <div className="shop-avatar">
            {currentShop?.name?.charAt(0) || 'S'}
          </div>
          <div className="shop-details">
            <h3>{currentShop?.name || 'Ma Boutique'}</h3>
            <span className="shop-status">Active</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="subscription-status">
          <div className="status-dot"></div>
          <span>Abonnement Actif</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
