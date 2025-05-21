
import React, { useRef, useState } from "react";
import { Upload, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/contexts/FileUploadContext";
import { Button } from "@/components/ui/button";

interface DropZoneProps {
  className?: string;
}

export function DropZone({ className }: DropZoneProps) {
  const { addFiles, isDragging, setIsDragging } = useFileUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      addFiles(filesArray);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      addFiles(filesArray);
      
      // Reset the input so the same file can be selected again if needed
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };
  
  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-4 transition-all",
        isDragging 
          ? "border-upload-accent bg-upload-bg animate-pulse-border" 
          : "border-gray-300 hover:border-upload-accent",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={cn(
        "w-16 h-16 rounded-full bg-upload-bg flex items-center justify-center text-upload-accent transition-transform",
        isDragging ? "animate-upload-bounce" : ""
      )}>
        <Upload size={24} className="text-upload-accent" />
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-medium">Drag & Drop Files</h3>
        <p className="text-sm text-muted-foreground">
          or
        </p>
      </div>
      
      <Button 
        onClick={handleButtonClick}
        variant="outline"
        className="mt-2 border-upload-accent text-upload-accent hover:bg-upload-bg"
      >
        <FileIcon className="mr-2 h-4 w-4" />
        Browse Files
      </Button>
      
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
