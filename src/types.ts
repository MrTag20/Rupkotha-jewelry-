export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  hoverImage: string;
  rating: number;
  reviewsCount: number;
  material: string;
  hallmark: string;
  description: string;
  carat?: string;
  stock: number;
  badge?: string;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: { productId: string; name: string; price: number; quantity: number; image: string }[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  collectionOfInterest: string;
  message?: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
}

export interface DashboardStats {
  sales: number;
  totalOrders: number;
  pendingOrders: number;
  totalAppointments: number;
  scheduledAppointments: number;
  totalCustomers: number;
  productsCount: number;
}
