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
export declare class FileProcessor {
    static extractText(filePath: string): Promise<string>;
}
//# sourceMappingURL=types.d.ts.map