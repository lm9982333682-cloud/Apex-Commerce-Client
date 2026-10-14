# Apex Commerce — Client

React-based admin dashboard for the Apex Commerce MERN project. The current client contains authentication screens and management pages for the dashboard, products, orders, users, and the signed-in user's profile.

## Tech stack

- React 19
- Vite
- React Router
- Redux Toolkit and React Redux
- Axios
- Tailwind CSS 4
- Lucide React icons
- React Toastify

## Requirements

- Node.js (a current LTS version is recommended)
- npm
- The project backend running and connected to MongoDB

## Install and run

From the project root:

```bash
cd client
npm install
npm run dev
```

Vite normally starts the development server at `http://localhost:5173`.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Client pages and routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/register` | Register | Create a customer account |
| `/login` | Login | Sign in |
| `/` | Dashboard | Summary statistics and recent activity |
| `/products` | Products | View/manage product records |
| `/products/add` | Add Product | Add a product with images and product details |
| `/products/:id` | Product Details | View a product |
| `/products/:id/edit` | Edit Product | Edit product information |
| `/orders` | Orders | Browse and filter orders |
| `/orders/:id` | Order Details | View an order, update status, and edit admin notes |
| `/users` | Users | Browse/search users |
| `/users/:id` | User Details | View a user and manage the user's role |
| `/profile` | My Profile | View the signed-in user's profile |

Most management pages are rendered inside the dashboard layout. The client router checks whether a user is signed in; authorization for protected data/actions must also be enforced by the backend.

## API connection

The Axios client is configured in `src/services/api.js` and currently uses this base URL:

```text
http://localhost:4500/api
```

It sends credentials and attaches the Redux access token as a Bearer token when available. For local development, configure the backend to listen on port `4500`, or update the Axios base URL to match the backend. For deployment, change the hard-coded local URL to your deployed API URL and rebuild the client.

## Authentication

The client uses Redux Toolkit to store the current user and access token in application state. `AuthInitializer` initializes authentication, and the API service adds the access token to requests. The backend sets the refresh token in an HTTP-only cookie.

## Important scope note

This repository's client is primarily an **admin/management dashboard**. Although the backend supports user roles and order creation endpoints, the supplied client does not currently include a complete public storefront, shopping cart, checkout/payment UI, or a separate seller dashboard. Do not treat those as implemented client features unless they are added later.

## Production notes

- Do not commit `.env` files, credentials, or API secrets.
- Set the production API URL before building the client.
- Configure your hosting provider for a Vite single-page app so client-side routes fall back to `index.html`.
- Run `npm run build` and resolve any reported errors before deployment.
