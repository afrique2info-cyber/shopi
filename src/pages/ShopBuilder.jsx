import React, { useEffect, useRef } from 'react'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import gjsPresetWebpage from 'grapesjs-preset-webpage'
import { useShop } from '../contexts/ShopContext'

const ShopBuilder = () => {
  const editorRef = useRef(null)
  const { currentShop } = useShop()

  useEffect(() => {
    if (!editorRef.current) return

    const editor = grapesjs.init({
      container: editorRef.current,
      plugins: [gjsPresetWebpage],
      pluginsOpts: {
        gjsPresetWebpage: {}
      },
      storageManager: {
        type: 'none' // We'll implement custom storage with Supabase
      },
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ]
      },
      styleManager: {
        sectors: [{
          name: 'General',
          properties: [
            {
              type: 'select',
              property: 'display',
              defaults: 'block',
              list: [
                { value: 'block', name: 'Block' },
                { value: 'inline', name: 'Inline' },
                { value: 'inline-block', name: 'Inline Block' },
                { value: 'none', name: 'None' },
              ],
            },
            { property: 'float', type: 'radio', defaults: 'none', list: [
                { value: 'none', name: 'None' },
                { value: 'left', name: 'Left' },
                { value: 'right', name: 'Right' },
              ],
            },
            { property: 'width' },
            { property: 'height' },
            { property: 'max-width' },
            { property: 'min-height' },
            { property: 'margin', properties: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left']},
            { property: 'padding', properties: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left']},
          ],
        },{
          name: 'Typography',
          properties: [
            { property: 'font-family' },
            { property: 'font-size' },
            { property: 'font-weight' },
            { property: 'letter-spacing' },
            { property: 'color' },
            { property: 'line-height' },
            { property: 'text-align' },
            { property: 'text-shadow' },
          ],
        },{
          name: 'Decorations',
          properties: [
            { property: 'background-color' },
            { property: 'background' },
            { property: 'box-shadow' },
            { property:border-radius' },
            { property: 'border', properties: ['border-width', 'border-style', 'border-color']},
            { property: 'opacity' },
          ],
        },{
          name: 'Extra',
          properties: [
            { property: 'transition' },
            { property: 'perspective' },
            { property: 'transform' },
          ],
        }]
      }
    })

    // Load shop-specific styling
    if (currentShop) {
      editor.setStyle(`
        :root {
          --primary: ${currentShop.primary_color || '#9E7FFF'};
          --secondary: ${currentShop.secondary_color || '#38bdf8'};
          --background: #ffffff;
          --text: #171717;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          color: var(--text);
          line-height: 1.6;
        }
        
        .btn-primary {
          background: var(--primary);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          display: inline-block;
        }
      `)
    }

    // Add custom blocks for e-commerce
    editor.BlockManager.add('product-grid', {
      label: 'Grille Produits',
      content: `
        <div class="products-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 40px 0;">
          <div class="product-card" style="border: 1px solid #e5e5e5; border-radius: 12px; padding: 20px; text-align: center;">
            <img src="https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg" alt="Product" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="margin: 10px 0; font-size: 18px;">Nom du produit</h3>
            <p style="color: #666; margin-bottom: 15px;">Description courte du produit</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 20px; font-weight: bold; color: var(--primary);">25,000 XOF</span>
              <button class="btn-primary">Ajouter au panier</button>
            </div>
          </div>
        </div>
      `
    })

    editor.BlockManager.add('hero-section', {
      label: 'Section Hero',
      content: `
        <section style="background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 100px 0; text-align: center;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h1 style="font-size: 48px; margin-bottom: 20px;">Titre principal de votre boutique</h1>
            <p style="font-size: 20px; margin-bottom: 30px; opacity: 0.9;">Description captivante de votre entreprise et de vos produits</p>
            <a href="#" class="btn-primary" style="background: white; color: var(--primary);">Découvrir nos produits</a>
          </div>
        </section>
      `
    })

    return () => {
      editor.destroy()
    }
  }, [currentShop])

  return (
    <div className="shop-builder">
      <div className="builder-header">
        <h1>Constructeur de boutique</h1>
        <p>Créez votre site en glisser-déposer</p>
        <div className="builder-actions">
          <button className="btn btn-primary">Sauvegarder</button>
          <button className="btn btn-outline">Aperçu</button>
          <button className="btn btn-outline">Publier</button>
        </div>
      </div>
      
      <div ref={editorRef} style={{ height: 'calc(100vh - 200px)' }} />
    </div>
  )
}

export default ShopBuilder
