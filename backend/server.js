import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'

const app = express()
const PORT = process.env.PORT || 5000

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

app.use(cors())
app.use(express.json())

// CinetPay Webhook Handler
app.post('/api/webhooks/cinetpay', async (req, res) => {
  try {
    const { transaction_id, amount, currency, status, metadata } = req.body

    if (status === 'ACCEPTED') {
      // Update order status
      const { error } = await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('transaction_id', transaction_id)

      if (error) throw error

      // Update order status to paid
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', metadata.order_id)
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

// Payment initialization
app.post('/api/payments/initiate', async (req, res) => {
  try {
    const { order_id, amount, customer_email, customer_name } = req.body

    // Create payment record
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([{
        order_id,
        amount,
        currency: 'XOF',
        payment_method: 'mobile_money',
        status: 'pending',
        metadata: { customer_email, customer_name }
      }])
      .select()
      .single()

    if (error) throw error

    // Simulate CinetPay API call
    const transaction_id = `cp_${Date.now()}`
    
    // In production, you would call CinetPay API here
    const paymentUrl = `https://api.cinetpay.com/v2/payment?transaction_id=${transaction_id}&amount=${amount}`

    res.json({
      payment_id: payment.id,
      transaction_id,
      payment_url: paymentUrl,
      success: true
    })
  } catch (error) {
    console.error('Payment initiation error:', error)
    res.status(500).json({ error: 'Payment initiation failed' })
  }
})

// Subscription management
app.post('/api/subscriptions/create', async (req, res) => {
  try {
    const { user_id, plan_id, plan_name, price_monthly, interval } = req.body

    const period_start = new Date()
    const period_end = new Date()
    period_end.setMonth(period_end.getMonth() + (interval === 'year' ? 12 : 1))

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert([{
        user_id,
        plan_id,
        plan_name,
        price_monthly,
        price_yearly: interval === 'year' ? price_monthly * 12 : null,
        current_period_start: period_start,
        current_period_end: period_end,
        status: 'active'
      }])
      .select()
      .single()

    if (error) throw error

    res.json({ subscription, success: true })
  } catch (error) {
    console.error('Subscription creation error:', error)
    res.status(500).json({ error: 'Subscription creation failed' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
