import { AIService, AnalysisResult } from './types';
export declare class AIServiceRegistry {
    private services;
    constructor();
    private registerServices;
    getAvailableServices(): {
        id: string;
        name: string;
        available: boolean;
        status: string;
    }[];
    analyzeResume(serviceId: string, resumeFilePath: string, jobDescFilePath: string): Promise<AnalysisResult>;
    analyzeResumeText(serviceId: string, resumeText: string, jobDescriptionText: string): Promise<AnalysisResult>;
    getService(serviceId: string): AIService | undefined;
    getServiceNames(): string[];
}
//# sourceMappingURL=ai-service-registry.d.ts.map