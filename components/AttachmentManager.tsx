"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  File,
  Image as ImageIcon,
  FileText,
  Download,
  Eye,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./ui/ImageWithFallback";

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  preview?: string;
  uploadedAt: string;
  cloudinaryPublicId?: string;
}

interface AttachmentManagerProps {
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

export const AttachmentManager: React.FC<AttachmentManagerProps> = ({
  attachments,
  onAttachmentsChange,
  maxFiles = 10,
  maxFileSize = 10,
  acceptedTypes = [
    "image/*",
    "application/pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".csv",
    ".txt",
  ],
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cloudinary configuration
  const CLOUDINARY_CONFIG = {
    cloudName: "dp7hs0vdz",
    uploadPreset: "genovatehub_blogs",
    folder: "blog_images",
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />;
    if (type === "application/pdf")
      return <FileText className="w-4 h-4 text-red-500" />;
    if (type.includes("word") || type.includes("document"))
      return <FileText className="w-4 h-4 text-blue-500" />;
    if (type.includes("sheet") || type.includes("excel"))
      return <FileText className="w-4 h-4 text-green-500" />;
    return <File className="w-4 h-4" />;
  };

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    // Check file type
    const isAcceptedType = acceptedTypes.some((type) => {
      if (type.startsWith(".")) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      if (type.includes("*")) {
        const baseType = type.split("/")[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isAcceptedType) {
      return "File type not supported";
    }

    // Check max files limit
    if (attachments.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }

    return null;
  };

  // Upload file to Cloudinary
  const uploadToCloudinary = async (
    file: File
  ): Promise<{
    url: string;
    publicId: string;
    preview?: string;
  }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
    formData.append("folder", CLOUDINARY_CONFIG.folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
      preview: file.type.startsWith("image/") ? data.secure_url : undefined,
    };
  };

  // Process files with Cloudinary upload
  const processFiles = async (files: FileList) => {
    if (isUploading) return;

    const validFiles: File[] = [];
    let hasError = false;

    // Validate all files first
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validationError = validateFile(file);

      if (validationError) {
        setUploadError(validationError);
        hasError = true;
        break;
      }

      validFiles.push(file);
    }

    if (hasError || validFiles.length === 0) return;

    setIsUploading(true);
    setUploadError("");
    const newAttachments: Attachment[] = [];

    try {
      // Upload files one by one
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const fileId = `attachment-${Date.now()}-${i}`;

        // Set initial progress
        setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

        try {
          // Simulate progress for better UX
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => ({
              ...prev,
              [fileId]: Math.min((prev[fileId] || 0) + 10, 90),
            }));
          }, 200);

          const cloudinaryResult = await uploadToCloudinary(file);

          clearInterval(progressInterval);
          setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));

          const attachment: Attachment = {
            id: fileId,
            name: file.name,
            type: file.type,
            size: file.size,
            url: cloudinaryResult.url,
            preview: cloudinaryResult.preview,
            uploadedAt: new Date().toISOString(),
            cloudinaryPublicId: cloudinaryResult.publicId,
          };

          newAttachments.push(attachment);
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          setUploadError(`Failed to upload ${file.name}. Please try again.`);
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
          break;
        }
      }

      if (newAttachments.length > 0) {
        onAttachmentsChange([...attachments, ...newAttachments]);
      }
    } finally {
      setIsUploading(false);
      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress({});
      }, 1000);
    }
  };

  // Handle file input change
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle drag and drop
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  // Remove attachment
  const removeAttachment = async (attachmentId: string) => {
    const attachment = attachments.find((a) => a.id === attachmentId);
    if (attachment) {
      // If it's a Cloudinary upload, we could delete it from Cloudinary here
      // For now, we'll just remove it from the local state
      if (attachment.cloudinaryPublicId) {
        // Optional: Delete from Cloudinary
        // This would require the Cloudinary admin API and is typically done on the backend
        console.log(
          "Removing Cloudinary asset:",
          attachment.cloudinaryPublicId
        );
      } else {
        // Revoke object URL for local files
        URL.revokeObjectURL(attachment.url);
      }
    }
    onAttachmentsChange(attachments.filter((a) => a.id !== attachmentId));
  };

  // Download attachment
  const downloadAttachment = (attachment: Attachment) => {
    const link = document.createElement("a");
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Preview attachment
  const previewAttachment = (attachment: Attachment) => {
    window.open(attachment.url, "_blank");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
          isDragging
            ? "border-blue-400 bg-blue-50 scale-[1.02]"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-2">
          <div
            className={`p-3 rounded-full ${
              isDragging
                ? "bg-blue-100"
                : isUploading
                ? "bg-yellow-100"
                : "bg-gray-100"
            }`}
          >
            <Upload
              className={`w-6 h-6 ${
                isDragging
                  ? "text-blue-500"
                  : isUploading
                  ? "text-yellow-500 animate-pulse"
                  : "text-gray-400"
              }`}
            />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {isUploading
                ? "Uploading files..."
                : isDragging
                ? "Drop files here"
                : "Click to upload or drag and drop"}
            </p>
            <p className="mt-1 text-gray-500 text-sm">
              {acceptedTypes.includes("image/*") ? "Images, " : ""}
              PDF, Word, Excel, CSV files up to {maxFileSize}MB
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {attachments.length}/{maxFiles} files
          </Badge>
        </div>
      </div>

      {/* Upload Error */}
      {uploadError && (
        <div className="bg-red-50 p-3 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{uploadError}</p>
        </div>
      )}

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 text-sm">Uploading...</h4>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="space-y-1">
              <div className="flex justify-between text-gray-600 text-xs">
                <span>Uploading file...</span>
                <span>{progress}%</span>
              </div>
              <div className="bg-gray-200 rounded-full w-full h-1">
                <div
                  className="bg-blue-500 rounded-full h-1 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 text-sm">
            Attached Files ({attachments.length})
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="group flex items-center gap-3 bg-gray-50 hover:bg-gray-100 p-3 border border-gray-200 rounded-lg transition-colors"
              >
                {/* File Icon/Preview */}
                <div className="flex-shrink-0">
                  {attachment.preview ? (
                    <div className="border border-gray-200 rounded w-10 h-10 overflow-hidden">
                      <ImageWithFallback
                        src={attachment.preview}
                        alt={attachment.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center bg-white border border-gray-200 rounded w-10 h-10">
                      {getFileIcon(attachment.type)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {attachment.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-500 text-xs">
                      {formatFileSize(attachment.size)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {attachment.type.split("/")[1] || attachment.type}
                    </Badge>
                    {attachment.cloudinaryPublicId && (
                      <Badge
                        variant="secondary"
                        className="bg-green-50 text-green-700 text-xs"
                      >
                        Uploaded
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {attachment.preview && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        previewAttachment(attachment);
                      }}
                      className="p-0 w-8 h-8"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadAttachment(attachment);
                    }}
                    className="p-0 w-8 h-8"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAttachment(attachment.id);
                    }}
                    className="hover:bg-red-50 p-0 w-8 h-8 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
