# 🧠 CortexAI - Multi-Agent AI Operating Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-cortex--ai--9pnp.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://cortex-ai-9pnp.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Microservices](https://img.shields.io/badge/Architecture-Distributed%20Microservices-emerald?style=for-the-badge)](https://cortex-ai-9pnp.vercel.app/)

> **Live Application**: [https://cortex-ai-9pnp.vercel.app/](https://cortex-ai-9pnp.vercel.app/)

---

## 🌟 Overview

**CortexAI** is an advanced, distributed multi-agent AI operating platform engineered to route, synthesize, and execute complex workflows across specialized AI agents. Built with a high-concurrency microservices architecture, CortexAI seamlessly provides:

- 💻 **Autonomous Coding Agent**: Generates production-ready, full-stack multi-file projects with interactive live previews.
- 🌐 **Real-time Web Search Agent**: Deep web search powered by Tavily with image and citation extractions.
- 🖼️ **Vision & Image Generation Agent**: Generates 8K cinematic imagery and analyzes visual inputs.
- 📄 **Document Generation Agent (PDF & PPT)**: Automatically writes, formats, and exports high-quality downloadable PDFs and PowerPoint presentations.
- 🤖 **Interactive Conversational AI**: Fast, context-aware memory powered by Groq's high-speed Llama 3.3 model and Upstash Redis.
- 💳 **Billing & Subscription Engine**: Integrated Razorpay checkout with credit balance tracking.

---

## 🏗️ Architecture Overview

```
[ Frontend (React + Vite + TailwindCSS on Vercel) ]
                         │
                         ▼
             [ API Gateway on Render ]
    (CORS, Preflight, Cookie Auth, Load Routing)
                         │
   ┌─────────────────────┼─────────────────────┬─────────────────────┐
   ▼                     ▼                     ▼                     ▼
[ Auth Service ]  [ Chat Service ]      [ Agent Service ]    [ Billing Service ]
- Firebase Admin  - MongoDB Chat        - LangGraph / Groq   - Razorpay Payments
- MongoDB Auth    - Message History     - Multi-Agent Graph  - Credit Allocations
- Redis Sessions                        - AWS S3 / Vector DB
```

---

## 🚀 Live Services

| Component | Provider | Live URL |
|---|---|---|
| **Frontend UI** | Vercel | [https://cortex-ai-9pnp.vercel.app/](https://cortex-ai-9pnp.vercel.app/) |
| **API Gateway** | Render | `https://cortex-gateway-aybl.onrender.com` |
| **Auth Microservice** | Render | `https://cortex-auth-6382.onrender.com` |
| **Chat Microservice** | Render | `https://cortex-chat-dx0n.onrender.com` |
| **AI Agent Service** | Render | `https://cortex-agent-f04c.onrender.com` |
| **Billing Microservice** | Render | `https://cortex-billing-zs3c.onrender.com` |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS, Redux Toolkit, Lucide Icons, Canvas Confetti
- **Backend & Gateway**: Node.js, Express 5, Express-HTTP-Proxy, Cookie-Parser, Morgan
- **AI & Orchestration**: LangChain, LangGraph, Groq Llama 3.3, OpenRouter, Google Gemini, Tavily Search
- **Databases & Cache**: MongoDB Atlas (Mongoose), Upstash Redis, Qdrant Vector Cloud
- **Cloud & Storage**: AWS S3 (Presigned URLs), Razorpay Payments, Firebase Admin SDK
- **Deployment**: Vercel (Frontend), Render (Microservices)

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/saurabh28102006-pixel/cortex-ai.git
cd cortex-ai
```

### 2. Install dependencies & Run
```bash
# Frontend
cd frontend
npm install
npm run dev

# Gateway
cd ../backend/gateway
npm install
npm run dev
```

---

## 📄 License
This project is licensed under the MIT License.
