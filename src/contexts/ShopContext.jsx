import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const ShopContext = createContext()

export const useShop = () => {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider')
  }
  return context
}

export const ShopProvider = ({ children }) => {
  const { user, supabase } = useAuth()
  const [currentShop, setCurrentShop] = useState(null)
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadShops()
    } else {
      setShops([])
      setCurrentShop(null)
      setLoading(false)
    }
  }, [user])

  const loadShops = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setShops(data || [])
      if (data && data.length > 0 && !currentShop) {
        setCurrentShop(data[0])
      }
    } catch (error) {
      console.error('Error loading shops:', error)
    } finally {
      setLoading(false)
    }
  }

  const createShop = async (shopData) => {
    const { data, error } = await supabase
      .from('shops')
      .insert([
        {
          ...shopData,
          user_id: user.id,
        }
      ])
      .select()
      .single()

    if (error) throw error

    setShops(prev => [data, ...prev])
    setCurrentShop(data)
    return data
  }

  const updateShop = async (shopId, updates) => {
    const { data, error } = await supabase
      .from('shops')
      .update(updates)
      .eq('id', shopId)
      .select()
      .single()

    if (error) throw error

    setShops(prev => prev.map(shop => 
      shop.id === shopId ? data : shop
    ))
    if (currentShop?.id === shopId) {
      setCurrentShop(data)
    }

    return data
  }

  const selectShop = (shop) => {
    setCurrentShop(shop)
  }

  const value = {
    currentShop,
    shops,
    loading,
    createShop,
    updateShop,
    selectShop,
    loadShops,
  }

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
}
