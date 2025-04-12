import { useState } from "react";
import { CopyToClipboard } from "./components/copy-to-clipboard";
import { FileDropZone } from "./components/file-drop-zone";
import { Navbar } from "./components/navbar";
import { ThemeProvider, useTheme } from "./components/theme-provider";

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { theme } = useTheme();

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);

    if (
      selectedFiles.length > 0 &&
      selectedFiles[0].type.startsWith("image/")
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFiles[0]);
    } else {
      setImagePreview(null);
    }
  };

  const componentCode = `import React, { useCallback, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { FileIcon, UploadIcon, XIcon } from "lucide-react";
import { cn } from "../lib/utils";

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
            acceptedFileTypes.some((type) => 
              file.type.includes(type.replace("*", "")) || 
              file.name.endsWith(type.replace("*", ""))
            )
          )
        : newFiles;

      const updatedFiles = maxFiles > 1 
        ? [...files, ...validFiles].slice(0, maxFiles)
        : validFiles.slice(0, maxFiles);
        
      setFiles(updatedFiles);
      onFilesSelected(updatedFiles);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
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
    <Card
      className={cn(
        "w-full",
        className
      )}
    >
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
              Drag & drop {maxFiles > 1 ? "files" : "a file"} here, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              {acceptedFileTypes.length > 0
                ? \`Accepts: \${acceptedFileTypes.join(", ")}\`
                : "All file types supported"}
              {maxFiles > 1 ? \` (max \${maxFiles} files)\` : ""}
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
                  key={\`\${file.name}-\${index}\`} 
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
}`;

  const usageCode = `import { FileDropZone } from './components/file-drop-zone';

function MyComponent() {
  const handleFilesSelected = (files) => {
    console.log('Selected files:', files);
    
    // Do something with the files
    // e.g., upload to a server
  };

  return (
    <FileDropZone
      onFilesSelected={handleFilesSelected}
      acceptedFileTypes={['.png', '.jpg']}
      maxFiles={3}
    />
  );
}`;

  const installShadcnCommand = `npx shadcn-ui@latest init
npx shadcn-ui@latest add card button`;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="container mx-auto px-4 py-2 pb-10 max-w-4xl">
        <Navbar />
        <header className="text-center my-10">
          <h1 className="text-3xl font-bold mb-2">DropIt</h1>
          <p className="text-gray-500">
            A simple, beautiful React drag-and-drop file picker
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Basic Example</h2>
          <div className="mb-8">
            <FileDropZone
              onFilesSelected={handleFilesSelected}
              acceptedFileTypes={[".png", ".jpg", ".jpeg", ".gif"]}
              maxFiles={3}
            />
          </div>

          {imagePreview && (
            <div className="mt-6 p-4 border rounded-md">
              <h3 className="text-md font-medium mb-2">Preview:</h3>
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-60 rounded-md mx-auto"
              />
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">File Details:</h3>
              <div className="bg-gray-50 p-4 rounded-md overflow-auto dark:bg-gray-800">
                <pre className="text-sm">
                  {JSON.stringify(
                    files.map((file) => ({
                      name: file.name,
                      type: file.type,
                      size: `${(file.size / 1024).toFixed(2)} KB`,
                    })),
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Documentation</h2>

          <div className="prose max-w-none space-y-6">
            <div className="space-y-2">
              <h3>Prerequisites</h3>
              <p>
                This component requires shadcn/ui components and Tailwind CSS.
                Make sure you have them set up in your project.
              </p>

              <div className="relative">
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto dark:bg-gray-800">
                  <CopyToClipboard text={installShadcnCommand} />
                  <code>{installShadcnCommand}</code>
                </pre>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                For more information on setting up shadcn/ui, visit the{" "}
                <a
                  href="https://ui.shadcn.com/docs/installation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  official documentation
                </a>
                .
              </p>
            </div>

            <div className="space-y-2">
              <h3>Component Source Code</h3>
              <p>
                Copy and paste this code into{" "}
                <code>components/file-drop-zone.tsx</code>:
              </p>

              <div className="relative">
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm dark:bg-gray-800 ">
                  <CopyToClipboard text={componentCode} />
                  <code className="language-typescript">{componentCode}</code>
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <h3>Usage Example</h3>
              <p>Here's how to use the component in your application:</p>

              <div className="relative">
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm dark:bg-gray-800">
                  <CopyToClipboard text={usageCode} />
                  <code className="language-typescript">{usageCode}</code>
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <h3>Props</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2 border">Prop</th>
                    <th className="text-left p-2 border">Type</th>
                    <th className="text-left p-2 border">Default</th>
                    <th className="text-left p-2 border">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border">
                      <code>onFilesSelected</code>
                    </td>
                    <td className="p-2 border">
                      <code>(files: File[]) =&gt; void</code>
                    </td>
                    <td className="p-2 border">Required</td>
                    <td className="p-2 border">
                      Callback triggered when files are selected
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border">
                      <code>acceptedFileTypes</code>
                    </td>
                    <td className="p-2 border">
                      <code>string[]</code>
                    </td>
                    <td className="p-2 border">
                      <code>[]</code>
                    </td>
                    <td className="p-2 border">
                      Array of accepted file extensions or MIME types
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border">
                      <code>maxFiles</code>
                    </td>
                    <td className="p-2 border">
                      <code>number</code>
                    </td>
                    <td className="p-2 border">
                      <code>1</code>
                    </td>
                    <td className="p-2 border">
                      Maximum number of files that can be selected
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border">
                      <code>className</code>
                    </td>
                    <td className="p-2 border">
                      <code>string</code>
                    </td>
                    <td className="p-2 border">
                      <code>undefined</code>
                    </td>
                    <td className="p-2 border">
                      Additional CSS classes to apply
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-2">
              <h3>Additional Notes</h3>
              <ul className="list-disc pl-6">
                <li>
                  Make sure you have the necessary icons from{" "}
                  <code>lucide-react</code> installed.
                </li>
                <li>
                  The component uses the <code>cn</code> utility from shadcn/ui
                  for class name merging.
                </li>
                <li>
                  You can customize the appearance by modifying the Tailwind
                  classes.
                </li>
                <li>
                  For handling file uploads, you'll need to implement your own
                  upload logic.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="text-center text-gray-500 text-sm mt-20">
          <p>© {new Date().getFullYear()} DropIt - MIT License</p>
          <a
            href="https://github.com/0xrasla/dropit-react"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            GitHub Repository
          </a>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
