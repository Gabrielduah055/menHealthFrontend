# HealthPulse — Admin Dashboard (mensHealthFrontend)

> A full-featured **Angular 19** admin dashboard for the HealthPulse men's health platform. Provides administrators with complete control over blog content, products, orders, customers, and comments — all in a clean, responsive interface styled with **Tailwind CSS v4**.

**Backend API:** [https://menhealthbackend.onrender.com](https://menhealthbackend.onrender.com)  
**Public Frontend:** [https://men-health-mu.vercel.app](https://men-health-mu.vercel.app)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Routes & Pages](#routes--pages)
- [Core Architecture](#core-architecture)
  - [Auth Guard](#auth-guard)
  - [HTTP Interceptor](#http-interceptor)
  - [Services](#services)
- [Authentication Flow](#authentication-flow)
- [Blog Management](#blog-management)
- [Product Management](#product-management)
- [Order Management](#order-management)
- [Comment Moderation](#comment-moderation)
- [Planned Advanced Features](#planned-advanced-features)
- [Testing](#testing)
- [Build & Deployment](#build--deployment)
- [Contributing](#contributing)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 19 (standalone components) |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS v4 + PostCSS |
| Rich Text Editor | Quill 2 via `ngx-quill` + `quill-blot-formatter` |
| HTTP | Angular `HttpClient` with functional interceptors |
| Routing | Angular Router with `canActivate` guards |
| Reactivity | RxJS 7.8 (`BehaviorSubject`, `Observable`) |
| Auth Storage | `sessionStorage` |
| Testing | Karma + Jasmine |
| Build Tool | Angular CLI 19 |

---

## Features

### Authentication
- **Admin-only login** — JWT-based session stored in `sessionStorage`
- **Route guard** — all dashboard routes protected by `authGuard`; unauthenticated users redirected to `/admin/login`
- **HTTP interceptor** — automatically attaches `Authorization: Bearer <token>` to every outgoing request
- **Logout** — clears session and redirects to login

### Dashboard
- **Stats overview** — total blogs, products, orders, and registered users in a single view
- **Quick-access cards** — navigate directly to each management section

### Blog Management
- **List all posts** — view all blogs including drafts, with status, category, date, and view count
- **Create post** — rich Quill editor with image upload, excerpt, tags, topics, category, sections, quote, gallery, read time, featured label, and `allowComments` toggle
- **Edit post** — pre-populated form with all existing data
- **Delete post** — with confirmation
- **Publish / Draft toggle** — control post visibility on the public site
- **Cover image upload** — Cloudinary via backend multipart endpoint

### Product Management
- **List all products** — name, price, stock quantity, status, and image preview
- **Add product** — name, slug, description, price, stock, up to 4 images (Cloudinary upload)
- **Edit product** — update any field including replacing images
- **Product detail view** — full product info with image gallery
- **Delete product** — with confirmation
- **Active/Inactive toggle** — control product visibility on the public shop

### Order Management
- **List all orders** — customer name, total, status, payment reference, and date
- **Order detail view** — full breakdown of line items, customer info, payment status, and timestamps
- **Update order status** — transition orders through `pending → paid → processing → delivered`

### Customer Management
- **Customer list** — view registered users derived from order data
- **Customer detail view** — order history and contact information

### Comment Moderation
- **View all comments** — pending and approved, with commenter name, post title, excerpt, and date
- **Approve comments** — make comments visible on the public site
- **Reply to comments** — admin reply triggers an email notification to the commenter
- **Delete comments** — remove inappropriate content

---

## Project Structure

```
mensHealthFrontend/
├── src/
│   ├── main.ts                         # Angular bootstrap entry point
│   ├── index.html                      # Root HTML shell
│   ├── styles.css                      # Global styles
│   ├── environments/
│   │   ├── environment.ts              # Development config (apiUrl)
│   │   └── environment.prod.ts         # Production config
│   └── app/
│       ├── app.component.ts            # Root component
│       ├── app.config.ts               # App providers — router, HttpClient, interceptors
│       ├── app.routes.ts               # All route definitions
│       ├── admin/
│       │   └── login/                  # Admin login page (email + password form)
│       ├── layout/
│       │   └── admin-layout/           # Shell layout — sidebar nav + router outlet
│       ├── core/
│       │   ├── guards/
│       │   │   └── auth.guard.ts       # CanActivateFn — redirects to login if not authenticated
│       │   ├── interceptors/
│       │   │   └── auth.interceptor.ts # Functional interceptor — attaches Bearer token
│       │   └── services/
│       │       ├── auth.service.ts     # Login, logout, token management, BehaviorSubject
│       │       ├── blog.service.ts     # CRUD + image upload for blog posts
│       │       ├── product.service.ts  # CRUD + image upload for products
│       │       ├── order.service.ts    # List, detail, status update for orders
│       │       ├── customer.service.ts # Customer listing from order data
│       │       └── dashboard.service.ts# Aggregate stats
│       └── pages/
│           ├── dashboard/              # Stats overview page
│           ├── blogs/
│           │   ├── blogs.component.*   # Blog listing table
│           │   ├── blog-create/        # Create post form with Quill editor
│           │   └── blog-edit/          # Edit post form (pre-populated)
│           ├── products/
│           │   ├── products.component.*# Product listing table
│           │   ├── product-add/        # Add product form with image upload
│           │   ├── product-edit/       # Edit product form
│           │   └── product-details/    # Product detail view
│           ├── orders/
│           │   ├── orders.component.*  # Order listing table
│           │   └── order-details/      # Order detail view + status update
│           ├── customers/
│           │   ├── customers.component.*  # Customer listing
│           │   └── customer-details/      # Customer detail + order history
│           ├── comments/               # Comment moderation — approve, reply, delete
│           ├── links/                  # Useful links / quick access page
│           ├── logout/                 # Logout confirmation + redirect
│           └── others/                 # Miscellaneous admin utilities
├── angular.json                        # Angular workspace config
├── tailwind.config.js                  # Tailwind CSS configuration
├── tsconfig.json                       # TypeScript base config
├── tsconfig.app.json                   # App-specific TS config
├── tsconfig.spec.json                  # Test-specific TS config
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Angular CLI 19: `npm install -g @angular/cli`

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd mensHealthFrontend

# Install dependencies
npm install
```

### Development server

```bash
npm start
# or
ng serve
```

Open [http://localhost:4200](http://localhost:4200). The app hot-reloads on file changes.

---

## Environment Configuration

API URL is configured per environment in `src/environments/`:

**`environment.ts`** (development):
```ts
export const environment = {
  production: false,
  apiUrl: 'https://menhealthbackend.onrender.com/api'
};
```

**`environment.prod.ts`** (production):
```ts
export const environment = {
  production: true,
  apiUrl: 'https://menhealthbackend.onrender.com/api'
};
```

To point to a local backend during development, change `apiUrl` to `http://localhost:5000/api`.

---

## Routes & Pages

| Route | Guard | Component | Description |
|---|---|---|---|
| `/admin/login` | None | `LoginComponent` | Admin login form |
| `/dashboard` | `authGuard` | `DashboardComponent` | Stats overview |
| `/blogs` | `authGuard` | `BlogsComponent` | Blog post listing |
| `/blogs/create` | `authGuard` | `BlogCreateComponent` | Create new post |
| `/blogs/edit/:id` | `authGuard` | `BlogEditComponent` | Edit existing post |
| `/products` | `authGuard` | `ProductsComponent` | Product listing |
| `/products/add` | `authGuard` | `ProductAddComponent` | Add new product |
| `/products/edit/:id` | `authGuard` | `ProductEditComponent` | Edit product |
| `/products/:id` | `authGuard` | `ProductDetailsComponent` | Product detail view |
| `/orders` | `authGuard` | `OrdersComponent` | Order listing |
| `/orders/:id` | `authGuard` | `OrderDetailsComponent` | Order detail + status |
| `/customers` | `authGuard` | `CustomersComponent` | Customer listing |
| `/customers/:id` | `authGuard` | `CustomerDetailsComponent` | Customer detail |
| `/comments` | `authGuard` | `CommentsComponent` | Comment moderation |
| `/links` | `authGuard` | `LinksComponent` | Quick links |
| `/logout` | `authGuard` | `LogoutComponent` | Logout + redirect |
| `**` | None | — | Redirects to `/admin/login` |

All protected routes are children of `AdminLayoutComponent` (sidebar + top bar shell).

---

## Core Architecture

### Auth Guard

`src/app/core/guards/auth.guard.ts`

A functional `CanActivateFn` guard that checks `AuthService.isAuthenticated()`. If the admin session is not present in `sessionStorage`, it redirects to `/admin/login` and blocks navigation.

```ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) return true;
  router.navigate(['/admin/login']);
  return false;
};
```

### HTTP Interceptor

`src/app/core/interceptors/auth.interceptor.ts`

A functional `HttpInterceptorFn` that clones every outgoing HTTP request and attaches the `Authorization: Bearer <token>` header automatically. Registered globally in `app.config.ts` via `withInterceptors([authInterceptor])`.

```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
```

### Services

All services are `providedIn: 'root'` singletons using Angular's `HttpClient`.

| Service | Base URL | Responsibilities |
|---|---|---|
| `AuthService` | `/api/admin/auth` | Login, logout, token retrieval, `BehaviorSubject<AdminUser>` |
| `BlogService` | `/api/admin/blogs` | getBlogs, getBlog, createBlog, updateBlog, deleteBlog, incrementView |
| `ProductService` | `/api/admin/products` | getProducts, getProduct, createProduct, updateProduct, deleteProduct |
| `OrderService` | `/api/admin/orders` | getOrders, getOrder, updateOrderStatus |
| `CustomerService` | `/api/admin/orders/customers` | getCustomers |
| `DashboardService` | `/api/admin/dashboard` | getStats |

---

## Authentication Flow

1. Admin navigates to `/admin/login`
2. Submits email + password via `AuthService.login()`
3. Backend validates credentials and returns `{ _id, name, email, role, token }`
4. Token and user object stored in `sessionStorage` as `adminUser`
5. `BehaviorSubject<AdminUser>` updated — all subscribers reflect the new state
6. Router navigates to `/dashboard`
7. On every subsequent HTTP request, `authInterceptor` reads the token from `AuthService.getToken()` and attaches it as a Bearer header
8. On logout, `sessionStorage` is cleared, `BehaviorSubject` set to `null`, and router navigates to `/admin/login`

### Admin user object shape

```ts
interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  authorRole?: string;   // shown on blog posts (e.g. "Senior Editor")
  avatarLabel?: string;  // initials for avatar display
  token: string;
}
```

---

## Blog Management

The blog module uses `ngx-quill` for rich text editing with `quill-blot-formatter` for image resizing within the editor.

**Create / Edit form fields:**
- Title, Slug (auto-generated from title)
- Cover image (file upload → Cloudinary via backend)
- Excerpt
- Content (Quill rich text editor)
- Category (dropdown from API)
- Tags and Topics (comma-separated)
- Sections (title + body pairs, add/remove dynamically)
- Quote
- Gallery images
- Read time
- Featured label, `isFeatured` toggle
- `allowComments` toggle
- Status (`draft` / `published`)

**`BlogService` methods:**

```ts
getBlogs(): Observable<any[]>
getBlog(id: string): Observable<any>
createBlog(blogData: FormData): Observable<any>
updateBlog(id: string, blogData: FormData): Observable<any>
deleteBlog(id: string): Observable<any>
incrementView(id: string): Observable<any>
```

---

## Product Management

**Add / Edit form fields:**
- Name, Slug
- Description (rich text or plain)
- Price (GHS)
- Stock quantity
- Images (multi-file upload, max 4 — first image is the main display image)
- Active / Inactive toggle

**`ProductService` methods:**

```ts
getProducts(): Observable<any[]>
getProduct(id: string): Observable<any>
createProduct(productData: FormData): Observable<any>
updateProduct(id: string, productData: FormData): Observable<any>
deleteProduct(id: string): Observable<any>
```

---

## Order Management

**Order statuses:** `pending → paid → processing → delivered`

Admins can view full order details including:
- Customer name, email, phone, delivery address
- Line items with name snapshot, price snapshot, quantity, and line total
- Total amount
- Payment provider (Paystack), reference, status, and paid-at timestamp

**`OrderService` methods:**

```ts
getOrders(): Observable<any[]>
getOrder(id: string): Observable<any>
updateOrderStatus(id: string, status: string): Observable<any>
```

---

## Comment Moderation

The comments page lists all comments across all blog posts. Admins can:

- **Approve** — sets `isApproved: true`, making the comment visible on the public site
- **Reply** — submits an admin reply; backend automatically sends an email notification to the original commenter with the reply preview and a link back to the article
- **Delete** — permanently removes the comment

---

## Planned Advanced Features

### Dashboard & Analytics
- **Charts and graphs** — visual representation of orders over time, revenue trends, and top-performing blog posts using Chart.js or ngx-charts
- **Real-time stats** — WebSocket connection to push live order and comment counts without page refresh
- **Export reports** — download orders, customers, and blog stats as CSV or PDF
- **Date range filtering** — filter dashboard stats by custom date ranges

### Blog & Content
- **Scheduled publishing** — set a future `publishedAt` date; post goes live automatically
- **Post preview** — open a live preview of the post as it will appear on the public site before publishing
- **Revision history** — view and restore previous versions of a blog post
- **Bulk actions** — select multiple posts to publish, draft, or delete in one action
- **SEO fields** — meta title, meta description, and Open Graph image per post
- **Category management** — create, edit, and delete categories directly from the admin panel

### Product Management
- **Inventory alerts** — visual indicator when stock drops below a configurable threshold
- **Bulk import** — upload products via CSV file
- **Product variants** — size, colour, or type variants with individual stock tracking
- **Discount management** — create and manage promo codes with percentage or fixed discounts and expiry dates
- **Related products** — manually link related products for cross-selling

### Order & Customer Management
- **Order confirmation email** — trigger a branded confirmation email to the customer from the admin panel
- **Refund management** — initiate and track refunds via Paystack API
- **Customer profiles** — full purchase history, total spend, and account status per customer
- **Customer segmentation** — filter customers by spend, location, or registration date
- **Notes on orders** — add internal admin notes to orders for fulfilment tracking

### Comment Moderation
- **Bulk moderation** — approve or delete multiple comments at once
- **Spam filter dashboard** — view auto-flagged comments before they reach the queue
- **Comment search** — search comments by keyword, commenter name, or post title
- **Reply templates** — save and reuse common admin reply messages

### Security & Access Control
- **Role-based access control (RBAC)** — multiple admin roles (Super Admin, Editor, Support) with different permission levels
- **Admin audit log** — timestamped record of every admin action (create, update, delete) with actor identity
- **Two-factor authentication (2FA)** — TOTP via authenticator app for admin login
- **Session timeout** — auto-logout after a configurable period of inactivity
- **IP allowlist** — restrict admin panel access to specific IP addresses

### UI & Experience
- **Dark mode** — system-preference-aware theme toggle with manual override
- **Notifications panel** — in-app notification bell for new orders, pending comments, and low stock alerts
- **Keyboard shortcuts** — power-user shortcuts for common actions (new post, save, publish)
- **Drag-and-drop** — reorder blog sections, product images, and gallery items via drag-and-drop
- **Responsive mobile admin** — fully usable on tablet and mobile devices

### Performance & Reliability
- **Lazy loading** — route-level code splitting for faster initial load
- **Optimistic UI** — immediate feedback on status updates before server confirmation
- **Error boundary** — graceful error states with retry options on failed API calls
- **Offline detection** — banner notification when the admin loses internet connection

---

## Testing

Run unit tests with Karma and Jasmine:

```bash
npm test
# or
ng test
```

Tests run in Chrome (headless in CI). Coverage reports are generated in `coverage/`.

To add a new test file, create a `*.spec.ts` alongside the component or service.

---

## Build & Deployment

### Production build

```bash
npm run build
# or
ng build
```

Output is placed in `dist/mens-health-frontend/`. The build is optimised for production — tree-shaking, minification, and ahead-of-time (AOT) compilation are applied automatically.

### Serve locally from build

```bash
npx serve dist/mens-health-frontend/browser
```

### Deployment options

The compiled `dist/` folder is a static SPA and can be deployed to:
- **Netlify** — drag and drop the `dist/` folder or connect via Git
- **Vercel** — set build command to `ng build` and output directory to `dist/mens-health-frontend/browser`
- **Firebase Hosting** — `firebase deploy` after `ng build`
- **Any static host** — configure to serve `index.html` for all routes (SPA fallback)

> **Important:** Configure your host to redirect all 404s to `index.html` so Angular's client-side router handles navigation correctly.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Follow Angular style guide conventions: one component per file, `OnPush` change detection where possible, and typed service responses.

---

## License

Private — All rights reserved © 2026 HealthPulse.
