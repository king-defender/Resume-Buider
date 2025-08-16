import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.doc', '.txt'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Import AI services
import { AIServiceRegistry } from './services/ai-service-registry';

const aiRegistry = new AIServiceRegistry();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Resume Analyzer API is running' });
});

// Get available AI services
app.get('/api/ai-services', (req, res) => {
  const services = aiRegistry.getAvailableServices();
  res.json({ services });
});

// Resume analysis endpoint
app.post('/api/analyze', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jobDescription', maxCount: 1 }
]), async (req, res) => {
  try {
    const { aiProvider = 'openai' } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files.resume || !files.jobDescription) {
      return res.status(400).json({ 
        error: 'Both resume and job description files are required' 
      });
    }

    const resumeFile = files.resume[0];
    const jobDescFile = files.jobDescription[0];

    // Process files and analyze
    const result = await aiRegistry.analyzeResume(
      aiProvider,
      resumeFile.path,
      jobDescFile.path
    );

    // Clean up uploaded files
    fs.unlinkSync(resumeFile.path);
    fs.unlinkSync(jobDescFile.path);

    res.json({ 
      success: true,
      analysis: result,
      provider: aiProvider 
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze resume',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Text-based analysis endpoint (for direct text input)
app.post('/api/analyze-text', async (req, res) => {
  try {
    const { resumeText, jobDescriptionText, aiProvider = 'openai' } = req.body;
    
    if (!resumeText || !jobDescriptionText) {
      return res.status(400).json({ 
        error: 'Both resume text and job description text are required' 
      });
    }

    const result = await aiRegistry.analyzeResumeText(
      aiProvider,
      resumeText,
      jobDescriptionText
    );

    res.json({ 
      success: true,
      analysis: result,
      provider: aiProvider 
    });

  } catch (error) {
    console.error('Text analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze resume text',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Resume Analyzer API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});