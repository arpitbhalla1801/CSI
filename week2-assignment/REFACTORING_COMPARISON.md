# Code Comparison

## Before

```javascript
if (pathname === '/api/create' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        try {
            const { fileName, content } = JSON.parse(body);
            
            if (!fileName) {
                sendJSON(res, { success: false, message: 'Filename is required' }, 400);
                return;
            }

            const filePath = path.join(uploadsDir, fileName);
            
            if (fs.existsSync(filePath)) {
                sendJSON(res, { success: false, message: 'File already exists' }, 400);
                return;
            }

            fs.writeFileSync(filePath, content || '');
            sendJSON(res, { success: true, message: `File '${fileName}' created successfully` });
        } catch (error) {
            sendJSON(res, { success: false, message: 'Error creating file: ' + error.message }, 500);
        }
    });
    return;
}
```

## After

```javascript
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

async function createFileAsync(fileName, content) {
    const filePath = path.join(uploadsDir, fileName);
    
    if (await checkFileExists(filePath)) {
        throw new Error('File already exists');
    }
    
    await fs.writeFile(filePath, content || '', 'utf8');
    return `File '${fileName}' created successfully`;
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
```
