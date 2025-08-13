"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileProcessor = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mammoth_1 = __importDefault(require("mammoth"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
class FileProcessor {
    static async extractText(filePath) {
        const ext = path_1.default.extname(filePath).toLowerCase();
        try {
            switch (ext) {
                case '.txt':
                    return fs_1.default.readFileSync(filePath, 'utf8');
                case '.docx':
                case '.doc':
                    const result = await mammoth_1.default.extractRawText({ path: filePath });
                    return result.value;
                case '.pdf':
                    const pdfBuffer = fs_1.default.readFileSync(filePath);
                    const pdfData = await (0, pdf_parse_1.default)(pdfBuffer);
                    return pdfData.text;
                default:
                    throw new Error(`Unsupported file type: ${ext}`);
            }
        }
        catch (error) {
            throw new Error(`Failed to extract text from file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.FileProcessor = FileProcessor;
//# sourceMappingURL=types.js.map