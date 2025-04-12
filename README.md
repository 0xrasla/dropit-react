<p align="center">
  <img src="./public/dropit-logo.png" alt="DropIt Logo" width="200" />
</p>

<h1 align="center">DropIt</h1>
<p align="center">A simple, beautiful React drag-and-drop file picker built with shadcn/ui</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#api">API</a> •
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

```bash
npm install dropit-ui
# or
yarn add dropit-ui
```

## Usage

```jsx
import { FileDropZone } from "dropit-ui";

function MyComponent() {
  const handleFilesSelected = (files) => {
    console.log("Selected files:", files);
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

## API

| Prop                | Type                      | Default     | Description                                     |
| ------------------- | ------------------------- | ----------- | ----------------------------------------------- |
| `onFilesSelected`   | `(files: File[]) => void` | Required    | Callback triggered when files are selected      |
| `acceptedFileTypes` | `string[]`                | `[]`        | Array of accepted file extensions or MIME types |
| `maxFiles`          | `number`                  | `1`         | Maximum number of files that can be selected    |
| `className`         | `string`                  | `undefined` | Additional CSS classes to apply                 |

## Examples

### Single Image Upload

```jsx
<FileDropZone
  onFilesSelected={(files) => console.log(files)}
  acceptedFileTypes={[".png", ".jpg", ".jpeg"]}
  maxFiles={1}
/>
```

### Multiple Document Upload

```jsx
<FileDropZone
  onFilesSelected={(files) => console.log(files)}
  acceptedFileTypes={[".pdf", ".doc", ".docx"]}
  maxFiles={5}
/>
```

### Unrestricted File Upload

```jsx
<FileDropZone onFilesSelected={(files) => console.log(files)} maxFiles={10} />
```

## License

MIT
