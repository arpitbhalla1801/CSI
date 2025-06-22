# File Management Tool

## Features

- Create Files
- Read Files  
- Delete Files
- List Files
- Web Interface

## Core Modules Used

- http
- fs
- path
- url

## Getting Started

1. Navigate to the project directory:
   ```bash
   cd week2-assignment
   ```

2. Start the server:
   ```bash
   node index.js
   ```

3. Open your browser and go to:
   ```
   http://127.0.0.1:3000
   ```

## API Endpoints

- `GET /`
- `POST /api/create`
- `GET /api/read?fileName=<name>`
- `DELETE /api/delete`
- `GET /api/list`

## Async Functions

- `parseRequestBody(req)`
- `checkFileExists(filePath)`
- `createFileAsync(fileName, content)`
- `readFileAsync(fileName)`
- `deleteFileAsync(fileName)`
- `listFilesAsync()`
