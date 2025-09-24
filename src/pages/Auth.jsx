import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Store, Eye, EyeOff } from 'lucide-react'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signUp, signIn } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password)
      } else {
        await signUp(formData.email, formData.password, {
          fullName: formData.fullName,
          phone: formData.phone
        })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="logo">
            <Store size={32} />
            <span>ShopBuilder</span>
          </div>
          <h1>{isLogin ? 'Connexion' : 'Créer un compte'}</h1>
          <p>Plateforme e-commerce tout-en-un</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Nom complet</label>
              <input
                type="text"
                className="form-input"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer un compte')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
            <button 
              type="button" 
              className="auth-switch"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Créer un compte' : 'Se connecter'}
            </button>
          </p>
        </div>

        <div className="auth-features">
          <div className="feature-grid">
            <div className="feature">
              <h3>🚀 Création facile</h3>
              <p>Interface drag-and-drop intuitive</p>
            </div>
            <div className="feature">
              <h3>💳 Paiements sécurisés</h3>
              <p>Intégration CinetPay mobile money</p>
            </div>
            <div className="feature">
              <h3>📈 Abonnement simple</h3>
              <p>Pas de commission sur les ventes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
