import React, { useState, useEffect } from 'react'
import { X, Upload, Plus, Trash2 } from 'lucide-react'

const ProductModal = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compare_price: '',
    sku: '',
    quantity: 0,
    track_quantity: true,
    status: 'draft',
    images: [],
    options: []
  })

  const [newOption, setNewOption] = useState({ name: '', values: '' })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        compare_price: product.compare_price || '',
        sku: product.sku || '',
        quantity: product.quantity || 0,
        track_quantity: product.track_quantity !== false,
        status: product.status || 'draft',
        images: product.images || [],
        options: product.options || []
      })
    }
  }, [product])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => URL.createObjectURL(file))
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }))
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const addOption = () => {
    if (!newOption.name || !newOption.values) return
    
    const values = newOption.values.split(',').map(v => v.trim())
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { name: newOption.name, values }]
    }))
    setNewOption({ name: '', values: '' })
  }

  const removeOption = (index) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{product ? 'Modifier le produit' : 'Nouveau produit'}</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-section">
            <h3>Informations de base</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Nom du produit *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Prix (XOF) *</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Images du produit</h3>
            <div className="images-grid">
              {formData.images.map((image, index) => (
                <div key={index} className="image-preview">
                  <img src={image} alt={`Preview ${index}`} />
                  <button 
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <label className="image-upload">
                <Upload size={24} />
                <span>Ajouter des images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Inventaire</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">SKU</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Quantité</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Options (tailles, couleurs, etc.)</h3>
            {formData.options.map((option, index) => (
              <div key={index} className="option-item">
                <span>{option.name}: {option.values.join(', ')}</span>
                <button 
                  type="button"
                  onClick={() => removeOption(index)}
                  className="btn btn-outline btn-sm"
                >
                  Supprimer
                </button>
              </div>
            ))}
            
            <div className="add-option">
              <input
                type="text"
                placeholder="Nom de l'option (ex: Taille)"
                value={newOption.name}
                onChange={(e) => setNewOption(prev => ({ ...prev, name: e.target.value }))}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Valeurs (séparées par des virgules)"
                value={newOption.values}
                onChange={(e) => setNewOption(prev => ({ ...prev, values: e.target.value }))}
                className="form-input"
              />
              <button type="button" onClick={addOption} className="btn btn-outline">
                <Plus size={16} />
                Ajouter
              </button>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              {product ? 'Mettre à jour' : 'Créer le produit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductModal
