import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Text,
  VStack,
  Icon,
  HStack,
  Button,
  FormLabel,
  useColorModeValue,
} from '@chakra-ui/react';
import { AttachmentIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

interface Props {
  label: string;
  accept: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export const FileUploadZone: React.FC<Props> = ({
  label,
  accept,
  file,
  onFileSelect,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const bg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  return (
    <Box width="100%">
      <FormLabel>{label}</FormLabel>
      <Box
        {...getRootProps()}
        p={6}
        border="2px"
        borderColor={isDragActive ? 'blue.500' : borderColor}
        borderStyle="dashed"
        borderRadius="lg"
        bg={isDragActive ? 'blue.50' : bg}
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ bg: hoverBg }}
        textAlign="center"
      >
        <input {...getInputProps()} />
        
        {file ? (
          <HStack justify="center" spacing={3}>
            <Icon as={CheckIcon} color="green.500" />
            <VStack spacing={1}>
              <Text fontWeight="medium">{file.name}</Text>
              <Text fontSize="sm" color="gray.600">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </Text>
            </VStack>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={handleRemoveFile}
              leftIcon={<CloseIcon />}
            >
              Remove
            </Button>
          </HStack>
        ) : (
          <VStack spacing={3}>
            <Icon as={AttachmentIcon} boxSize={6} color="gray.400" />
            <VStack spacing={1}>
              <Text fontWeight="medium">
                {isDragActive ? 'Drop the file here' : 'Click to upload or drag and drop'}
              </Text>
              <Text fontSize="sm" color="gray.600">
                PDF, DOCX, DOC, TXT (max 10MB)
              </Text>
            </VStack>
          </VStack>
        )}
      </Box>
    </Box>
  );
};