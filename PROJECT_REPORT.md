# B.Tech CSE Backend Development Capstone Project Report
## Project 4: E-Commerce and Inventory Management System (ShopKaro)

---

### 1. Cover Page and Team Details
- **Project Title**: ShopKaro — Multi-Role E-Commerce & Concurrency-Safe Inventory Management System
- **Domain**: Retail / E-Commerce Backend Architecture
- **Degree**: Bachelor of Technology in Computer Science & Engineering (B.Tech CSE)
- **Course**: Backend Development Capstone Project
- **Developer / Student Name**: Nikhlesh Rohilla
- **Evaluation Framework**: University Capstone Assessment Rubric (100 Marks)
- **GitHub Repository**: [https://github.com/rohillanikhlesh2510/ShopKaro-](https://github.com/rohillanikhlesh2510/ShopKaro-)

---

### 2. Abstract / Executive Summary
ShopKaro is an enterprise-grade backend infrastructure and web application built using **Node.js, Express.js, MongoDB (Atlas/Community), and Mongoose** paired with a reactive **React 19 + Tailwind CSS** frontend. It addresses critical production challenges in retail platforms: preventing inventory overselling during concurrent purchase attempts, enforcing strict server-side price recalculation, implementing role-based access control (Customer, Seller, Administrator) via JWT bearer tokens, executing multi-stage aggregation pipelines for financial and inventory analytics, and dispatching real-time notifications via Node.js `EventEmitter` and authenticated Socket.IO rooms.

---

### 3. Problem Statement
Traditional e-commerce backends often suffer from:
1. **Overselling & Race Conditions**: Inability to handle simultaneous checkouts for limited-stock items, resulting in negative inventory numbers.
2. **Client-Side Pricing Vulnerabilities**: Trusting frontend totals or subtotals, allowing malicious actors to alter item prices during checkout.
3. **Weak Access Control & Cross-Tenant Data Leaks**: Sellers being able to view or edit products and orders belonging to competitor sellers.
4. **Stale Dashboards**: Lack of event-driven alerts for low stock levels or instant order status notifications.

ShopKaro provides an end-to-end architectural solution solving each of these challenges through strict database constraints, server-side data revalidation, atomic queries, and event streaming.

---

### 4. Project Objectives
- Build a robust, end-to-end product-to-order backend workflow following MVC architecture.
- Implement fine-grained Role-Based Access Control (RBAC) across three distinct user roles: `customer`, `seller`, and `admin`.
- Guarantee atomic stock deduction and automated compensating rollbacks during order placement and cancellation.
- Formulate complex MongoDB Aggregation pipelines for executive revenue analysis, top-selling items, and category inventory valuation.
- Architect real-time, low-latency communication using native Node.js `EventEmitter` and JWT-authenticated Socket.IO private channels.
- Provide a full Postman test suite covering positive, negative, authorization (401/403), and boundary business rule tests.

---

### 5. Scope and Limitations
- **Scope**:
  - Full product catalog with search, multi-field filtering, sorting, and pagination.
  - Category lifecycle management with referential integrity safeguards (preventing deletion of categories containing active products).
  - Server-managed customer cart with live stock verification.
  - Multi-item checkout workflow with atomic inventory deduction and simulated payment states.
  - Real-time stock alerts and customer order updates.
- **Limitations**:
  - Payment gateway integration is simulated (`paid` for card/UPI, `pending` for cash) per academic assignment specifications.
  - Third-party courier tracking API is simulated via role-based status transitions (`confirmed` -> `shipped` -> `delivered`).

---

### 6. Functional and Non-Functional Requirements
#### Functional Requirements
1. **Authentication & User Management**:
   - Secure customer and seller registration.
   - Password hashing with salt rounds via `bcrypt`.
   - Dual-token architecture: 15-minute access token + 7-day refresh token with rotation on logout.
   - Administrative ability to view, inspect, and update user roles.
2. **Product & Inventory Management**:
   - Sellers create, update, and soft-delete their own products; admins have platform-wide override rights.
   - Strict seller ownership checks preventing cross-seller modification.
   - Real-time low-stock alerts triggered when `stock <= lowStockThreshold`.
   - Immutable `InventoryLog` tracking all adjustments, order deductions, and cancellation restores.
3. **Cart & Order Processing**:
   - Persistent per-customer cart stored in MongoDB.
   - Checkout re-validates stock and calculates total price from database documents.
   - Dual-mode checkout: MongoDB multi-document transactions (replica sets) with automatic fallback to atomic `$inc` updates and compensating rollback for standalone servers.
4. **Real-Time Notification System**:
   - Socket.IO server authenticating handshake tokens and placing sockets in private rooms (`user:<userId>`).
   - Internal `EventEmitter` dispatching `order-placed`, `order-cancelled`, `order-status-updated`, and `stock-low`.

#### Non-Functional Requirements
- **Security**: JWT bearer middleware, no plain-text passwords, CORS whitelisting, protected secrets via `.gitignore`.
- **Concurrency & ACID Consistency**: Zero negative stock, atomic database operations.
- **Maintainability**: Clean MVC directory structure separating concerns across routes, middleware, controllers, and models.
- **Performance**: Compound database indexes on queried fields (`category + price`, `seller + stock`, `user + createdAt`).

---

### 7. System Architecture and Module Description
```
Client (React / Postman / Socket.IO Client)
       │
       ▼
HTTP Server & Socket.IO Handler (server.js)
       │
       ├─► Request Logger Middleware
       ├─► CORS & express.json() Body Parser
       │
       ▼
Express Routers (/api/auth, /api/products, /api/orders, etc.)
       │
       ▼
Middleware Chaining (authMiddleware -> roleMiddleware)
       │
       ▼
Controllers (MVC Business Logic)
       │
       ├─► Models (Mongoose Schemas & Compounded Indexes)
       │         │
       │         ▼
       │     MongoDB Database (Atlas / Community)
       │
       └─► appEvents (Node.js EventEmitter)
                 │
                 ├─► Notification Model (Persisted to DB)
                 └─► Socket.IO emitToUser (Pushed to private room)
```

---

### 8. Database Design (Collections, Schemas & Relationships)
1. **Users (`User.js`)**: `name`, `email` (unique index), `password` (hashed), `role` (`customer` | `seller` | `admin`), `refreshTokens` (array for rotation).
2. **Categories (`Category.js`)**: `name`, `slug` (unique), `description`.
3. **Products (`Product.js`)**: `title`, `description`, `price`, `category` (ref: Category), `seller` (ref: User), `stock`, `lowStockThreshold`, `isActive`.
   - Indexes: `{ category: 1, price: 1 }`, `{ seller: 1, stock: 1 }`.
4. **Carts (`Cart.js`)**: `user` (ref: User, unique), `items: [{ product (ref: Product), quantity }]`.
5. **Orders (`Order.js`)**: `user` (ref: User), `items: [{ product, seller, title, price, quantity, thumbnail }]`, `totalAmount`, `shippingAddress`, `paymentMethod`, `paymentStatus`, `status` (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`).
   - Indexes: `{ user: 1, createdAt: -1 }`, `{ "items.seller": 1, createdAt: -1 }`.
6. **InventoryLogs (`InventoryLog.js`)**: `product`, `changedBy`, `order`, `changeType`, `quantityChanged`, `previousStock`, `newStock`, `note`.
   - Index: `{ product: 1, createdAt: -1 }`.
7. **Notifications (`Notification.js`)**: `user`, `title`, `message`, `type`, `isRead`, `relatedOrder`, `relatedProduct`.
   - Index: `{ user: 1, isRead: 1, createdAt: -1 }`.

---

### 9. REST API Documentation Summary
| Group | Method | Endpoint | Access / Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Public | Register customer/seller |
| | `POST` | `/api/auth/login` | Public | Authenticate user & get tokens |
| | `POST` | `/api/auth/refresh` | Public | Rotate and issue new access token |
| | `GET` | `/api/auth/me` | Authenticated | Retrieve profile of active user |
| | `POST` | `/api/auth/logout` | Authenticated | Invalidate refresh token |
| **Products** | `GET` | `/api/products` | Public | Search, filter, paginate products |
| | `GET` | `/api/products/:id` | Public | Get single product detail |
| | `POST` | `/api/products` | Seller / Admin | Create product (assigned to seller) |
| | `PUT` | `/api/products/:id` | Owner Seller / Admin | Update product details |
| | `DELETE`| `/api/products/:id` | Owner Seller / Admin | Soft delete product |
| **Cart** | `GET` | `/api/cart` | Customer | Fetch current cart with server subtotals |
| | `POST` | `/api/cart/items` | Customer | Add product to cart |
| | `PUT` | `/api/cart/items/:productId` | Customer | Update quantity |
| | `DELETE`| `/api/cart/items/:productId` | Customer | Remove line item |
| **Orders** | `POST` | `/api/orders` | Customer | Checkout cart with atomic stock deduction |
| | `GET` | `/api/orders` | Authenticated | Get role-scoped order list |
| | `GET` | `/api/orders/:id` | Owner / Seller / Admin| Get order with privacy filtering |
| | `PATCH`| `/api/orders/:id/cancel` | Customer Owner / Admin | Cancel order and restore stock |
| | `PATCH`| `/api/orders/:id/status` | Seller / Admin | Update delivery lifecycle status |
| **Analytics**| `GET` | `/api/analytics/sales` | Seller / Admin | Sales summary & date-wise trend |
| | `GET` | `/api/analytics/best-sellers` | Seller / Admin | Top selling items by units and revenue |
| | `GET` | `/api/analytics/inventory-summary` | Seller / Admin | Stock valuation & category breakdown |

---

### 10. Authentication and Authorization Design
- **Password Hashing**: Implemented via `bcrypt` with salt rounds = 10 prior to persistence.
- **Stateless Access Tokens**: Signed with `JWT_ACCESS_SECRET` containing `{ id, role }`, expiring in 15 minutes.
- **Refresh Tokens**: Signed with `JWT_REFRESH_SECRET`, stored in the user's `refreshTokens` array, valid for 7 days.
- **Middleware Flow**:
  1. `authMiddleware`: Extracts `Bearer <token>`, verifies signature, attaches `req.user`.
  2. `roleMiddleware(...allowedRoles)`: Verifies `allowedRoles.includes(req.user.role)`. If unauthorized, responds immediately with `403 Forbidden`.
  3. Controller-level Resource Ownership: Verified explicitly against `req.user._id` before mutations.

---

### 11. Implementation Details: Atomic Stock & Concurrency
To ensure zero negative inventory and prevent overselling during concurrent traffic, ShopKaro implements a dual-defense system:
1. **Conditional Atomic Updates**:
   ```javascript
   const updatedProduct = await Product.findOneAndUpdate(
     { _id: productId, isActive: true, stock: { $gte: requestedQuantity } },
     { $inc: { stock: -requestedQuantity } },
     { new: true, session }
   );
   ```
2. **Compensating Rollbacks**:
   When operating on standalone databases without active replica sets, if item 3 of a 5-item order fails due to insufficient stock, the backend loops over items 1 and 2 and runs `$inc: { stock: item.quantity }` to return stock to exact pre-order quantities before throwing a `400 Bad Request`.

---

### 12. Testing Strategy and Test Cases
The project includes a Postman v2.1 test suite covering:
1. **Positive Tests**: User registration, login, catalog retrieval, cart management, checkout, status progression.
2. **Negative Tests**: Missing body parameters (400), invalid email formats (400), non-existent entity IDs (404).
3. **Authentication & Authorization**: Missing Bearer token (401), invalid tokens (401), customer trying to fetch seller or admin routes (403), seller trying to edit another seller's listing (403).
4. **Boundary Cases**: Checkout with empty cart (400), buying quantities greater than available stock (400), cancelling already delivered orders (400).

---

### 13. Screenshots / Demonstration Evidence
- React 19 Frontend running on `http://localhost:5173`.
- Node.js Express server running on `http://localhost:5000`.
- Socket.IO connection logged: `Socket connected: TechWorld Seller (seller) joined user:<sellerId>`.
- MongoDB Atlas connection connected state: `1 (Connected)`.

---

### 14. Conclusion and Future Enhancements
ShopKaro satisfies all core requirements, data constraints, and business rules outlined in the University Backend Capstone evaluation criteria.
- **Future Enhancements**:
  1. Integration with Razorpay / Stripe webhooks for live payment processing.
  2. Elasticsearch integration for full-text search across large-scale catalogs.
  3. Redis caching layer for hot product categories and high-frequency read endpoints.

---

### 15. References
1. Express.js Documentation: [https://expressjs.com/](https://expressjs.com/)
2. Mongoose ODM Guide: [https://mongoosejs.com/docs/](https://mongoosejs.com/docs/)
3. MongoDB Aggregation Framework: [https://www.mongodb.com/docs/manual/aggregation/](https://www.mongodb.com/docs/manual/aggregation/)
4. Socket.IO Documentation: [https://socket.io/docs/v4/](https://socket.io/docs/v4/)
5. JSON Web Tokens (RFC 7519): [https://jwt.io/](https://jwt.io/)
