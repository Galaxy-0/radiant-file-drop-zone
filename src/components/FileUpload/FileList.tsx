
import React from "react";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/contexts/FileUploadContext";
import { FileItem } from "./FileItem";

interface FileListProps {
  className?: string;
}

export function FileList({ className }: FileListProps) {
  const { files } = useFileUpload();

  if (files.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {files.map(file => (
        <FileItem key={file.id} file={file} className="relative" />
      ))}
    </div>
  );
}
