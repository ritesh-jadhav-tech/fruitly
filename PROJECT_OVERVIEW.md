# FruitMart - Complete Project Overview & Architecture

This document explains exactly how the FruitMart project is structured, what technologies are used, why we chose them, and where you can find specific implementations in the codebase. This is a great resource to help you and your friends understand the entire stack.

---

## 🚀 How to Run the Project Locally

FruitMart is divided into two parts: the **Frontend** (client-side) and the **Backend** (server-side/API). Both need to be running for the application to work fully.

1. **Start the Frontend:**
   - Open a terminal in the root folder (`fruitmart/`).
   - Run: `npm run dev`
   - *This starts the Vite development server, usually on `http://localhost:5173`.*

2. **Start the Backend:**
   - Open a second terminal and navigate to the backend folder (`cd backend`).
   - Run: `npm run dev` (or `npm start`)
   - *This starts the Express API server on `http://localhost:3000` or `5000`.*

---

## 🎨 1. Frontend Architecture (Client-Side)

The frontend is what the user interacts with in their browser. It is located in the root `src/` folder.

### Core Technologies Used

*   **React 18**: The core UI library used to build reusable components (Buttons, Product Cards, Navbars).
*   **Vite**: The build tool and development server. 
    *   **Why?** It is incredibly fast compared to older tools like Create React App.
    *   **Where?** [vite.config.js](file:///c:/Users/Ritesh/Documents/MCS%20Part%20l%202025/Mayu%20project/fruitmart/vite.config.js)
*   **Tailwind CSS**: A utility-first CSS framework for styling.
    *   **Why?** Allows us to style components quickly without writing external CSS files.
    *   **Where?** [tailwind.config.js](file:///c:/Users/Ritesh/Documents/MCS%20Part%20l%202025/Mayu%20project/fruitmart/tailwind.config.js)
*   **Redux Toolkit (RTK)**: Global state management.
    *   **Why?** We use it to store things like the user's cart, current authentication status, and loaded products so that any page can access this data without re-fetching it.
    *   **Where?** E.g., [src/features/products/productsSlice.js](file:///c:/Users/Ritesh/Documents/MCS%20Part%20l%202025/Mayu%20project/fruitmart/src/features/products/productsSlice.js)
*   **React Router v6**: Handles navigation between different pages.
    *   **Why?** Enables a Single Page Application (SPA) experience where the page doesn't refresh when you click links.
*   **Axios**: HTTP client for making API requests to our backend.
    *   **Why?** Easier to use than standard `fetch()`, with built-in interceptors to attach authentication tokens automatically.

### Code Example: How the Frontend gets data

When you open the Shop page, Redux triggers an Axios call to the backend.

```javascript
// File: src/services/api.js (The Axios Setup)
import axios from 'axios'
const api = axios.create({
  baseURL: 'http://localhost:3000/api' // Points to our local backend
})

// Interceptor to attach JWT token for logged-in users
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('fruitmart_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})
```

---

## ⚙️ 2. Backend Architecture (Server-Side)

The backend is our own custom REST API, responsible for business logic, security, and talking to the database. It is located entirely inside the `backend/` folder.

### Core Technologies Used

*   **Node.js & Express.js**: The web server framework.
    *   **Why?** It's lightweight, uses JavaScript (same as our frontend), and is perfect for building RESTful APIs.
    *   **Where?** The main entry point is [backend/index.js](file:///c:/Users/Ritesh/Documents/MCS%20Part%20l%202025/Mayu%20project/fruitmart/backend/index.js).
*   **JSON Web Tokens (JWT) & bcrypt**: For authentication and security.
    *   **Why?** `bcrypt` scrambles (hashes) passwords so they aren't stored as plain text. `JWT` gives the user a secure "ticket" after they log in, proving who they are on subsequent requests.
*   **Cloudinary / Multer**: For image uploads.
    *   **Why?** When a vendor uploads a product image, `multer` receives the file, and we upload it to Cloudinary (a cloud storage service) to keep our server lightweight.

### Code Example: How the Backend sends data

When the frontend asks for products, Express routes the request to our Controller, which asks Prisma for the data.

```javascript
// File: backend/Routes/Products.routes.js
import { Router } from "express";
import { getProducts } from "../Controler/Products.controler.js";

const productsRouter = Router();
productsRouter.get("/", getProducts); // When frontend calls GET /products, run getProducts()
```

```javascript
// File: backend/Controler/Products.controler.js
export async function getProducts(req, res) {
  try {
    // 1. Ask the database (via Prisma) for all products
    const products = await prisma.product.findMany();
    
    // 2. Send them back to the frontend as JSON
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}
```

---

## 🗄️ 3. Database Architecture

Our data (users, products, orders) is stored securely in a relational database.

### Core Technologies Used

*   **PostgreSQL**: A powerful, open-source relational database.
    *   **Why?** Perfect for e-commerce where data is highly structured and related (e.g., an Order belongs to a User and contains many Products).
*   **Prisma (ORM)**: Object-Relational Mapper.
    *   **Why?** Instead of writing raw SQL code (`SELECT * FROM users`), Prisma lets us interact with the database using easy-to-read JavaScript methods (`prisma.user.findMany()`).
    *   **Where?** The schema defining all our database tables is usually in `backend/prisma/schema.prisma`. 

### The Data Flow (Summary)

To understand the big picture, here is exactly what happens when a user clicks on a product:

1. **Frontend (React)**: User clicks "View Product".
2. **Frontend (Redux + Axios)**: Makes an HTTP GET request to `http://localhost:3000/products/1`.
3. **Backend (Express Route)**: Receives the request at `Products.routes.js` and passes it to `Products.controler.js`.
4. **Backend (Prisma)**: The controller runs `prisma.product.findUnique({ where: { id: 1 } })`.
5. **Database (PostgreSQL)**: Finds the product row and returns it to Prisma.
6. **Backend (Express)**: Sends the product data back to the frontend as a JSON response.
7. **Frontend (React)**: Receives the data and renders the product image, name, and price on the screen!

---

## 🔐 4. Deep Dive: APIs, Authentication & JWT

To really understand how the frontend talks to the backend securely, we need to look at our API modules and JWT authentication.

### What is an API Module? (and Why do we use it?)
In the frontend, we don't just write `fetch('http://localhost:3000/api/products')` every time we want data. Instead, we created an **API Module** (located in `src/services/api.js`).

**Why?**
1. **Centralization:** If our backend URL changes, we only have to update it in *one* file.
2. **Interceptors:** We can tell Axios to automatically attach our security token (JWT) to *every single request* we send, so we don't have to manually attach it 100 times across our code.
3. **Error Handling:** We can catch 401 (Unauthorized) errors globally and automatically log the user out if their session expires.

### What is a JWT (JSON Web Token)?
JWT is like a digital VIP wristband for a club.
1. When you go to a club (our app) for the first time, the bouncer asks for your ID (Email and Password).
2. If your ID is valid, the club gives you a **wristband (the JWT)**.
3. For the rest of the night, whenever you want to order a drink (request data like your User Profile or Orders), you just show the wristband. You don't have to show your ID again.

**Where is it?**
- In the backend, we use the `jsonwebtoken` library to create this token inside `backend/Controler/Auth.controler.js`.
- In the frontend, we save this token in the browser's `localStorage` so it survives even if you refresh the page.

### The Authentication Flow (Request & Response)

Here is exactly how a secure request happens when a user logs in:

**Step 1: The Login Request**
*   **What:** The user types their email and password and clicks Login.
*   **How:** The React frontend sends a `POST` request to `/auth/login` with the email and password.
*   **Where:** Handled by `backend/Controler/Auth.controler.js`.

**Step 2: The Backend Verifies**
*   **What:** The backend checks the database via Prisma to find the user. It uses `bcrypt` to verify the password matches.
*   **How:** If valid, the backend creates a **JWT** (a long string of encrypted characters).
*   **Response:** The backend replies with: `{ message: "Login successful", token: "eyJhbGciOiJIUzI1..." }`.

**Step 3: The Frontend Saves the Token**
*   **What:** The frontend receives the token and saves it to `localStorage`.

**Step 4: Making a Secure Request (e.g., Viewing My Orders)**
*   **What:** The user clicks "My Orders".
*   **How:** The frontend API module (`src/services/api.js`) automatically intercepts the request, grabs the token from `localStorage`, and attaches it to the request header:
    `Authorization: Bearer eyJhbGciOiJIUzI1...`
*   **Where:** The backend receives the request. A middleware function (`backend/middleware/auth.js`) looks at the token, verifies it is real, and figures out which user it belongs to.
*   **Response:** If the token is valid, the backend fetches that specific user's orders and sends them back!
