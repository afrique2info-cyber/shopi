/*
  # Initial Schema for Shopify Clone SaaS Platform
  
  1. New Tables:
    - users (platform users)
    - shops (user shops)
    - products (shop products)
    - categories (product categories)
    - orders (customer orders)
    - order_items (order line items)
    - customers (shop customers)
    - subscriptions (user subscriptions)
    - payments (payment records)
    - themes (shop themes)
    - pages (shop pages)
  
  2. Security: Enable RLS and add appropriate policies
  3. Relationships with proper foreign keys and indexes
*/

-- Users table for platform authentication
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  phone text,
  role text DEFAULT 'merchant' CHECK (role IN ('merchant', 'admin')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shops table
CREATE TABLE IF NOT EXISTS shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  logo_url text,
  favicon_url text,
  primary_color text DEFAULT '#9E7FFF',
  secondary_color text DEFAULT '#38bdf8',
  currency text DEFAULT 'XOF',
  language text DEFAULT 'fr',
  domain text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  compare_price decimal(10,2),
  cost_price decimal(10,2),
  sku text,
  barcode text,
  track_quantity boolean DEFAULT true,
  quantity integer DEFAULT 0,
  weight decimal(8,2),
  featured boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  images text[] DEFAULT '{}',
  options jsonb DEFAULT '[]',
  variants jsonb DEFAULT '[]',
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(shop_id, slug)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  image_url text,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(shop_id, slug)
);

-- Product categories junction table
CREATE TABLE IF NOT EXISTS product_categories (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  address jsonb DEFAULT '{}',
  accepts_marketing boolean DEFAULT false,
  total_spent decimal(10,2) DEFAULT 0,
  orders_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(shop_id, email)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  order_number text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total_amount decimal(10,2) NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  tax_amount decimal(10,2) DEFAULT 0,
  shipping_amount decimal(10,2) DEFAULT 0,
  currency text DEFAULT 'XOF',
  shipping_address jsonb DEFAULT '{}',
  billing_address jsonb DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  variant_id text,
  product_name text NOT NULL,
  price decimal(10,2) NOT NULL,
  quantity integer NOT NULL,
  total decimal(10,2) NOT NULL,
  options jsonb DEFAULT '{}'
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plan_id text NOT NULL,
  plan_name text NOT NULL,
  price_monthly decimal(10,2) NOT NULL,
  price_yearly decimal(10,2),
  status text DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'paused')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  transaction_id text UNIQUE,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'XOF',
  payment_method text NOT NULL CHECK (payment_method IN ('mobile_money', 'credit_card', 'bank_transfer')),
  provider text DEFAULT 'cinetpay',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Themes table
CREATE TABLE IF NOT EXISTS themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_active boolean DEFAULT false,
  styles jsonb DEFAULT '{}',
  templates jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  content jsonb DEFAULT '{}',
  seo_title text,
  seo_description text,
  is_published boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(shop_id, slug)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own data" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Merchants can manage own shops" ON shops FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Shop products are viewable by owner" ON products FOR ALL USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));
CREATE POLICY "Shop categories are viewable by owner" ON categories FOR ALL USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));
CREATE POLICY "Shop customers are viewable by owner" ON customers FOR ALL USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));
CREATE POLICY "Shop orders are viewable by owner" ON orders FOR ALL USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));
CREATE POLICY "User subscriptions are private" ON subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Shop themes are viewable by owner" ON themes FOR ALL USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));
CREATE POLICY "Shop pages are viewable by owner" ON pages FOR ALL USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

-- Public policies for customer-facing data
CREATE POLICY "Public can view published products" ON products FOR SELECT USING (status = 'active' AND shop_id IN (SELECT id FROM shops WHERE is_active = true));
CREATE POLICY "Public can view published pages" ON pages FOR SELECT USING (is_published = true AND shop_id IN (SELECT id FROM shops WHERE is_active = true));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON products(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_customers_shop_id ON customers(shop_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_shops_slug ON shops(slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
