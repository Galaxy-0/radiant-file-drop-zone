
import React, { useMemo } from "react";
import { X, RotateCw, CheckCircle2, AlertCircle, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileWithProgress, useFileUpload } from "@/contexts/FileUploadContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileItemProps {
  file: FileWithProgress;
  className?: string;
}

function getFileTypeIcon(file: File): JSX.Element {
  return <FileIcon className="h-5 w-5" />;
}

function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function FileItem({ file, className }: FileItemProps) {
  const { removeFile } = useFileUpload();
  
  const fileIcon = useMemo(() => getFileTypeIcon(file.file), [file.file]);
  
  const statusIndicator = useMemo(() => {
    switch (file.status) {
      case "pending":
        return null;
      case "uploading":
        return <RotateCw className="h-5 w-5 animate-spin text-upload-accent" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
  }, [file.status]);

  return (
    <div className={cn(
      "flex items-center justify-between p-3 border rounded-md bg-card transition-all",
      file.status === "error" && "border-destructive/20 bg-destructive/5",
      file.status === "completed" && "border-green-200 bg-green-50",
      className
    )}>
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="flex-shrink-0">
          {fileIcon}
        </div>
        
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-medium truncate">
            {file.file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.file.size)}
            {file.error && <span className="text-destructive ml-2">• {file.error}</span>}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {statusIndicator}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 rounded-full"
          onClick={() => removeFile(file.id)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
      
      {file.status === "uploading" && (
        <div className="absolute bottom-0 left-0 right-0">
          <Progress value={file.progress} className="h-1 rounded-none" />
        </div>
      )}
    </div>
  );
}
