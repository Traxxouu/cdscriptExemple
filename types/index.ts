export interface Product {
  id: string;
  name: string;
  description: string;
  short_description: string;
  price: number;
  monthly_price?: number;
  image_url: string;
  category: string;
  features: string[];
  file_url: string;
  doc_url?: string;
  stripe_price_id: string;
  stripe_subscription_price_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  stripe_session_id: string;
  stripe_subscription_id?: string;
  type: 'one_time' | 'subscription';
  status: 'active' | 'cancelled' | 'expired';
  created_at: string;
  updated_at: string;
  products?: Product;
}

export interface User {
  id: string;
  email: string;
  stripe_customer_id?: string;
  created_at: string;
}
