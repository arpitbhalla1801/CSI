const http = require('http');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fsSync.existsSync(uploadsDir)) {
    fsSync.mkdirSync(uploadsDir);
}

function sendJSON(res, data, statusCode = 200) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function sendHTML(res, html) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
}

async function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(new Error('Invalid JSON'));
            }
        });
        req.on('error', reject);
    });
}

async function checkFileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function createFileAsync(fileName, content) {
    const filePath = path.join(uploadsDir, fileName);
    
    if (await checkFileExists(filePath)) {
        throw new Error('File already exists');
    }
    
    await fs.writeFile(filePath, content || '', 'utf8');
    return `File '${fileName}' created successfully`;
}

async function readFileAsync(fileName) {
    const filePath = path.join(uploadsDir, fileName);
    
    if (!(await checkFileExists(filePath))) {
        throw new Error('File not found');
    }
    
    const content = await fs.readFile(filePath, 'utf8');
    return content;
}

async function deleteFileAsync(fileName) {
    const filePath = path.join(uploadsDir, fileName);
    
    if (!(await checkFileExists(filePath))) {
        throw new Error('File not found');
    }
    
    await fs.unlink(filePath);
    return `File '${fileName}' deleted successfully`;
}

async function listFilesAsync() {
    const files = await fs.readdir(uploadsDir);
    return files;
}

function getHTMLInterface() {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>File Management Tool</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 800px; margin: 0 auto; }
            .section { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
            button { padding: 10px 15px; margin: 5px; background: #007cba; color: white; border: none; border-radius: 3px; cursor: pointer; }
            button:hover { background: #005a87; }
            input, textarea { padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 3px; }
            textarea { width: 100%; height: 100px; }
            .file-list { margin: 10px 0; }
            .file-item { padding: 10px; margin: 5px 0; background: #f5f5f5; border-radius: 3px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Node.js File Management Tool</h1>
            
            <div class="section">
                <h3>Create File</h3>
                <input type="text" id="createFileName" placeholder="Enter filename (e.g., test.txt)">
                <br>
                <textarea id="createFileContent" placeholder="Enter file content"></textarea>
                <br>
                <button onclick="createFile()">Create File</button>
            </div>

            <div class="section">
                <h3>Read File</h3>
                <input type="text" id="readFileName" placeholder="Enter filename to read">
                <button onclick="readFile()">Read File</button>
                <div id="fileContent"></div>
            </div>

            <div class="section">
                <h3>Delete File</h3>
                <input type="text" id="deleteFileName" placeholder="Enter filename to delete">
                <button onclick="deleteFile()">Delete File</button>
            </div>

            <div class="section">
                <h3>List Files</h3>
                <button onclick="listFiles()">Refresh File List</button>
                <div id="fileList" class="file-list"></div>
            </div>
        </div>

        <script>
            async function createFile() {
                const fileName = document.getElementById('createFileName').value;
                const content = document.getElementById('createFileContent').value;
                
                if (!fileName) {
                    alert('Please enter a filename');
                    return;
                }

                try {
                    const response = await fetch('/api/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fileName, content })
                    });
                    const result = await response.json();
                    alert(result.message);
                    if (result.success) {
                        document.getElementById('createFileName').value = '';
                        document.getElementById('createFileContent').value = '';
                        listFiles();
                    }
                } catch (error) {
                    alert('Error creating file: ' + error.message);
                }
            }

            async function readFile() {
                const fileName = document.getElementById('readFileName').value;
                
                if (!fileName) {
                    alert('Please enter a filename');
                    return;
                }

                try {
                    const response = await fetch('/api/read?fileName=' + encodeURIComponent(fileName));
                    const result = await response.json();
                    
                    if (result.success) {
                        document.getElementById('fileContent').innerHTML = 
                            '<h4>Content of ' + fileName + ':</h4><pre>' + result.content + '</pre>';
                    } else {
                        alert(result.message);
                    }
                } catch (error) {
                    alert('Error reading file: ' + error.message);
                }
            }

            async function deleteFile() {
                const fileName = document.getElementById('deleteFileName').value;
                
                if (!fileName) {
                    alert('Please enter a filename');
                    return;
                }

                if (!confirm('Are you sure you want to delete ' + fileName + '?')) {
                    return;
                }

                try {
                    const response = await fetch('/api/delete', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fileName })
                    });
                    const result = await response.json();
                    alert(result.message);
                    if (result.success) {
                        document.getElementById('deleteFileName').value = '';
                        listFiles();
                    }
                } catch (error) {
                    alert('Error deleting file: ' + error.message);
                }
            }

            async function listFiles() {
                try {
                    const response = await fetch('/api/list');
                    const result = await response.json();
                    
                    if (result.success) {
                        const fileListDiv = document.getElementById('fileList');
                        if (result.files.length === 0) {
                            fileListDiv.innerHTML = '<p>No files found in uploads directory</p>';
                        } else {
                            fileListDiv.innerHTML = result.files.map(file => 
                                '<div class="file-item">' + file + '</div>'
                            ).join('');
                        }
                    } else {
                        alert(result.message);
                    }
                } catch (error) {
                    alert('Error listing files: ' + error.message);
                }
            }

            window.onload = listFiles;
        </script>
    </body>
    </html>
    `;
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (pathname === '/' && method === 'GET') {
        sendHTML(res, getHTMLInterface());
        return;
    }

    if (pathname === '/api/create' && method === 'POST') {
        try {
            const { fileName, content } = await parseRequestBody(req);
            
            if (!fileName) {
                sendJSON(res, { success: false, message: 'Filename is required' }, 400);
                return;
            }

            const message = await createFileAsync(fileName, content);
            sendJSON(res, { success: true, message });
        } catch (error) {
            const statusCode = error.message === 'File already exists' ? 400 : 500;
            sendJSON(res, { success: false, message: error.message }, statusCode);
        }
        return;
    }

    if (pathname === '/api/read' && method === 'GET') {
        try {
            const fileName = parsedUrl.query.fileName;
            
            if (!fileName) {
                sendJSON(res, { success: false, message: 'Filename is required' }, 400);
                return;
            }

            const content = await readFileAsync(fileName);
            sendJSON(res, { success: true, content, message: 'File read successfully' });
        } catch (error) {
            const statusCode = error.message === 'File not found' ? 404 : 500;
            sendJSON(res, { success: false, message: error.message }, statusCode);
        }
        return;
    }

    if (pathname === '/api/delete' && method === 'DELETE') {
        try {
            const { fileName } = await parseRequestBody(req);
            
            if (!fileName) {
                sendJSON(res, { success: false, message: 'Filename is required' }, 400);
                return;
            }

            const message = await deleteFileAsync(fileName);
            sendJSON(res, { success: true, message });
        } catch (error) {
            const statusCode = error.message === 'File not found' ? 404 : 500;
            sendJSON(res, { success: false, message: error.message }, statusCode);
        }
        return;
    }

    if (pathname === '/api/list' && method === 'GET') {
        try {
            const files = await listFilesAsync();
            sendJSON(res, { success: true, files, message: 'Files listed successfully' });
        } catch (error) {
            sendJSON(res, { success: false, message: 'Error listing files: ' + error.message }, 500);
        }
        return;
    }

    sendJSON(res, { success: false, message: 'Route not found' }, 404);
});

server.listen(port, hostname, () => {
    console.log(`File Management Tool running at http://${hostname}:${port}/`);
    console.log('Available endpoints:');
    console.log('- GET  /');
    console.log('- POST /api/create');
    console.log('- GET  /api/read');
    console.log('- DELETE /api/delete');
    console.log('- GET  /api/list');
});