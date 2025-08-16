import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

export interface AIService {
  name: string;
  analyze(resumeContent: string, jobDescription: string): Promise<AnalysisResult>;
  isAvailable(): boolean;
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

export class FileProcessor {
  static async extractText(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();
    
    try {
      switch (ext) {
        case '.txt':
          return fs.readFileSync(filePath, 'utf8');
          
        case '.docx':
        case '.doc':
          const result = await mammoth.extractRawText({ path: filePath });
          return result.value;
          
        case '.pdf':
          const pdfBuffer = fs.readFileSync(filePath);
          const pdfData = await pdfParse(pdfBuffer);
          return pdfData.text;
          
        default:
          throw new Error(`Unsupported file type: ${ext}`);
      }
    } catch (error) {
      throw new Error(`Failed to extract text from file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}