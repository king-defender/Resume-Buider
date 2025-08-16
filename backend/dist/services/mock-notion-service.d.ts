import { AIService, AnalysisResult } from './types';
export declare class MockNotionAIService implements AIService {
    name: string;
    isAvailable(): boolean;
    analyze(resumeContent: string, jobDescription: string): Promise<AnalysisResult>;
}
//# sourceMappingURL=mock-notion-service.d.ts.map