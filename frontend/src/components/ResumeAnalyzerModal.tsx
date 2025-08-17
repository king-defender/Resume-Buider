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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Textarea,
  FormControl,
  FormLabel,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Progress,
} from '@chakra-ui/react';
import { AnalysisResult, AIService } from '../types';
import { aiApi } from '../utils/api';
import { FileUploadZone } from './FileUploadZone';
import { AnalysisResults } from './AnalysisResults';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (result: AnalysisResult | null) => void;
}

export const ResumeAnalyzerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAnalysisComplete,
}) => {
  const [aiServices, setAiServices] = useState<AIService[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescText, setJobDescText] = useState<string>('');
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
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
      const availableService = services.find(s => s.available);
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
    setResumeFile(null);
    setJobDescFile(null);
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
      let result;
      
      if (inputMode === 'file') {
        if (!resumeFile || !jobDescFile) {
          throw new Error('Please upload both resume and job description files');
        }
        result = await aiApi.analyzeWithFiles(resumeFile, jobDescFile, selectedService);
      } else {
        if (!resumeText.trim() || !jobDescText.trim()) {
          throw new Error('Please provide both resume and job description text');
        }
        result = await aiApi.analyzeWithText(resumeText, jobDescText, selectedService);
      }

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
    if (!selectedService) return false;
    
    if (inputMode === 'file') {
      return resumeFile && jobDescFile;
    } else {
      return resumeText.trim() && jobDescText.trim();
    }
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>
          <HStack justify="space-between">
            <Text>Multi-AI Resume Analyzer</Text>
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

              {/* Input Mode Selection */}
              <Tabs 
                index={inputMode === 'file' ? 0 : 1}
                onChange={(index) => setInputMode(index === 0 ? 'file' : 'text')}
                colorScheme="blue"
              >
                <TabList>
                  <Tab>Upload Files</Tab>
                  <Tab>Paste Text</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <VStack spacing={4}>
                      <FileUploadZone
                        label="Upload Resume"
                        accept=".pdf,.docx,.doc,.txt"
                        file={resumeFile}
                        onFileSelect={setResumeFile}
                      />
                      <FileUploadZone
                        label="Upload Job Description"
                        accept=".pdf,.docx,.doc,.txt"
                        file={jobDescFile}
                        onFileSelect={setJobDescFile}
                      />
                    </VStack>
                  </TabPanel>
                  
                  <TabPanel>
                    <VStack spacing={4}>
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
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>

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
            <AnalysisResults result={analysisResult} />
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