# AI-Powered Resume Builder

> Streamline your entire job application lifecycle with AI-powered automation tools

## Overview

The AI-Powered Resume Builder is a comprehensive system designed to analyze job descriptions and generate perfectly tailored resumes. Using advanced AI integrations, it provides intelligent resume optimization, skill gap analysis, and personalized improvement recommendations to help users land their dream jobs.

## 🌟 Key Features

- **Smart Job Analysis**: Analyze job descriptions and generate tailored resumes for perfect matches
- **Resume Comparison**: Compare existing resumes with job descriptions and suggest targeted improvements
- **Skill Gap Analysis**: Identify missing skills/knowledge and provide learning resources
- **Cover Letter Generation**: Optional AI-powered cover letter creation
- **Batch Processing**: Handle multiple job descriptions and resumes simultaneously
- **Real-time Preview**: Live preview of resume updates as changes are made
- **Multiple Output Formats**: Export as DOC, PDF, or save directly to Google Drive

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+ recommended)
- npm (v8+ recommended)
- Docker and Docker Compose (for containerized deployment)

### Option 1: Docker Deployment (Recommended)

#### 1. Clone the repository

```bash
git clone https://github.com/king-defender/Resume-Buider.git
cd Resume-Buider
```

#### 2. Setup environment variables

```bash
# Copy and configure backend environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys (OpenAI, etc.)
```

#### 3. Build and run with Docker

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d
```

#### 4. Access the application

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001/api](http://localhost:3001/api)
- Health check: [http://localhost:3001/api/health](http://localhost:3001/api/health)

#### 5. Docker management commands

```bash
# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up --build backend
docker-compose up --build frontend

# Clean up (remove containers, networks, and volumes)
docker-compose down -v --remove-orphans
```

### Option 2: Manual Development Setup

#### 1. Clone the repository

```bash
git clone https://github.com/king-defender/Resume-Buider.git
cd Resume-Buider
```

#### 2. Install dependencies

#### 2. Install dependencies

```bash
cd backend
npm install
# (If there is a frontend directory)
cd ../frontend
npm install
```

#### 3. Setup environment variables

- Copy `.env.example` to `.env` in the relevant directories (backend, frontend)
- Add your API keys (OpenAI, Notion, etc.) and other secrets.

#### 4. Run the backend server

```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

#### 5. Run the frontend (if applicable)

```bash
cd frontend
npm start
```

#### 6. Access the app

- By default, the frontend runs at [http://localhost:3000](http://localhost:3000)
- The backend API runs at [http://localhost:5000](http://localhost:5000) (or as specified in your `.env`)

## 📁 Documentation Structure

- [**System Architecture**](SYSTEM_ARCHITECTURE.md) - Technical specifications and AI integrations
- [**User Guide**](USER_GUIDE.md) - Complete workflows and feature details
- [**AI Integrations**](AI_INTEGRATIONS.md) - AI roles and capabilities
- [**Deployment Guide**](DEPLOYMENT.md) - Security, privacy, and deployment information
- [**UI Design**](UI_DESIGN.md) - Interface specifications and design guidelines

## 🎯 Target Users

The system is customizable for different user stages:
- Students and New Graduates
- Entry-level Professionals
- Experienced Workers
- Senior Professionals
- Managers and Executives

## 🔒 Privacy & Security

- **Data Retention**: Activity history retained for 90 days
- **Secure Deployment**: Initial Docker deployment with cloud migration options
- **Privacy-First**: Your data stays secure and private

## 🛠 Technology Stack

### JavaScript-First Architecture
- **Frontend**: React 18+ with TypeScript, Next.js for SSR capabilities
- **Backend**: Node.js LTS with Express.js/Fastify, TypeScript for type safety
- **Database**: PostgreSQL with Prisma ORM, Redis for caching
- **Document Processing**: docx.js, pdf-lib, mammoth.js for file handling
- **AI Integration**: Official JavaScript SDKs (OpenAI, Anthropic, etc.)
- **Testing**: Jest, React Testing Library, SuperTest for comprehensive testing
- **Build Tools**: Vite/Next.js, ESBuild for fast compilation

### AI Integrations
- **Primary Services**: ChatGPT, GitHub Copilot, Notion AI, Replit, LangChain.js
- **Research & Analysis**: Grok, Perplexity AI with JavaScript API clients
- **Multi-Agent**: Autogen with JavaScript orchestration layer
- **Architecture**: Plug-and-play modules with TypeScript interfaces

### Deployment & Infrastructure
- **Containerization**: Docker with multi-stage builds for Node.js applications
- **Orchestration**: Kubernetes for scalability, Docker Compose for development
- **Cloud Services**: AWS/GCP/Azure with JavaScript SDKs for service integration
- **Monitoring**: Prometheus metrics with JavaScript collectors, structured logging

### Development Principles
- **Language Consistency**: JavaScript/TypeScript across all system components
- **Type Safety**: Comprehensive TypeScript usage with strict configuration
- **Modern Standards**: ES2022+ features, latest Node.js LTS versions
- **Package Management**: npm/yarn with lockfiles for reproducible builds

## 📱 User Interface

- **Web Application**: Primary interface with responsive design
- **Dashboard Layout**: Modular design with sidebar navigation and dark theme
- **Desktop/Mobile Apps**: Future expansion for native applications

## 🏗️ Project Structure

- `/backend` – Express API, AI service integration logic
- `/frontend` – React/Next.js app for user interface
- `/docs` – Documentation and specifications

## 🔧 Adding AI Providers

- See `/backend/README.md` or `/docs/ai-integration.md` (if present) for instructions to add new AI modules.

## 🐛 Troubleshooting

- Ensure all required environment variables are set.
- Check your API key limits and permissions.
- Use `npm run dev` for better error logs during development.

## 🤝 Contributing

This documentation serves as the foundation for development. Please refer to the detailed documentation files for specific implementation guidelines.

## 📄 License

MIT

---

**Note**: This documentation is collaboratively maintained and will evolve with project requirements.