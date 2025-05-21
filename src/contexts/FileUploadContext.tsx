
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface FileWithProgress {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

interface FileUploadContextType {
  files: FileWithProgress[];
  addFiles: (filesToAdd: File[]) => void;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  isUploading: boolean;
  simulateUpload: () => void;
}

const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);

export function useFileUpload() {
  const context = useContext(FileUploadContext);
  if (context === undefined) {
    throw new Error("useFileUpload must be used within a FileUploadProvider");
  }
  return context;
}

interface FileUploadProviderProps {
  children: ReactNode;
  maxFileSize?: number; // in bytes
  allowedFileTypes?: string[];
}

export function FileUploadProvider({
  children,
  maxFileSize = 104857600, // 100MB default
  allowedFileTypes = [],
}: FileUploadProviderProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): string | null => {
    if (maxFileSize && file.size > maxFileSize) {
      return `File ${file.name} exceeds maximum size of ${maxFileSize / 1048576}MB`;
    }
    
    if (
      allowedFileTypes.length > 0 &&
      !allowedFileTypes.some(type => file.type.includes(type) || 
        (type.includes('*') && file.type.includes(type.split('/')[0])))
    ) {
      return `File ${file.name} type not allowed`;
    }
    
    return null;
  };

  const addFiles = (filesToAdd: File[]) => {
    const newFiles: FileWithProgress[] = [];
    const errors: string[] = [];

    filesToAdd.forEach(file => {
      const error = validateFile(file);
      
      if (error) {
        errors.push(error);
        return;
      }
      
      // Check if file with same name already exists
      const exists = files.some(existingFile => existingFile.file.name === file.name);
      if (exists) {
        errors.push(`File ${file.name} already added`);
        return;
      }
      
      newFiles.push({
        id: crypto.randomUUID(),
        file,
        progress: 0,
        status: "pending"
      });
    });

    if (errors.length > 0) {
      toast.error(errors.length === 1 ? errors[0] : `${errors.length} files couldn't be added`, {
        description: errors.length > 1 ? errors.join(', ') : undefined
      });
    }

    if (newFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      toast.success(`${newFiles.length} file${newFiles.length === 1 ? '' : 's'} added`);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
  };

  const clearFiles = () => {
    setFiles([]);
  };

  // For demo purposes only - simulates file upload progress
  const simulateUpload = () => {
    if (files.length === 0) {
      toast.error("No files to upload");
      return;
    }

    if (isUploading) {
      return;
    }
    
    setIsUploading(true);
    
    const updatedFiles = files.map(file => ({
      ...file,
      status: file.status === "error" ? "error" : "uploading",
      progress: file.status === "completed" ? 100 : 0
    })) as FileWithProgress[];
    
    setFiles(updatedFiles);

    updatedFiles.forEach(fileData => {
      if (fileData.status === "error") return;
      
      const intervalId = setInterval(() => {
        setFiles(prevFiles => {
          const fileIndex = prevFiles.findIndex(f => f.id === fileData.id);
          if (fileIndex === -1) {
            clearInterval(intervalId);
            return prevFiles;
          }

          const currentFile = prevFiles[fileIndex];
          if (currentFile.progress >= 100) {
            clearInterval(intervalId);
            return prevFiles;
          }

          // Randomly generate progress increment to simulate variable network speeds
          const increment = Math.random() * 10 + 5;
          const newProgress = Math.min(currentFile.progress + increment, 100);
          const newStatus = newProgress >= 100 ? "completed" : "uploading";
          
          // Small chance of error for demonstration
          const simulateError = Math.random() > 0.95;
          
          const updatedFiles = [...prevFiles];
          updatedFiles[fileIndex] = {
            ...currentFile,
            progress: simulateError ? currentFile.progress : newProgress,
            status: simulateError ? "error" : newStatus,
            error: simulateError ? "Simulated upload error" : undefined
          };
          
          if (simulateError && !currentFile.error) {
            toast.error(`Error uploading ${currentFile.file.name}`);
            clearInterval(intervalId);
          } else if (newStatus === "completed" && currentFile.status !== "completed") {
            toast.success(`Uploaded ${currentFile.file.name}`);
          }
          
          return updatedFiles;
        });
      }, 300);
    });

    // Check if all files are complete or errored every second
    const checkCompleteId = setInterval(() => {
      setFiles(prevFiles => {
        const allDone = prevFiles.every(file => 
          file.status === "completed" || file.status === "error"
        );
        
        if (allDone && prevFiles.length > 0) {
          setIsUploading(false);
          clearInterval(checkCompleteId);
        }
        
        return prevFiles;
      });
    }, 1000);
  };

  return (
    <FileUploadContext.Provider
      value={{
        files,
        addFiles,
        removeFile,
        clearFiles,
        isDragging,
        setIsDragging,
        isUploading,
        simulateUpload
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
}
