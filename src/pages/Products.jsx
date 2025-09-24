import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, MoreVertical } from 'lucide-react'
import { useShop } from '../contexts/ShopContext'
import ProductModal from '../components/ProductModal'

const Products = () => {
  const { currentShop, supabase } = useShop()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [currentShop])

  const loadProducts = async () => {
    if (!currentShop) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', currentShop.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
          .select()
          .single()

        if (error) throw error
        setProducts(prev => prev.map(p => p.id === data.id ? data : p))
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([{ ...productData, shop_id: currentShop.id }])
          .select()
          .single()

        if (error) throw error
        setProducts(prev => [data, ...prev])
      }

      setShowModal(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleDelete = async (productId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error
      setProducts(prev => prev.filter(p => p.id !== productId))
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1>Produits</h1>
          <p>Gérez votre catalogue de produits</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Ajouter un produit
        </button>
      </div>

      {/* Filters and Search */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un produit..." 
            className="search-input"
          />
        </div>
        <div className="filter-actions">
          <button className="btn btn-outline">
            <Filter size={16} />
            Filtrer
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg'
                  }}
                />
              ) : (
                <div className="image-placeholder">
                  <Package size={48} />
                </div>
              )}
            </div>
            
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-price">{Number(product.price).toLocaleString()} XOF</p>
              <div className="product-meta">
                <span>Stock: {product.quantity}</span>
                <span className={`status ${product.status}`}>
                  {product.status === 'active' ? 'Actif' : 'Brouillon'}
                </span>
              </div>
            </div>

            <div className="product-actions">
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => handleEdit(product)}
              >
                Modifier
              </button>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => handleDelete(product.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowModal(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}

export default Products
