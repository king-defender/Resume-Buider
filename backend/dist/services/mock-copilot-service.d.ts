import { AIService, AnalysisResult } from './types';
export declare class MockCopilotService implements AIService {
    name: string;
    isAvailable(): boolean;
    analyze(resumeContent: string, jobDescription: string): Promise<AnalysisResult>;
    private getRandomTechLevel;
}
//# sourceMappingURL=mock-copilot-service.d.ts.map