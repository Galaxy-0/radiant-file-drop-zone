
import React from "react";
import { FileUpload } from "@/components/FileUpload";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            File Upload Component
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            A modern drag & drop file uploader with progress tracking
          </p>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Upload Files</h2>
          <p className="text-gray-500 mb-6">
            Drag and drop files or use the browse button to select files from your device.
            Multiple files are supported.
          </p>
          
          <FileUpload 
            maxFileSize={10 * 1024 * 1024} // 10MB
            allowedFileTypes={["image/*", "application/pdf", "text/*"]}
          />
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Supported file types: Images, PDFs, and text files</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-2">About this component</h3>
          <p className="text-gray-600">
            This is a UI-only implementation. The upload functionality is simulated for demonstration purposes.
            You can integrate with Supabase Storage or any other storage solution later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
