import React, { useState } from 'react'
import { Check, Star } from 'lucide-react'

const Subscription = () => {
  const [billingInterval, setBillingInterval] = useState('monthly')

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      priceMonthly: 15000,
      priceYearly: 150000,
      description: 'Parfait pour débuter',
      features: [
        '1 boutique en ligne',
        '50 produits maximum',
        'Support email',
        'Analytics de base',
        'Paiements CinetPay'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      priceMonthly: 30000,
      priceYearly: 300000,
      description: 'Pour les entreprises en croissance',
      features: [
        '3 boutiques en ligne',
        'Produits illimités',
        'Support prioritaire',
        'Analytics avancées',
        'Paiements CinetPay',
        'Thèmes personnalisés',
        'API d\'intégration'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      priceMonthly: 60000,
      priceYearly: 600000,
      description: 'Pour les grandes entreprises',
      features: [
        'Boutiques illimitées',
        'Produits illimités',
        'Support 24/7',
        'Analytics complètes',
        'Paiements multiples',
        'Thèmes personnalisés',
        'API avancée',
        'Formation dédiée'
      ],
      popular: false
    }
  ]

  const handleSubscribe = async (planId) => {
    const plan = plans.find(p => p.id === planId)
    const price = billingInterval === 'yearly' ? plan.priceYearly : plan.priceMonthly
    
    // Simulate payment process
    alert(`Redirection vers le paiement pour le plan ${plan.name} - ${price.toLocaleString()} XOF`)
    
    // In production, integrate with CinetPay here
  }

  return (
    <div className="subscription-page">
      <div className="page-header">
        <h1>Abonnement</h1>
        <p>Choisissez le plan qui correspond à vos besoins</p>
      </div>

      {/* Billing Toggle */}
      <div className="billing-toggle">
        <div className="toggle-container">
          <span className={billingInterval === 'monthly' ? 'active' : ''}>Mensuel</span>
          <button 
            className={`toggle-btn ${billingInterval}`}
            onClick={() => setBillingInterval(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
          >
            <div className="toggle-slider"></div>
          </button>
          <span className={billingInterval === 'yearly' ? 'active' : ''}>
            Annuel <span className="discount">-16%</span>
          </span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && (
              <div className="popular-badge">
                <Star size={16} />
                Populaire
              </div>
            )}
            
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              
              <div className="plan-price">
                <span className="amount">
                  {(billingInterval === 'yearly' ? plan.priceYearly : plan.priceMonthly).toLocaleString()} XOF
                </span>
                <span className="period">/{billingInterval === 'yearly' ? 'an' : 'mois'}</span>
              </div>
            </div>

            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <Check size={16} />
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleSubscribe(plan.id)}
            >
              Choisir ce plan
            </button>
          </div>
        ))}
      </div>

      {/* Features Comparison */}
      <div className="features-comparison">
        <h2>Comparaison complète des fonctionnalités</h2>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Fonctionnalité</th>
                <th>Starter</th>
                <th>Pro</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Boutiques en ligne</td>
                <td>1</td>
                <td>3</td>
                <td>Illimité</td>
              </tr>
              <tr>
                <td>Produits</td>
                <td>50</td>
                <td>Illimité</td>
                <td>Illimité</td>
              </tr>
              <tr>
                <td>Support</td>
                <td>Email</td>
                <td>Prioritaire</td>
                <td>24/7</td>
              </tr>
              <tr>
                <td>Thèmes personnalisés</td>
                <td>❌</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Subscription
