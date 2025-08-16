# Resume Builder – Multi-AI Integration

This project is an extensible Resume Builder that can leverage multiple AI services (OpenAI, Notion AI, etc.) for resume analysis, improvement, and job matching.

## Run Instructions

### Prerequisites

- Node.js (v16+ recommended)
- npm (v8+ recommended)
- (Optional) Docker for containerized deployment

### 1. Clone the repository

```bash
git clone https://github.com/king-defender/Resume-Buider.git
cd Resume-Buider
```

### 2. Install dependencies

```bash
cd backend
npm install
# (If there is a frontend directory)
cd ../frontend
npm install
```

### 3. Setup environment variables

- Copy `.env.example` to `.env` in the relevant directories (backend, frontend)
- Add your API keys (OpenAI, Notion, etc.) and other secrets.

### 4. Run the backend server

```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

### 5. Run the frontend (if applicable)

```bash
cd frontend
npm start
```

### 6. Access the app

- By default, the frontend runs at [http://localhost:3000](http://localhost:3000)
- The backend API runs at [http://localhost:5000](http://localhost:5000) (or as specified in your `.env`)

## Project Structure

- `/backend` – Express API, AI service integration logic
- `/frontend` – (If present) React/Next.js app for user interface
- `/docs` – Documentation and specifications

## Adding AI Providers

- See `/backend/README.md` or `/docs/ai-integration.md` (if present) for instructions to add new AI modules.

## Troubleshooting

- Ensure all required environment variables are set.
- Check your API key limits and permissions.
- Use `npm run dev` for better error logs during development.

## License

MIT

---

> _Please update this README as the project evolves. PRs are welcome!_