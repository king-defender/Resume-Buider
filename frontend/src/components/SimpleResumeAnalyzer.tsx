import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Select,
  useToast,
  Textarea,
  FormControl,
  FormLabel,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Progress,
  Box,
  Heading,
  List,
  ListItem,
  Divider,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { aiApi } from '../utils/api';
import { AIService, AnalysisResult } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (result: AnalysisResult | null) => void;
}

export const SimpleResumeAnalyzer: React.FC<Props> = ({
  isOpen,
  onClose,
  onAnalysisComplete,
}) => {
  const [aiServices, setAiServices] = useState<AIService[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescText, setJobDescText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'input' | 'analyzing' | 'results'>('input');
  
  const toast = useToast();

  const loadAIServices = useCallback(async () => {
    try {
      const { services } = await aiApi.getServices();
      setAiServices(services);
      
      // Select first available service by default
      const availableService = services.find((s: AIService) => s.available);
      if (availableService) {
        setSelectedService(availableService.id);
      }
    } catch (error) {
      console.error('Failed to load AI services:', error);
      toast({
        title: 'Error',
        description: 'Failed to load AI services',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) {
      loadAIServices();
      resetForm();
    }
  }, [isOpen, loadAIServices]);

  const resetForm = () => {
    setResumeText('');
    setJobDescText('');
    setAnalysisResult(null);
    setError('');
    setStep('input');
    setIsAnalyzing(false);
  };

  const handleAnalyze = async () => {
    setError('');
    setIsAnalyzing(true);
    setStep('analyzing');

    try {
      if (!resumeText.trim() || !jobDescText.trim()) {
        throw new Error('Please provide both resume and job description text');
      }
      
      const result = await aiApi.analyzeWithText(resumeText, jobDescText, selectedService);

      if (result.success) {
        setAnalysisResult(result.analysis);
        setStep('results');
        onAnalysisComplete(result.analysis);
        
        toast({
          title: 'Analysis Complete!',
          description: `Your resume has been analyzed using ${result.provider}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(result.message || 'Analysis failed');
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      setError(error.response?.data?.message || error.message || 'Analysis failed');
      setStep('input');
      
      toast({
        title: 'Analysis Failed',
        description: error.response?.data?.message || error.message || 'Unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = () => {
    return selectedService && resumeText.trim() && jobDescText.trim();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleStartOver = () => {
    setStep('input');
    setAnalysisResult(null);
    setError('');
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Download Complete',
      description: `${filename} has been downloaded`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const generateFullReport = (result: AnalysisResult) => {
    const report = `
RESUME ANALYSIS REPORT
======================

SUMMARY
-------
${result.summary}

KEYWORD MATCH SCORE: ${result.keywordMatch}%

STRENGTHS
---------
${result.strengths.map((item, index) => `${index + 1}. ${item}`).join('\n')}

AREAS FOR IMPROVEMENT
--------------------
${result.improvements.map((item, index) => `${index + 1}. ${item}`).join('\n')}

SKILL GAPS IDENTIFIED
--------------------
${result.skillGaps.map((item, index) => `${index + 1}. ${item}`).join('\n')}

RECOMMENDATIONS
---------------
${result.recommendations.map((item, index) => `${index + 1}. ${item}`).join('\n')}

${result.optimizedContent ? `
OPTIMIZED CONTENT SAMPLE
------------------------
${result.optimizedContent}
` : ''}

Generated by AI-Powered Resume Builder
Date: ${new Date().toLocaleDateString()}
    `.trim();

    return report;
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>
          <HStack justify="space-between">
            <Text>Multi-AI Resume Analyzer (MVP)</Text>
            <Badge colorScheme={step === 'results' ? 'green' : 'blue'} variant="subtle">
              {step === 'input' ? 'Setup' : step === 'analyzing' ? 'Analyzing' : 'Results'}
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {step === 'input' && (
            <VStack spacing={6} align="stretch">
              {/* AI Service Selection */}
              <FormControl>
                <FormLabel>Select AI Provider</FormLabel>
                <Select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  placeholder="Choose an AI service"
                >
                  {aiServices.map((service) => (
                    <option 
                      key={service.id} 
                      value={service.id}
                      disabled={!service.available}
                    >
                      {service.name} {!service.available && '(Offline)'}
                    </option>
                  ))}
                </Select>
                {selectedService && (
                  <Text fontSize="sm" color="gray.600" mt={2}>
                    Selected: {aiServices.find(s => s.id === selectedService)?.name}
                  </Text>
                )}
              </FormControl>

              {/* Text Input */}
              <FormControl>
                <FormLabel>Resume Text</FormLabel>
                <Textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here..."
                  rows={8}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Job Description Text</FormLabel>
                <Textarea
                  value={jobDescText}
                  onChange={(e) => setJobDescText(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={8}
                />
              </FormControl>

              {error && (
                <Alert status="error">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
            </VStack>
          )}

          {step === 'analyzing' && (
            <VStack spacing={6} py={12} textAlign="center">
              <Spinner size="xl" color="blue.500" thickness="4px" />
              <Text fontSize="lg" fontWeight="medium">
                Analyzing your resume...
              </Text>
              <Text color="gray.600">
                This may take up to 30 seconds depending on the AI service selected.
              </Text>
              <Progress 
                size="lg" 
                isIndeterminate 
                colorScheme="blue" 
                width="100%" 
                borderRadius="md"
              />
            </VStack>
          )}

          {step === 'results' && analysisResult && (
            <VStack spacing={6} align="stretch">
              {/* Summary */}
              <Box bg="blue.50" p={4} borderRadius="lg" border="1px solid" borderColor="blue.200">
                <Heading size="md" mb={3}>Analysis Summary</Heading>
                <Text color="gray.700">{analysisResult.summary}</Text>
                <Box mt={3}>
                  <Text fontSize="sm" color="blue.600">
                    <strong>Keyword Match Score: {analysisResult.keywordMatch}%</strong>
                  </Text>
                  <Progress 
                    value={analysisResult.keywordMatch} 
                    colorScheme={analysisResult.keywordMatch >= 70 ? 'green' : analysisResult.keywordMatch >= 50 ? 'yellow' : 'red'}
                    mt={2}
                    borderRadius="full"
                  />
                </Box>
              </Box>

              {/* Strengths */}
              <Box bg="green.50" p={4} borderRadius="lg" border="1px solid" borderColor="green.200">
                <Heading size="sm" mb={3} color="green.700">✅ Strengths</Heading>
                <List spacing={2}>
                  {analysisResult.strengths.map((strength, index) => (
                    <ListItem key={index}>• {strength}</ListItem>
                  ))}
                </List>
              </Box>

              {/* Improvements */}
              <Box bg="orange.50" p={4} borderRadius="lg" border="1px solid" borderColor="orange.200">
                <Heading size="sm" mb={3} color="orange.700">⚠️ Areas for Improvement</Heading>
                <List spacing={2}>
                  {analysisResult.improvements.map((improvement, index) => (
                    <ListItem key={index}>• {improvement}</ListItem>
                  ))}
                </List>
              </Box>

              {/* Skill Gaps */}
              <Box bg="red.50" p={4} borderRadius="lg" border="1px solid" borderColor="red.200">
                <Heading size="sm" mb={3} color="red.700">🎯 Skill Gaps</Heading>
                <List spacing={2}>
                  {analysisResult.skillGaps.map((gap, index) => (
                    <ListItem key={index}>• {gap}</ListItem>
                  ))}
                </List>
              </Box>

              {/* Recommendations */}
              <Box bg="purple.50" p={4} borderRadius="lg" border="1px solid" borderColor="purple.200">
                <Heading size="sm" mb={3} color="purple.700">💡 Recommendations</Heading>
                <List spacing={2}>
                  {analysisResult.recommendations.map((recommendation, index) => (
                    <ListItem key={index}>{index + 1}. {recommendation}</ListItem>
                  ))}
                </List>
              </Box>

              {/* Optimized Content */}
              {analysisResult.optimizedContent && (
                <Box bg="gray.50" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Heading size="sm" mb={3}>📝 Optimized Content Sample</Heading>
                  <Textarea
                    value={analysisResult.optimizedContent}
                    isReadOnly
                    rows={8}
                    bg="white"
                    resize="vertical"
                  />
                </Box>
              )}

              {/* Download Button */}
              <Divider />
              <HStack justify="center">
                <Button
                  leftIcon={<DownloadIcon />}
                  colorScheme="blue"
                  onClick={() => handleDownload(generateFullReport(analysisResult), 'resume-analysis-report.txt')}
                >
                  Download Full Report
                </Button>
              </HStack>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            {step === 'results' && (
              <Button variant="outline" onClick={handleStartOver}>
                Analyze Another
              </Button>
            )}
            
            {step === 'input' && (
              <Button
                colorScheme="blue"
                onClick={handleAnalyze}
                isDisabled={!canAnalyze() || isAnalyzing}
                isLoading={isAnalyzing}
                loadingText="Analyzing..."
              >
                Analyze Resume
              </Button>
            )}
            
            <Button variant="ghost" onClick={handleClose}>
              {step === 'results' ? 'Close' : 'Cancel'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};