"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIServiceRegistry = void 0;
const types_1 = require("./types");
const openai_service_1 = require("./openai-service");
const mock_notion_service_1 = require("./mock-notion-service");
const mock_copilot_service_1 = require("./mock-copilot-service");
class AIServiceRegistry {
    constructor() {
        this.services = new Map();
        this.registerServices();
    }
    registerServices() {
        // Register OpenAI service
        const openAIService = new openai_service_1.OpenAIService();
        this.services.set('openai', openAIService);
        // Register mock services
        this.services.set('notion', new mock_notion_service_1.MockNotionAIService());
        this.services.set('copilot', new mock_copilot_service_1.MockCopilotService());
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
    async analyzeResume(serviceId, resumeFilePath, jobDescFilePath) {
        const service = this.services.get(serviceId);
        if (!service) {
            throw new Error(`AI service '${serviceId}' not found`);
        }
        if (!service.isAvailable()) {
            throw new Error(`AI service '${serviceId}' is not available`);
        }
        try {
            // Extract text from files
            const resumeContent = await types_1.FileProcessor.extractText(resumeFilePath);
            const jobDescription = await types_1.FileProcessor.extractText(jobDescFilePath);
            // Validate content
            if (!resumeContent.trim()) {
                throw new Error('Resume file appears to be empty or unreadable');
            }
            if (!jobDescription.trim()) {
                throw new Error('Job description file appears to be empty or unreadable');
            }
            // Perform analysis
            return await service.analyze(resumeContent, jobDescription);
        }
        catch (error) {
            throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async analyzeResumeText(serviceId, resumeText, jobDescriptionText) {
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
        }
        catch (error) {
            throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    getService(serviceId) {
        return this.services.get(serviceId);
    }
    getServiceNames() {
        return Array.from(this.services.keys());
    }
}
exports.AIServiceRegistry = AIServiceRegistry;
//# sourceMappingURL=ai-service-registry.js.map