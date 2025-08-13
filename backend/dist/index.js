"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Configure multer for file uploads
const uploadDir = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.docx', '.doc', '.txt'];
        const fileExt = path_1.default.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(fileExt)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed.'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});
// Import AI services
const ai_service_registry_1 = require("./services/ai-service-registry");
const aiRegistry = new ai_service_registry_1.AIServiceRegistry();
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
        const files = req.files;
        if (!files.resume || !files.jobDescription) {
            return res.status(400).json({
                error: 'Both resume and job description files are required'
            });
        }
        const resumeFile = files.resume[0];
        const jobDescFile = files.jobDescription[0];
        // Process files and analyze
        const result = await aiRegistry.analyzeResume(aiProvider, resumeFile.path, jobDescFile.path);
        // Clean up uploaded files
        fs_1.default.unlinkSync(resumeFile.path);
        fs_1.default.unlinkSync(jobDescFile.path);
        res.json({
            success: true,
            analysis: result,
            provider: aiProvider
        });
    }
    catch (error) {
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
        const result = await aiRegistry.analyzeResumeText(aiProvider, resumeText, jobDescriptionText);
        res.json({
            success: true,
            analysis: result,
            provider: aiProvider
        });
    }
    catch (error) {
        console.error('Text analysis error:', error);
        res.status(500).json({
            error: 'Failed to analyze resume text',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
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
//# sourceMappingURL=index.js.map