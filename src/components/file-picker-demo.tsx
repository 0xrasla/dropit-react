import { useState } from "react";
import { FileDropZone } from "./file-drop-zone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function FilePickerDemo() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    console.log("Selected files:", selectedFiles);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>File Upload</CardTitle>
        <CardDescription>
          Drag and drop files or click to browse
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileDropZone
          onFilesSelected={handleFilesSelected}
          acceptedFileTypes={[".png", ".jpg", ".jpeg", ".pdf"]}
          maxFiles={3}
        />

        {files.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium">Selected Files:</p>
            <ul className="text-sm text-muted-foreground">
              {files.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
