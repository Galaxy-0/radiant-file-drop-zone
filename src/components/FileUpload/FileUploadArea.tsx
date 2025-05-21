
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropZone } from "./DropZone";
import { FileList } from "./FileList";
import { useFileUpload } from "@/contexts/FileUploadContext";
import { Upload, Trash2 } from "lucide-react";

interface FileUploadAreaProps {
  className?: string;
}

export function FileUploadArea({ className }: FileUploadAreaProps) {
  const { files, clearFiles, simulateUpload, isUploading } = useFileUpload();
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6 space-y-6">
        <DropZone />
        
        <FileList />
        
        {files.length > 0 && (
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFiles}
              className="text-muted-foreground"
              disabled={isUploading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
            
            <Button 
              onClick={simulateUpload}
              disabled={isUploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Files"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
