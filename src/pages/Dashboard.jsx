import React from 'react'
import { useShop } from '../contexts/ShopContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react'

const Dashboard = () => {
  const { currentShop } = useShop()

  // Mock data for dashboard
  const stats = [
    { label: 'Produits', value: '24', icon: Package, change: '+12%' },
    { label: 'Commandes', value: '156', icon: ShoppingCart, change: '+23%' },
    { label: 'Clients', value: '89', icon: Users, change: '+8%' },
    { label: 'Revenus', value: '1.2M XOF', icon: DollarSign, change: '+15%' },
  ]

  const salesData = [
    { month: 'Jan', sales: 400000 },
    { month: 'Fév', sales: 300000 },
    { month: 'Mar', sales: 600000 },
    { month: 'Avr', sales: 800000 },
    { month: 'Mai', sales: 500000 },
    { month: 'Jun', sales: 700000 },
  ]

  const recentOrders = [
    { id: 1, customer: 'Jean Dupont', amount: '45,000 XOF', status: 'Livré' },
    { id: 2, customer: 'Marie Koné', amount: '120,000 XOF', status: 'En cours' },
    { id: 3, customer: 'Paul Traoré', amount: '89,000 XOF', status: 'Payé' },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p>Bienvenue dans votre espace de gestion</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <span className="text-sm text-green-400">{stat.change}</span>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <stat.icon className="text-primary" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Ventes mensuelles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                formatter={(value) => [`${value} XOF`, 'Ventes']}
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              />
              <Bar dataKey="sales" fill="#9E7FFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Commandes récentes</h3>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="font-medium">{order.customer}</p>
                  <p className="text-sm text-gray-400">{order.amount}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'Livré' ? 'bg-green-500/20 text-green-400' :
                  order.status === 'En cours' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
