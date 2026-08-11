# 🍊 FruitMart — React Frontend

A complete, production-quality e-commerce frontend for a fruit marketplace built with React + Vite + Redux Toolkit + Tailwind CSS.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env .env.local
# Edit .env.local and set VITE_API_BASE_URL to your backend URL

# 3. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🗂️ Project Structure

```
src/
├── app/            # Redux store
├── components/
│   ├── ui/         # Reusable UI primitives (Button, Input, Modal…)
│   ├── shared/     # Shared feature components (Navbar, Footer, ProductCard…)
│   └── admin/      # Admin-specific components (Sidebar, StatCard)
├── features/       # Redux slices (auth, cart, products, orders, categories, ui)
├── hooks/          # Custom hooks (useAuth, useCart, useToast)
├── layouts/        # Page layouts (MainLayout, AdminLayout)
├── pages/          # Route-level page components
│   └── admin/      # Admin panel pages
├── routes/         # Route guards and AppRoutes
├── services/       # Axios API service modules
└── utils/          # Formatters, constants
```

---

## 🔌 Required Backend API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user → `{ user, token }` |
| POST | `/auth/login` | Login → `{ user, token }` |
| POST | `/auth/logout` | Logout |
| GET  | `/auth/me` | Get current user → `{ user }` |
| PUT  | `/auth/me` | Update profile → `{ user }` |
| PUT  | `/auth/change-password` | Change password |
| POST | `/auth/forgot-password` | Send reset email |
| POST | `/auth/reset-password` | Reset with token |

### Products (`/api/products`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/products` | List with query params: `page, limit, search, category, sort, minPrice, maxPrice` → `{ products, total, totalPages, page }` |
| GET  | `/products/featured` | Featured products → `{ products }` |
| GET  | `/products/:id` | Single product with reviews → `{ product }` |
| POST | `/products` | *(admin)* Create — multipart/form-data |
| PUT  | `/products/:id` | *(admin)* Update |
| DELETE | `/products/:id` | *(admin)* Delete |
| POST | `/products/:id/reviews` | Add review `{ rating, comment }` |

### Categories (`/api/categories`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/categories` | All categories → `{ categories }` |
| POST | `/categories` | *(admin)* Create |
| PUT  | `/categories/:id` | *(admin)* Update |
| DELETE | `/categories/:id` | *(admin)* Delete |

### Orders (`/api/orders`, `/api/admin/orders`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/orders` | My orders → `{ orders, total, totalPages }` |
| GET  | `/orders/:id` | Single order → `{ order }` |
| POST | `/orders` | Place order → `{ order }` |
| PUT  | `/orders/:id/cancel` | Cancel order |
| GET  | `/admin/orders` | *(admin)* All orders |
| PUT  | `/admin/orders/:id/status` | *(admin)* Update status `{ status }` |

### Users/Admin (`/api/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/admin/users` | All users `?page&limit&search` → `{ users, total, totalPages }` |
| PUT  | `/admin/users/:id` | Update user `{ role, isActive }` |
| DELETE | `/admin/users/:id` | Delete user |
| GET  | `/admin/stats` | Dashboard stats → `{ stats: { totalUsers, totalOrders, totalRevenue, totalProducts } }` |

---

## 🌐 Environment Variables

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=FruitMart
```

---

## 🛡️ Route Protection

- **Public routes**: `/`, `/shop`, `/products/:id`, `/login`, `/register`, `/forgot-password`
- **Protected (user)**: `/checkout`, `/order-success`, `/profile`, `/orders`
- **Admin only**: `/admin/*` — requires `role === 'admin'`

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Brand green | `#1B4332` |
| Cream bg | `#FEFCE8` |
| Accent amber | `#F59E0B` |
| Font | Inter |

---

## 📦 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + Vite | UI framework + build tool |
| React Router DOM v6 | Client-side routing |
| Redux Toolkit | State management |
| Axios | HTTP client + interceptors |
| Tailwind CSS v3 | Utility-first styling |
| react-hot-toast | Toast notifications |
| lucide-react | Icon library |

---

## 🚀 Build for Production

```bash
npm run build
# Output → dist/
```
