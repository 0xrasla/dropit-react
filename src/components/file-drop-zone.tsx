import { FileIcon, UploadIcon, XIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  className?: string;
}

export function FileDropZone({
  onFilesSelected,
  acceptedFileTypes = [],
  maxFiles = 1,
  className,
}: FileDropZoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const acceptedFileTypesString = acceptedFileTypes.join(",");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;

      const newFiles = Array.from(selectedFiles);
      const validFiles = acceptedFileTypes.length
        ? newFiles.filter((file) =>
            acceptedFileTypes.some(
              (type) =>
                file.type.includes(type.replace("*", "")) ||
                file.name.endsWith(type.replace("*", ""))
            )
          )
        : newFiles;

      // Replace the existing files instead of combining them
      const updatedFiles =
        maxFiles > 1
          ? [...files, ...validFiles].slice(0, maxFiles) // For multiple file mode, add to existing but respect maxFiles
          : validFiles.slice(0, maxFiles); // For single file mode, replace existing files

      setFiles(updatedFiles);
      onFilesSelected(updatedFiles);

      // Reset the file input value so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [files, maxFiles, acceptedFileTypes, onFilesSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileChange(e.dataTransfer.files);
    },
    [handleFileChange]
  );

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            files.length > 0 ? "pb-2" : ""
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files)}
            accept={acceptedFileTypesString}
            multiple={maxFiles > 1}
          />

          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <UploadIcon className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm font-medium">
              Drag & drop {maxFiles > 1 ? "files" : "a file"} here, or click to
              select
            </p>
            <p className="text-xs text-muted-foreground">
              {acceptedFileTypes.length > 0
                ? `Accepts: ${acceptedFileTypes.join(", ")}`
                : "All file types supported"}
              {maxFiles > 1 ? ` (max ${maxFiles} files)` : ""}
            </p>

            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
            >
              Select file{maxFiles > 1 ? "s" : ""}
            </Button>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-2 rounded-md border border-border p-2 bg-background"
                >
                  <FileIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
