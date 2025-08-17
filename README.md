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

- **Docker & Docker Compose** (Recommended) - For containerized deployment
- **Node.js (v18+ recommended)** and **npm (v8+ recommended)** - For local development
- **Environment Variables** - See [Environment Setup](#environment-setup)

### Option 1: Docker Setup (Recommended)

#### 1. Clone the repository
```bash
git clone https://github.com/king-defender/Resume-Buider.git
cd Resume-Buider
```

#### 2. Setup environment variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file with your API keys and configuration
# Required: OPENAI_API_KEY, JWT_SECRET
# Optional: REDIS_PASSWORD, other AI service keys
```

#### 3. Build and run with Docker Compose
```bash
# For production deployment
docker compose up -d

# For development with hot reload  
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose logs -f

# Check container status
docker compose ps
```

#### 4. Access the application
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Option 2: Local Development Setup

#### 1. Clone and install dependencies
```bash
git clone https://github.com/king-defender/Resume-Buider.git
cd Resume-Buider

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 2. Setup environment variables
- Copy `.env.example` to `.env` in both backend and frontend directories
- Add your API keys (OpenAI, Notion, etc.) and other secrets

#### 3. Build the applications
```bash
# Build backend
cd backend
npm run build

# Build frontend
cd ../frontend
npm run build
```

#### 4. Run the applications
```bash
# Run backend server
cd backend
npm start
# or for development with auto-reload
npm run dev

# Run frontend (in another terminal)
cd frontend
npm start
```

#### 5. Access the app
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000) (or as specified in your `.env`)

## 🐳 Docker Deployment

### Architecture Overview

The application is containerized using Docker with the following services:
- **Frontend**: React app served via Nginx (Port 3000)
- **Backend**: Node.js/Express API server (Port 5000)
- **Database**: PostgreSQL 15 (Port 5432)
- **Cache**: Redis 7 (Port 6379)

### Docker Commands

#### Production Deployment
```bash
# Build and start all services
docker compose up -d

# Build images from scratch
docker compose up -d --build

# Scale backend instances
docker compose up -d --scale backend=3

# View logs
docker compose logs -f [service_name]

# Stop all services
docker compose down

# Stop and remove volumes (⚠️ data loss)
docker compose down -v
```

#### Development Mode
```bash
# Start with hot reload enabled
docker compose -f docker-compose.dev.yml up -d

# Watch logs in development
docker compose -f docker-compose.dev.yml logs -f frontend backend
```

#### Individual Service Management
```bash
# Build specific service
docker compose build backend

# Restart specific service
docker compose restart frontend

# Execute commands in running container
docker compose exec backend npm run build
docker compose exec db psql -U resumeuser -d resumebuilder
```

### Environment Setup

#### Required Environment Variables
Create a `.env` file in the root directory:

```env
# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production

# AI Services
OPENAI_API_KEY=your-openai-api-key-here

# Optional: Additional AI Services
# ANTHROPIC_API_KEY=your-anthropic-key
# GITHUB_TOKEN=your-github-token
# NOTION_API_KEY=your-notion-api-key

# Database (handled by Docker Compose)
POSTGRES_DB=resumebuilder
POSTGRES_USER=resumeuser
POSTGRES_PASSWORD=resumepass

# Redis (optional password)
REDIS_PASSWORD=your-redis-password
```

#### Environment Variable Details

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `JWT_SECRET` | ✅ | Secret key for JWT token generation | - |
| `OPENAI_API_KEY` | ✅ | OpenAI API key for AI services | - |
| `POSTGRES_PASSWORD` | ⚠️ | Database password (auto-generated in Docker) | `resumepass` |
| `REDIS_PASSWORD` | ❌ | Redis authentication password | `defaultpassword` |
| `NODE_ENV` | ❌ | Application environment | `production` |
| `CORS_ORIGIN` | ❌ | Frontend URL for CORS | `http://localhost:3000` |

### Port Configuration

| Service | Internal Port | External Port | Description |
|---------|---------------|---------------|-------------|
| Frontend | 80 | 3000 | React app served via Nginx |
| Backend | 5000 | 5000 | Express.js API server |
| PostgreSQL | 5432 | 5432 | Database server |
| Redis | 6379 | 6379 | Cache and session store |

### Volume Management

#### Persistent Data
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect resume-buider_postgres_data

# Backup database
docker compose exec db pg_dump -U resumeuser resumebuilder > backup.sql

# Restore database
docker compose exec -T db psql -U resumeuser resumebuilder < backup.sql
```

#### File Uploads
Uploaded files are stored in the `uploads` Docker volume, mounted at `/app/uploads` in the backend container.

### Health Checks & Monitoring

#### Service Health
```bash
# Check container health status
docker compose ps

# View health check logs
docker inspect resume-buider-backend-1 | grep -A 10 "Health"

# Manual health checks
curl http://localhost:5000/api/health
curl http://localhost:3000
```

#### Resource Usage
```bash
# Monitor resource usage
docker stats

# View container logs
docker compose logs --tail=100 -f backend
```

### Troubleshooting

#### Common Issues

**1. Port Already in Use**
```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

**2. Permission Denied / Volume Issues**
```bash
# Fix volume permissions
docker compose exec backend chown -R nodejs:nodejs /app/uploads

# Reset volumes (⚠️ data loss)
docker compose down -v
docker volume prune
```

**3. Database Connection Issues**
```bash
# Check database logs
docker compose logs db

# Connect to database manually
docker compose exec db psql -U resumeuser -d resumebuilder

# Reset database
docker compose down
docker volume rm resume-buider_postgres_data
docker compose up -d
```

**4. Build Failures**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker compose build --no-cache

# Build individual service
docker compose build --no-cache backend
```

**5. Memory Issues**
```bash
# Check Docker memory usage
docker stats --no-stream

# Increase Docker memory limit in Docker Desktop settings
# Recommended: 4GB+ for full stack
```

#### Log Analysis
```bash
# View all service logs
docker compose logs

# Follow specific service logs
docker compose logs -f backend

# Filter logs by time
docker compose logs --since="2h" backend

# Search logs for errors
docker compose logs backend | grep -i error
```

#### Development Debugging
```bash
# Access container shell
docker compose exec backend sh
docker compose exec frontend sh

# Install debugging tools
docker compose exec backend apk add --no-cache curl
docker compose exec backend curl http://localhost:5000/api/health

# View container environment
docker compose exec backend env
```

### Security Considerations

#### Production Deployment
- Change default passwords in `.env`
- Use strong JWT secrets (32+ characters)
- Consider using Docker secrets for sensitive data
- Limit exposed ports (remove database port exposure)
- Use non-root users (already implemented)
- Regular security updates of base images

#### Network Security
```bash
# View Docker networks
docker network ls

# Inspect application network
docker network inspect resume-buider_resume-builder
```

### Performance Optimization

#### Resource Limits
Add to `docker-compose.yml`:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

#### Multi-stage Builds
The Dockerfiles use optimized approaches:
- Frontend: Pre-built React app served by Nginx
- Backend: Pre-built Node.js app with production dependencies only

### Scaling & Load Balancing

#### Horizontal Scaling
```bash
# Scale backend instances
docker compose up -d --scale backend=3

# Use nginx for load balancing (add nginx service to compose)
```

#### Database Optimization
```bash
# Monitor database performance
docker compose exec db psql -U resumeuser -d resumebuilder -c "SELECT * FROM pg_stat_activity;"

# Optimize PostgreSQL settings in docker-compose.yml
```

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

## 📁 Documentation Structure

- [**System Architecture**](SYSTEM_ARCHITECTURE.md) - Technical specifications and AI integrations
- [**User Guide**](USER_GUIDE.md) - Complete workflows and feature details
- [**AI Integrations**](AI_INTEGRATIONS.md) - AI roles and capabilities
- [**Deployment Guide**](DEPLOYMENT.md) - Security, privacy, and deployment information
- [**UI Design**](UI_DESIGN.md) - Interface specifications and design guidelines

## 🏗️ Project Structure

```
Resume-Buider/
├── backend/                 # Express.js API server
│   ├── src/                # TypeScript source code
│   ├── dist/               # Compiled JavaScript (auto-generated)
│   ├── uploads/            # File uploads (Docker volume)
│   ├── Dockerfile          # Production container
│   ├── Dockerfile.dev      # Development container
│   ├── package.json        # Node.js dependencies
│   └── tsconfig.json       # TypeScript configuration
├── frontend/               # React application
│   ├── src/                # React source code
│   ├── build/              # Production build (auto-generated)
│   ├── public/             # Static assets
│   ├── Dockerfile          # Production container (Nginx)
│   ├── Dockerfile.dev      # Development container
│   ├── nginx.conf          # Nginx configuration
│   └── package.json        # React dependencies
├── scripts/                # Database and deployment scripts
│   └── init.sql            # PostgreSQL initialization
├── docs/                   # Documentation files
├── docker-compose.yml      # Production orchestration
├── docker-compose.dev.yml  # Development orchestration
├── .env.example            # Environment variables template
└── README.md               # This file
```

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