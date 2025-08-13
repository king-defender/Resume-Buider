import OpenAI from 'openai';
import { AIService, AnalysisResult } from './types';

export class OpenAIService implements AIService {
  name = 'OpenAI GPT';
  private client: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not found. OpenAI service will not be available.');
    }
    
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key'
    });
  }

  isAvailable(): boolean {
    return !!process.env.OPENAI_API_KEY;
  }

  async analyze(resumeContent: string, jobDescription: string): Promise<AnalysisResult> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI service is not available. Please check API key configuration.');
    }

    try {
      const prompt = this.createAnalysisPrompt(resumeContent, jobDescription);
      
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume optimization specialist. Analyze resumes against job descriptions and provide detailed, actionable feedback in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const result = response.choices[0]?.message?.content;
      if (!result) {
        throw new Error('Empty response from OpenAI');
      }

      return this.parseAnalysisResult(result);
    } catch (error) {
      console.error('OpenAI analysis error:', error);
      throw new Error(`OpenAI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private createAnalysisPrompt(resumeContent: string, jobDescription: string): string {
    return `
Please analyze this resume against the job description and provide a comprehensive assessment.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeContent}

Please provide your analysis in the following JSON format:
{
  "summary": "Brief overall assessment of the resume's fit for this role",
  "strengths": ["List of 3-5 key strengths that align with the job"],
  "improvements": ["List of 3-5 specific areas for improvement"],
  "keywordMatch": number between 0-100 representing keyword alignment,
  "skillGaps": ["List of skills mentioned in job description but missing from resume"],
  "recommendations": ["List of 3-5 specific actionable recommendations"],
  "optimizedContent": "Improved version of 2-3 key resume bullet points that better match the job requirements"
}

Focus on:
1. Skills alignment between resume and job requirements
2. Experience relevance to the role
3. Achievement quantification and impact
4. Industry-specific keywords and terminology
5. Areas where the candidate could strengthen their application

Provide specific, actionable feedback that will help improve the resume's effectiveness for this particular role.
`;
  }

  private parseAnalysisResult(result: string): AnalysisResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate required fields
        return {
          summary: parsed.summary || 'Analysis completed',
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
          improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
          keywordMatch: typeof parsed.keywordMatch === 'number' ? parsed.keywordMatch : 0,
          skillGaps: Array.isArray(parsed.skillGaps) ? parsed.skillGaps : [],
          recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
          optimizedContent: parsed.optimizedContent || ''
        };
      }
    } catch (parseError) {
      console.warn('Failed to parse OpenAI JSON response, using fallback parsing');
    }

    // Fallback: create structured result from text response
    return this.createFallbackResult(result);
  }

  private createFallbackResult(text: string): AnalysisResult {
    return {
      summary: 'Resume analysis completed. The AI provided detailed feedback that may need manual review.',
      strengths: this.extractListItems(text, 'strength'),
      improvements: this.extractListItems(text, 'improv'),
      keywordMatch: this.extractKeywordMatch(text),
      skillGaps: this.extractListItems(text, 'skill'),
      recommendations: this.extractListItems(text, 'recommend'),
      optimizedContent: text.substring(0, 500) + '...'
    };
  }

  private extractListItems(text: string, keyword: string): string[] {
    const lines = text.split('\n');
    const items: string[] = [];
    
    let capturing = false;
    for (const line of lines) {
      if (line.toLowerCase().includes(keyword)) {
        capturing = true;
        continue;
      }
      
      if (capturing) {
        const trimmed = line.trim();
        if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.match(/^\d+\./)) {
          items.push(trimmed.replace(/^[-•\d.\s]+/, ''));
        } else if (trimmed.length === 0 || items.length >= 5) {
          break;
        }
      }
    }
    
    return items.slice(0, 5);
  }

  private extractKeywordMatch(text: string): number {
    const match = text.match(/(\d+)%/);
    if (match) {
      return parseInt(match[1]);
    }
    
    // Estimate based on presence of positive/negative language
    const positiveWords = ['strong', 'good', 'excellent', 'well', 'effective'];
    const negativeWords = ['weak', 'poor', 'missing', 'lack', 'insufficient'];
    
    let score = 50;
    positiveWords.forEach(word => {
      if (text.toLowerCase().includes(word)) score += 10;
    });
    negativeWords.forEach(word => {
      if (text.toLowerCase().includes(word)) score -= 10;
    });
    
    return Math.max(0, Math.min(100, score));
  }
}