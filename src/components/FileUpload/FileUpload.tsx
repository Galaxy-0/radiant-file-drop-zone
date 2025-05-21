
import React from "react";
import { cn } from "@/lib/utils";
import { FileUploadProvider } from "@/contexts/FileUploadContext";
import { FileUploadArea } from "./FileUploadArea";

interface FileUploadProps {
  className?: string;
  maxFileSize?: number; // in bytes
  allowedFileTypes?: string[]; // e.g. ["image/jpeg", "application/pdf", "image/*"]
}

export function FileUpload({
  className,
  maxFileSize,
  allowedFileTypes,
}: FileUploadProps) {
  return (
    <FileUploadProvider 
      maxFileSize={maxFileSize} 
      allowedFileTypes={allowedFileTypes}
    >
      <div className={cn("w-full", className)}>
        <FileUploadArea />
      </div>
    </FileUploadProvider>
  );
}
