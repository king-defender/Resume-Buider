export interface AIService {
  id: string;
  name: string;
  available: boolean;
  status: 'active' | 'offline';
}

export interface AnalysisResult {
  summary: string;
  strengths: string[];
  improvements: string[];
  keywordMatch: number;
  skillGaps: string[];
  recommendations: string[];
  optimizedContent?: string;
}

export interface AnalysisResponse {
  success: boolean;
  analysis: AnalysisResult;
  provider: string;
  error?: string;
  message?: string;
}