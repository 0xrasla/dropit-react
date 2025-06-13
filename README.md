<p align="center">
  <img src="./public/dropit.png" alt="DropIt Logo" width="200" />
</p>

<h1 align="center">DropIt</h1>
<p align="center">A simple, beautiful React drag-and-drop file picker built with shadcn/ui</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#props">Props</a> •
  <a href="#examples">Examples</a> •
  <a href="#license">License</a>
</p>

## Features

- 🖱️ Drag and drop file upload
- 📁 Click to open file dialog
- 🔍 File preview with names and sizes
- 🎯 Customizable file type filtering
- 🎨 Beautiful UI with shadcn components
- 🧩 Simple integration with any React project
- 📱 Fully responsive design

## Installation

This component requires shadcn/ui components and Tailwind CSS. Make sure you have them set up in your project:

```bash
# Install shadcn/ui and required components
npx shadcn-ui@latest init
npx shadcn-ui@latest add card button

# Install clsx for class name merging
bun i clsx
# or with npm
npm install clsx
```

For more information on setting up shadcn/ui, visit the [official documentation](https://ui.shadcn.com/docs/installation).

## Usage

Create a `file-drop-zone.tsx` file in your components directory with the following code:

```tsx
import React, { useCallback, useState } from "react";
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
            acceptedFileTypes.some(
              (type) =>
                file.type.includes(type.replace("*", "")) ||
                file.name.endsWith(type.replace("*", ""))
            )
          )
        : newFiles;

      const updatedFiles =
        maxFiles > 1
          ? [...files, ...validFiles].slice(0, maxFiles)
          : validFiles.slice(0, maxFiles);

      setFiles(updatedFiles);
      onFilesSelected(updatedFiles);

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
```

Then use the component in your application:

```tsx
import { FileDropZone } from "./components/file-drop-zone";

function MyComponent() {
  const handleFilesSelected = (files) => {
    console.log("Selected files:", files);

    // Do something with the files
    // e.g., upload to a server
  };

  return (
    <FileDropZone
      onFilesSelected={handleFilesSelected}
      acceptedFileTypes={[".png", ".jpg"]}
      maxFiles={3}
    />
  );
}
```

## Props

| Prop                | Type                      | Default     | Description                                     |
| ------------------- | ------------------------- | ----------- | ----------------------------------------------- |
| `onFilesSelected`   | `(files: File[]) => void` | Required    | Callback triggered when files are selected      |
| `acceptedFileTypes` | `string[]`                | `[]`        | Array of accepted file extensions or MIME types |
| `maxFiles`          | `number`                  | `1`         | Maximum number of files that can be selected    |
| `className`         | `string`                  | `undefined` | Additional CSS classes to apply                 |

## Examples

### Single Image Upload

```tsx
<FileDropZone
  onFilesSelected={(files) => console.log(files)}
  acceptedFileTypes={[".png", ".jpg", ".jpeg"]}
  maxFiles={1}
/>
```

### Multiple Document Upload

```tsx
<FileDropZone
  onFilesSelected={(files) => console.log(files)}
  acceptedFileTypes={[".pdf", ".doc", ".docx"]}
  maxFiles={5}
/>
```

### Unrestricted File Upload

```tsx
<FileDropZone onFilesSelected={(files) => console.log(files)} />
```

## Additional Notes

- Make sure you have the necessary icons from `lucide-react` installed.
- The component uses the `cn` utility from shadcn/ui for class name merging.
- You can customize the appearance by modifying the Tailwind classes.
- For handling file uploads, you'll need to implement your own upload logic.

## License

MIT © [0xRasla]

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/0xRasla">0xRasla</a>
</p>
