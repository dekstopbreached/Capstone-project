# Vercel Migration & Deployment Guide

This document outlines the architecture and steps required to migrate the **Capstone Project** from a local standalone Fastify server to **Vercel Serverless Functions**.

## 🏗️ Architecture Overview

The project uses a **Vite + React** frontend and a **Fastify** backend for local development. For production deployment on Vercel, the backend logic has been migrated to **Vercel Serverless Functions** to ensure scalability and cost-effectiveness.

| Environment | Frontend | Backend | API Routing |
| :--- | :--- | :--- | :--- |
| **Local (Dev)** | Vite (Port 5173) | Fastify (Port 3001) | Proxied via `vite.config.ts` |
| **Vercel (Prod)** | Static Assets | Serverless Functions (`/api/*.ts`) | Native Vercel Routing |

---

## 📂 Project Structure for Vercel

Vercel automatically detects the project type, but the following structure is critical:

- `/src`: React frontend code.
- `/api`: Serverless functions (replaces `server/index.ts` in production).
- `/api/_lib`: Shared utilities for serverless functions (e.g., database connection).
- `vercel.json`: Deployment configuration.
- `vite.config.ts`: Frontend build configuration and local proxy settings.

---

## 🗄️ Database & Data Configuration

The application now uses a hybrid approach for data to ensure maximum reliability and ease of deployment.

### 1. Product Catalog (JSON)
The product catalog is now stored in `data/products.json`. 
- **Benefits**: Products load instantly, no database connection required for the main shop page, and no seeding needed.
- **Vercel**: The JSON is bundled with your serverless functions automatically.

### 2. Checkout & OTP (MongoDB)
MongoDB is still used for the **Checkout System** to store session data and 6-digit verification codes.
- **Connection Caching**: The implementation in `api/_lib/db.ts` uses a singleton pattern to cache the connection.
- **Environment Variables**: You still need these for the checkout to work!

| Variable | Description | Example |
| :--- | :--- | :--- |
| `MONGODB_URI` | Your MongoDB connection string. | `mongodb+srv://...` |
| `MONGODB_DB` | The name of the database. | `streetwear` |

---

## 🚀 Deployment Steps

### Method 1: Vercel CLI (Recommended for Manual Deploys)
1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` to link the project and create a preview deployment.
3. Run `vercel --prod` to deploy to production.

### Method 2: GitHub Integration (Recommended for CI/CD)
1. Push your code to a GitHub repository.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
3. Click **"New Project"** and import your repository.
4. Ensure the **Framework Preset** is set to **Vite**.
5. Add your **Environment Variables**.
6. Click **Deploy**.

---

## 🛠️ Troubleshooting

### 1. "Method Not Allowed" (405)
Vercel serverless functions in this project check for the HTTP method (e.g., `req.method !== 'GET'`). Ensure your frontend is using the correct method.

### 2. Database Connection Failures
- Ensure `MONGODB_URI` is correctly set in Vercel.
- Check if your MongoDB cluster allows connections from all IP addresses (`0.0.0.0/0`) or if you need to whitelist Vercel IPs (note: Vercel IPs are dynamic).

### 3. API Route 404
On Vercel, routes are defined by the filename in the `/api` directory.
- `api/products.ts` -> `/api/products`
- `api/checkout/start.ts` -> `/api/checkout/start`

The local Fastify server uses `/api/products` (defined in `server/index.ts`). Ensure these match.

---

## 🔄 Local Development vs Production

When running locally (`npm run dev`):
- Vite proxies requests starting with `/api` to `http://127.0.0.1:3001`.
- The Fastify server handles these requests.

When deployed on Vercel:
- The proxy is ignored.
- Vercel routes `/api` requests directly to the functions in the `/api` folder.
