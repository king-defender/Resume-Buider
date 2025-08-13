import axios from 'axios';
import { AIService, AnalysisResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for AI analysis
});

export const aiApi = {
  // Get available AI services
  getServices: async (): Promise<{ services: AIService[] }> => {
    const response = await api.get('/ai-services');
    return response.data;
  },

  // Analyze resume with files
  analyzeWithFiles: async (
    resumeFile: File,
    jobDescFile: File,
    aiProvider: string
  ): Promise<AnalysisResponse> => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescFile);
    formData.append('aiProvider', aiProvider);

    const response = await api.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Analyze resume with text
  analyzeWithText: async (
    resumeText: string,
    jobDescriptionText: string,
    aiProvider: string
  ): Promise<AnalysisResponse> => {
    const response = await api.post('/analyze-text', {
      resumeText,
      jobDescriptionText,
      aiProvider,
    });

    return response.data;
  },
};