import { AIService, AnalysisResult } from './types';
export declare class OpenAIService implements AIService {
    name: string;
    private client;
    constructor();
    isAvailable(): boolean;
    analyze(resumeContent: string, jobDescription: string): Promise<AnalysisResult>;
    private createAnalysisPrompt;
    private parseAnalysisResult;
    private createFallbackResult;
    private extractListItems;
    private extractKeywordMatch;
}
//# sourceMappingURL=openai-service.d.ts.map