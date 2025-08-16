import { AIService, AnalysisResult, FileProcessor } from './types';
import { OpenAIService } from './openai-service';
import { MockNotionAIService } from './mock-notion-service';
import { MockCopilotService } from './mock-copilot-service';

export class AIServiceRegistry {
  private services: Map<string, AIService> = new Map();

  constructor() {
    this.registerServices();
  }

  private registerServices() {
    // Register OpenAI service
    const openAIService = new OpenAIService();
    this.services.set('openai', openAIService);

    // Register mock services
    this.services.set('notion', new MockNotionAIService());
    this.services.set('copilot', new MockCopilotService());
  }

  getAvailableServices() {
    const services = [];
    for (const [key, service] of this.services) {
      services.push({
        id: key,
        name: service.name,
        available: service.isAvailable(),
        status: service.isAvailable() ? 'active' : 'offline'
      });
    }
    return services;
  }

  async analyzeResume(serviceId: string, resumeFilePath: string, jobDescFilePath: string): Promise<AnalysisResult> {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`AI service '${serviceId}' not found`);
    }

    if (!service.isAvailable()) {
      throw new Error(`AI service '${serviceId}' is not available`);
    }

    try {
      // Extract text from files
      const resumeContent = await FileProcessor.extractText(resumeFilePath);
      const jobDescription = await FileProcessor.extractText(jobDescFilePath);

      // Validate content
      if (!resumeContent.trim()) {
        throw new Error('Resume file appears to be empty or unreadable');
      }
      if (!jobDescription.trim()) {
        throw new Error('Job description file appears to be empty or unreadable');
      }

      // Perform analysis
      return await service.analyze(resumeContent, jobDescription);
    } catch (error) {
      throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async analyzeResumeText(serviceId: string, resumeText: string, jobDescriptionText: string): Promise<AnalysisResult> {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`AI service '${serviceId}' not found`);
    }

    if (!service.isAvailable()) {
      throw new Error(`AI service '${serviceId}' is not available`);
    }

    try {
      // Validate content
      if (!resumeText.trim()) {
        throw new Error('Resume text cannot be empty');
      }
      if (!jobDescriptionText.trim()) {
        throw new Error('Job description text cannot be empty');
      }

      // Perform analysis
      return await service.analyze(resumeText, jobDescriptionText);
    } catch (error) {
      throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getService(serviceId: string): AIService | undefined {
    return this.services.get(serviceId);
  }

  getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }
}