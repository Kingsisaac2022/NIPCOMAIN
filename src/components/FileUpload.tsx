import React, { useState } from 'react';
import { Upload, Check, X, FileText } from 'lucide-react';
import Button from './Button';

interface FileUploadProps {
  label: string;
  onFileSelected: (file: File) => void;
  accept?: string;
  required?: boolean;
  error?: string;
  id?: string;
  preview?: string;
  currentFileName?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onFileSelected,
  accept = "application/pdf",
  required = false,
  error,
  id,
  preview,
  currentFileName
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(preview);
  
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      onFileSelected(selectedFile);
      
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      }
    }
  };
  
  const clearFile = () => {
    setFile(null);
    setPreviewUrl(undefined);
  };
  
  return (
    <div className="mb-4">
      <label htmlFor={fieldId} className="label">
        {label} {required && <span className="text-error">*</span>}
      </label>
      
      {!file && !currentFileName ? (
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-primary transition-all cursor-pointer">
          <input
            id={fieldId}
            type="file"
            onChange={handleFileChange}
            accept={accept}
            required={required}
            className="hidden"
          />
          <label htmlFor={fieldId} className="cursor-pointer flex flex-col items-center">
            <Upload size={24} className="text-primary mb-2" />
            <span className="text-text-secondary">Click to upload {label}</span>
            <span className="text-xs text-text-secondary mt-1">
              {accept === "application/pdf" ? "PDF files only" : accept.replace(/\./g, '').toUpperCase()}
            </span>
          </label>
        </div>
      ) : (
        <div className="border-2 border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FileText size={20} className="text-primary mr-2" />
              <span className="font-medium">
                {file ? file.name : currentFileName || "File uploaded"}
              </span>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={clearFile}
              icon={<X size={16} />}
            >
              Remove
            </Button>
          </div>
          
          {previewUrl && (
            <div className="mt-2 rounded-lg overflow-hidden">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-48 mx-auto object-contain" 
              />
            </div>
          )}
        </div>
      )}
      
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FileUpload;