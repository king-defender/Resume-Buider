import React, { useState } from 'react';
import {
  Container,
  Heading,
  Text,
  VStack,
  Button,
  useDisclosure,
  Box,
} from '@chakra-ui/react';
import { SimpleResumeAnalyzer } from './components/SimpleResumeAnalyzer';

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [analysisResult, setAnalysisResult] = useState(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc' }}>
      <Container maxW="6xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" py={8}>
            <Heading size="2xl" color="blue.600" mb={4}>
              AI-Powered Resume Builder MVP
            </Heading>
            <Text fontSize="xl" color="gray.600" mb={8}>
              Optimize your resume with advanced AI analysis
            </Text>
            <Button
              size="lg"
              colorScheme="blue"
              onClick={onOpen}
            >
              Analyze My Resume
            </Button>
          </Box>

          {/* Features */}
          <Box bg="white" p={8} rounded="lg" shadow="sm">
            <Heading size="lg" mb={6}>Key Features</Heading>
            <VStack spacing={4} align="start">
              <Text>🤖 <strong>Multi-AI Analysis:</strong> Choose from OpenAI GPT, Notion AI, GitHub Copilot, and more</Text>
              <Text>📄 <strong>Text Input Support:</strong> Paste your resume and job description text</Text>
              <Text>🎯 <strong>Job-Specific Optimization:</strong> Tailor your resume to specific job descriptions</Text>
              <Text>💡 <strong>Actionable Insights:</strong> Get specific recommendations for improvement</Text>
              <Text>📊 <strong>Skill Gap Analysis:</strong> Identify missing skills and get learning suggestions</Text>
              <Text>💾 <strong>Export Results:</strong> Download your analysis and optimized content</Text>
            </VStack>
          </Box>

          {/* Analysis Results */}
          {analysisResult && (
            <Box bg="white" p={8} rounded="lg" shadow="sm">
              <Heading size="lg" mb={4}>Latest Analysis Results</Heading>
              <Text color="gray.600">
                Your resume has been analyzed! Check the results below.
              </Text>
            </Box>
          )}
        </VStack>
      </Container>

      {/* Resume Analyzer */}
      <SimpleResumeAnalyzer 
        isOpen={isOpen} 
        onClose={onClose} 
        onAnalysisComplete={setAnalysisResult}
      />
    </div>
  );
}

export default App;
