# AI-Powered Resume Builder
Documentation-only repository for an AI-powered resume optimization system with comprehensive architectural planning and multi-AI integration strategy.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Repository State
- **CRITICAL**: This is currently a DOCUMENTATION-ONLY repository with no implementation code
- **Current Status**: Planning and architectural documentation phase
- **Implementation**: Not yet started - no package.json, dependencies, or runnable code
- **Primary Branch**: copilot/fix-3 (working branch), documentation exists in copilot/fix-1 branch

### Essential Commands
- **Repository exploration**: 
  - `ls -la` -- shows current directory contents (expect only readme.md and .git)
  - `git branch -a` -- shows available branches
  - `git ls-remote --heads origin` -- shows all remote branches
- **Documentation access**:
  - `git fetch origin copilot/fix-1` -- fetch the comprehensive documentation branch
  - `git ls-tree --name-only FETCH_HEAD` -- list documentation files
  - `git show FETCH_HEAD:readme.md` -- view main project documentation
  - `git show FETCH_HEAD:SYSTEM_ARCHITECTURE.md` -- view technical architecture
  - `git show FETCH_HEAD:DEPLOYMENT.md` -- view deployment and security plans
  - `git show FETCH_HEAD:AI_INTEGRATIONS.md` -- view AI service integration strategy

### Validation
- **ALWAYS** run `git fetch origin copilot/fix-1` to access comprehensive documentation
- **ALWAYS** verify repository state with `ls -la` (expect only readme.md in working directory)
- **Documentation review**: Use `git show FETCH_HEAD:filename.md` to access planning documents
- **NEVER** attempt to build, test, or run code - none exists yet
- **NEVER** look for package.json, requirements.txt, or other dependency files - they don't exist

## Project Architecture (Planned)

### Technology Stack
- **Frontend**: React with TypeScript, Material-UI or Chakra UI
- **Backend**: Node.js with Express.js or FastAPI
- **Database**: PostgreSQL for user data, Redis for caching
- **AI Integration**: ChatGPT, GitHub Copilot, Notion AI, Replit, LangChain, Autogen, Grok, Perplexity
- **Deployment**: Docker-first with Kubernetes scaling options
- **Storage**: S3-compatible for documents, CDN for static assets

### Core Features (Planned)
- Smart job description analysis and resume tailoring
- Multi-AI resume optimization pipeline
- Skill gap analysis with learning recommendations
- Cover letter generation
- Real-time preview and multiple export formats
- Batch processing capabilities

### Security & Privacy (Planned)
- 90-day data retention policy
- AES-256 encryption at rest, TLS 1.3 in transit
- JWT authentication with refresh token rotation
- GDPR and CCPA compliance
- Role-based access control (RBAC)

## Development Roadmap

### Phase 1: Setup & Foundation
- [ ] Initialize project structure (frontend/backend directories)
- [ ] Set up development environment (Node.js, Docker, dependencies)
- [ ] Create basic React frontend scaffolding
- [ ] Set up Express.js backend API structure
- [ ] Configure PostgreSQL and Redis databases
- [ ] Implement basic authentication system

### Phase 2: Core Functionality
- [ ] Build document upload and parsing system
- [ ] Implement AI service integration layer
- [ ] Create resume analysis and optimization engine
- [ ] Develop real-time preview system
- [ ] Build export functionality (PDF, DOC, Google Drive)

### Phase 3: AI Integration
- [ ] Integrate ChatGPT for content generation
- [ ] Add GitHub Copilot for technical content
- [ ] Implement LangChain for workflow orchestration
- [ ] Add Perplexity for research and fact-checking
- [ ] Set up Autogen for multi-agent collaboration

### Phase 4: Advanced Features
- [ ] Implement skill gap analysis
- [ ] Add batch processing capabilities
- [ ] Build cover letter generation
- [ ] Create user dashboard and analytics
- [ ] Implement A/B testing framework

## Common Tasks

### Repository Navigation
```bash
# Current working directory contents
ls -la
# Output: . .. .git readme.md

# Check available branches
git branch -a
# Shows: copilot/fix-3 (current), remotes/origin/copilot/fix-3

# Fetch documentation branch
git fetch origin copilot/fix-1
# Provides access to comprehensive documentation
```

### Documentation Review
```bash
# List all documentation files
git ls-tree --name-only FETCH_HEAD
# Output: AI_INTEGRATIONS.md, DEPLOYMENT.md, SYSTEM_ARCHITECTURE.md, UI_DESIGN.md, USER_GUIDE.md, readme.md

# View main project overview
git show FETCH_HEAD:readme.md

# Review technical architecture
git show FETCH_HEAD:SYSTEM_ARCHITECTURE.md

# Check deployment strategy
git show FETCH_HEAD:DEPLOYMENT.md

# Understand AI integration plans
git show FETCH_HEAD:AI_INTEGRATIONS.md
```

### Next Steps for Implementation
1. **Environment Setup**: Install Node.js, Docker, PostgreSQL
2. **Project Initialization**: `npx create-react-app frontend --template typescript`
3. **Backend Setup**: `npm init` and Express.js setup in backend directory
4. **Database Setup**: PostgreSQL and Redis Docker containers
5. **AI Service Setup**: API keys for ChatGPT, GitHub Copilot, etc.

## Important Notes

### What Works
- Documentation exploration and review
- Git commands for branch and content access
- Planning and architectural review
- Technology stack research

### What Doesn't Work
- Build commands (no package.json or build system)
- Test commands (no test framework installed)
- Development server startup (no application code)
- Dependency installation (no dependency files)
- Code linting or formatting (no configuration files)

### Critical Understanding
This repository serves as a comprehensive planning document for an AI-powered resume builder system. The documentation in the copilot/fix-1 branch contains detailed architectural plans, security considerations, deployment strategies, and AI integration approaches that should guide the actual implementation phase.

When beginning development, use the existing documentation as the source of truth for system requirements, technology choices, and implementation patterns. The documentation is extensively detailed and production-ready for guiding development work.

### Documentation Structure
- **readme.md**: Project overview and feature summary
- **SYSTEM_ARCHITECTURE.md**: Technical specifications and component design
- **DEPLOYMENT.md**: Security, privacy, and operational procedures
- **AI_INTEGRATIONS.md**: Multi-AI service integration strategy
- **UI_DESIGN.md**: Interface specifications and design guidelines
- **USER_GUIDE.md**: Planned user workflows and feature details