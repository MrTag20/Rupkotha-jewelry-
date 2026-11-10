import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK if API key is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Local Database Setup for High-end Persistence
const DB_FILE = path.join(process.cwd(), "data", "db.json");

interface Product {
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

interface Order {
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

interface Appointment {
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

interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

interface DBStructure {
  products: Product[];
  orders: Order[];
  appointments: Appointment[];
  reviews: Review[];
  banners: { id: string; title: string; subtitle: string; image: string; active: boolean }[];
  blogs: { id: string; title: string; excerpt: string; content: string; image: string; date: string }[];
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "The Mayurika Royal Gold Choker",
    category: "Bridal Collection",
    price: 185000,
    originalPrice: 210000,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=600",
    rating: 5.0,
    reviewsCount: 24,
    material: "22k Hallmarked Yellow Gold",
    hallmark: "BIS 916 Hallmarked",
    description: "An extraordinary handcrafted collar neckpiece featuring exquisite peacock motifs, fine filigree work, and dangling gold beads. Traditional elegance for the modern Bengali bride.",
    carat: "24.5 Grams",
    stock: 5,
    badge: "Bridal Special",
    featured: true
  },
  {
    id: "p2",
    name: "Imperial Solitaire Diamond Ring",
    category: "Diamond Jewellery",
    price: 95000,
    originalPrice: 115000,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1589674781759-c21c37956a44?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    reviewsCount: 18,
    material: "18k Rose Gold with Solitaire",
    hallmark: "IGI Certified Diamond",
    description: "A brilliant-cut 0.5 carat solitaire diamond set gracefully in an 18k rose gold band with pave accents. Captures light and admiration from every angle.",
    carat: "0.50 Ct Solitaire",
    stock: 12,
    badge: "Bestseller",
    featured: true
  },
  {
    id: "p3",
    name: "Classic Dewdrop Silver Jhumkas",
    category: "Silver Jewellery",
    price: 4500,
    originalPrice: 5500,
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    reviewsCount: 42,
    material: "925 Sterling Silver",
    hallmark: "925 Stamped",
    description: "Handcrafted in pure 925 sterling silver, these ornate jhumkas showcase fine artisanal stamping, elegant pearl drops, and a modern oxidized luxury finish.",
    carat: "12.8 Grams",
    stock: 30,
    badge: "Daily Wear",
    featured: true
  },
  {
    id: "p4",
    name: "Celestial Diamond Tennis Bracelet",
    category: "Diamond Jewellery",
    price: 240000,
    originalPrice: 280000,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
    rating: 5.0,
    reviewsCount: 9,
    material: "18k White Gold with Diamonds",
    hallmark: "SGL Certified",
    description: "An elegant continuous line of brilliant-cut certified diamonds, perfectly matched in cut, color, and clarity, set in an 18k white gold tennis setting.",
    carat: "3.20 Ct Total",
    stock: 3,
    badge: "Exquisite",
    featured: true
  },
  {
    id: "p5",
    name: "Anjali Gold Polki Bangle",
    category: "Gold Jewellery",
    price: 132000,
    originalPrice: 145000,
    image: "https://images.unsplash.com/photo-1611085583191-a3b1a3a35d41?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
    rating: 4.7,
    reviewsCount: 15,
    material: "22k Gold with Kundan Polki",
    hallmark: "BIS 916 Gold",
    description: "An authentic Polki kundan bangle handcrafted in 22k gold, showcasing intricate meenakari painting on the inner rim and uncut diamonds on the exterior.",
    carat: "18.2 Grams",
    stock: 7,
    badge: "Bridal Special",
    featured: false
  },
  {
    id: "p6",
    name: "Minimalist Eternity Band Ring",
    category: "Daily Wear",
    price: 18500,
    originalPrice: 22000,
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    reviewsCount: 56,
    material: "18k Yellow Gold with Pave Diamonds",
    hallmark: "IGI Certified",
    description: "A continuous loop of delicate, hand-set round diamonds. Perfect for stacking or wearing on its own as a subtle token of luxury for everyday wear.",
    carat: "0.15 Ct Total",
    stock: 25,
    badge: "Daily Wear",
    featured: false
  },
  {
    id: "p7",
    name: "Aparajita Kundan Maang Tikka",
    category: "Wedding Collection",
    price: 29500,
    originalPrice: 35000,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    reviewsCount: 12,
    material: "22k Gold Plated Silver with Semi-Precious Stones",
    hallmark: "BIS Hallmarked Plating",
    description: "A striking bridal forehead ornament meticulously detailed with kundan stones, green enamel highlights, and cascading seed pearl clusters.",
    carat: "15.5 Grams",
    stock: 10,
    badge: "Exclusive",
    featured: false
  },
  {
    id: "p8",
    name: "Shishu Lalima Gold Anklet",
    category: "Kids Jewellery",
    price: 15900,
    originalPrice: 18000,
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=600",
    rating: 4.6,
    reviewsCount: 19,
    material: "18k Safe Kid Gold",
    hallmark: "BIS 750 Stamped",
    description: "A lightweight, smooth, and allergen-free chain-link anklet crafted in pure 18k yellow gold with tiny polished bell charms that jingle softly.",
    carat: "3.5 Grams",
    stock: 15,
    badge: "Kids Special",
    featured: false
  }
];

const DEFAULT_BANNERS = [
  {
    id: "b1",
    title: "Every Jewel Tells a Story",
    subtitle: "Rupkotha's Signature Bridal & Diamond Curation — Crafting luxury traditions in Sonarpur since generations.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=1920",
    active: true
  },
  {
    id: "b2",
    title: "A Tapestry of Eternal Glow",
    subtitle: "Discover our hallmark 22k Gold necklaces and certified brilliant Solitaires, sculpted to perfection.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1920",
    active: true
  }
];

const DEFAULT_BLOGS = [
  {
    id: "bl1",
    title: "The Heritage of Bengali Jewellery Craftsmanship",
    excerpt: "Explore the fascinating history of Nakashi and filigree gold jewelry from West Bengal.",
    content: "Bengali jewellery is world-renowned for its unmatched intricacy and lightweight bulkiness. Craftsmen (Swarnakars) in cities like Kolkata and districts like Sonarpur have carried the delicate secrets of gold filigree, Nakashi, and Chila work for centuries. This post takes you inside our local Sonarpur atelier where sheets of gold are hammered into thin-as-paper luxury ornaments.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800",
    date: "June 15, 2026"
  },
  {
    id: "bl2",
    title: "Understanding Diamond Certifications: IGI, GIA & SGL",
    excerpt: "Your essential guide to buying certified diamonds with absolute confidence.",
    content: "When investing in a diamond, trust is as important as the carat size. At Rupkotha, we believe in complete transparency. Learn how the 4Cs (Cut, Clarity, Color, and Carat) are evaluated by standard international labs like GIA, IGI, and SGL, and why you should always look for a laser-inscribed girdle serial number.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
    date: "May 28, 2026"
  }
];

// Load or seed database
function getDB(): DBStructure {
  try {
    if (!fs.existsSync(path.dirname(DB_FILE))) {
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Database read error, using defaults:", error);
  }

  const initialDB: DBStructure = {
    products: DEFAULT_PRODUCTS,
    orders: [],
    appointments: [],
    reviews: [],
    banners: DEFAULT_BANNERS,
    blogs: DEFAULT_BLOGS,
  };
  saveDB(initialDB);
  return initialDB;
}

function saveDB(db: DBStructure) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Database save error:", error);
  }
}

// REST API Endpoints
// Products API
app.get("/api/products", (req, res) => {
  const db = getDB();
  const category = req.query.category as string;
  if (category) {
    const filtered = db.products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    return res.json(filtered);
  }
  res.json(db.products);
});

app.get("/api/products/:id", (req, res) => {
  const db = getDB();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

app.post("/api/products", (req, res) => {
  const db = getDB();
  const newProduct: Product = {
    id: `p-${Date.now()}`,
    ...req.body,
    rating: req.body.rating || 5.0,
    reviewsCount: req.body.reviewsCount || 0,
    stock: req.body.stock || 10
  };
  db.products.push(newProduct);
  saveDB(db);
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const db = getDB();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });

  db.products[index] = { ...db.products[index], ...req.body };
  saveDB(db);
  res.json(db.products[index]);
});

app.delete("/api/products/:id", (req, res) => {
  const db = getDB();
  const filtered = db.products.filter(p => p.id !== req.params.id);
  if (filtered.length === db.products.length) return res.status(404).json({ error: "Product not found" });
  db.products = filtered;
  saveDB(db);
  res.json({ message: "Product deleted successfully" });
});

// Orders API
app.get("/api/orders", (req, res) => {
  const db = getDB();
  res.json(db.orders);
});

app.post("/api/orders", (req, res) => {
  const db = getDB();
  const { customerName, customerEmail, customerPhone, shippingAddress, items, totalAmount } = req.body;

  if (!customerName || !customerEmail || !customerPhone || !items || items.length === 0) {
    return res.status(400).json({ error: "Incomplete order details" });
  }

  const newOrder: Order = {
    id: `R-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    items,
    totalAmount,
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  // Adjust stock
  items.forEach((item: any) => {
    const prod = db.products.find(p => p.id === item.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  });

  db.orders.push(newOrder);
  saveDB(db);
  res.status(201).json(newOrder);
});

app.put("/api/orders/:id", (req, res) => {
  const db = getDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });

  order.status = req.body.status;
  saveDB(db);
  res.json(order);
});

// Appointments API
app.get("/api/appointments", (req, res) => {
  const db = getDB();
  res.json(db.appointments);
});

app.post("/api/appointments", (req, res) => {
  const db = getDB();
  const { name, email, phone, date, time, collectionOfInterest, message } = req.body;

  if (!name || !email || !phone || !date || !time) {
    return res.status(400).json({ error: "Missing required fields for appointment" });
  }

  const newAppointment: Appointment = {
    id: `R-APT-${Math.floor(10000 + Math.random() * 90000)}`,
    name,
    email,
    phone,
    date,
    time,
    collectionOfInterest: collectionOfInterest || "General Curation",
    message,
    status: "Scheduled",
    createdAt: new Date().toISOString()
  };

  db.appointments.push(newAppointment);
  saveDB(db);
  res.status(201).json(newAppointment);
});

app.put("/api/appointments/:id", (req, res) => {
  const db = getDB();
  const apt = db.appointments.find(a => a.id === req.params.id);
  if (!apt) return res.status(404).json({ error: "Appointment not found" });

  apt.status = req.body.status;
  saveDB(db);
  res.json(apt);
});

// Reviews API
app.get("/api/reviews", (req, res) => {
  const db = getDB();
  const { productId } = req.query;
  if (productId) {
    return res.json(db.reviews.filter(r => r.productId === productId));
  }
  res.json(db.reviews);
});

app.post("/api/reviews", (req, res) => {
  const db = getDB();
  const { productId, customerName, rating, comment } = req.body;

  if (!productId || !customerName || !rating || !comment) {
    return res.status(400).json({ error: "Incomplete review data" });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    productId,
    customerName,
    rating,
    comment,
    verified: true,
    createdAt: new Date().toLocaleDateString()
  };

  db.reviews.push(newReview);

  // Update product's reviews stats
  const prod = db.products.find(p => p.id === productId);
  if (prod) {
    const prodReviews = db.reviews.filter(r => r.productId === productId);
    const avgRating = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    prod.rating = parseFloat(avgRating.toFixed(1));
    prod.reviewsCount = prodReviews.length;
  }

  saveDB(db);
  res.status(201).json(newReview);
});

// AI Jewelry Advisor (Gemini integration)
app.post("/api/gemini/consult", async (req, res) => {
  const { prompt, type, currentProduct } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  if (!ai) {
    return res.json({
      reply: `🌟 *The Spirit of RUPKOTHA* 🌟

Thank you for reaching out to RUPKOTHA! I am your virtual Royal Jewelry Consultant.

Since the showroom's server is running in standalone mode (no Gemini API Key configured in your Secrets panel), let me share our signature style philosophy:

1. **The Bridal Charm:** Traditional Bengali bridal jewelry values Nakashi (exquisite gold carving) and Polki work. We recommend pairing your heavy silk Benarasi saree with our handcrafted peacock-themed Mayurika Gold Choker.
2. **Everyday Luxury:** For modern office-wear and simple celebrations, opt for sterling silver Dewdrop Jhumkas or a minimal Diamond Stackable Eternity Band.
3. **The Gifting Rule:** When in doubt, a Diamond Tennis Bracelet is a flawless heirloom that represents eternal devotion.

_Please configure a **GEMINI_API_KEY** in your Settings panel to enable real-time personalized AI styling advice._`
    });
  }

  try {
    let systemInstruction = "You are a senior luxury jewelry stylist and cultural heritage expert at RUPKOTHA, an elite jewelry showroom in Sonarpur, West Bengal. Your tone is incredibly elegant, sophisticated, warm, and poetic ('Every Jewel Tells a Story'). You provide impeccable styling suggestions, explain the cultural craftsmanship (like Nakashi filigree gold, Polki Kundan, or sterling silver work), and highlight West Bengal's royal heritage. Use beautiful typography layout like elegant paragraphs, lists, and bold headers. Speak to the customer with absolute class.";

    if (type === "story" && currentProduct) {
      systemInstruction += " Specifically, generate a beautiful, poetic heirloom story for the jewelry piece requested. Detail the craft, the heritage of West Bengal, and why this piece is a treasure.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "AI consultant failed to load. Please check API key setup." });
  }
});

// Stats API for Admin Panel
app.get("/api/stats", (req, res) => {
  const db = getDB();
  const sales = db.orders.filter(o => o.status !== "Cancelled").reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter(o => o.status === "Pending").length;
  const totalAppointments = db.appointments.length;
  const scheduledAppointments = db.appointments.filter(a => a.status === "Scheduled").length;
  const totalCustomers = new Set(db.orders.map(o => o.customerEmail)).size;

  res.json({
    sales,
    totalOrders,
    pendingOrders,
    totalAppointments,
    scheduledAppointments,
    totalCustomers,
    productsCount: db.products.length
  });
});

// Setup dev/production environments
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
