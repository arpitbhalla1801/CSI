const http = require('http');

async function testAPI() {
    console.log('🧪 Testing Refactored Async/Await API...\n');

    try {
        console.log('1️⃣ Testing file creation...');
        const timestamp = Date.now();
        const fileName = `async-test-${timestamp}.txt`;
        const createResponse = await makeRequest('POST', '/api/create', {
            fileName: fileName,
            content: 'This file was created using async/await!'
        });
        console.log('✅ Create result:', createResponse.message);

        console.log('\n2️⃣ Testing file reading...');
        const readResponse = await makeRequest('GET', `/api/read?fileName=${fileName}`);
        console.log('✅ File content:', readResponse.content);

        console.log('\n3️⃣ Testing file listing...');
        const listResponse = await makeRequest('GET', '/api/list');
        console.log('✅ Files found:', listResponse.files);

        console.log('\n4️⃣ Testing file deletion...');
        const deleteResponse = await makeRequest('DELETE', '/api/delete', {
            fileName: fileName
        });
        console.log('✅ Delete result:', deleteResponse.message);

        console.log('\n5️⃣ Testing error handling...');
        try {
            await makeRequest('GET', `/api/read?fileName=${fileName}`);
        } catch (error) {
            console.log('✅ Error handling works:', error.message);
        }

        console.log('\n🎉 All tests completed successfully!');
        console.log('The refactored async/await code is working perfectly!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    if (response.success) {
                        resolve(response);
                    } else {
                        reject(new Error(response.message));
                    }
                } catch (error) {
                    reject(new Error('Invalid JSON response'));
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

setTimeout(testAPI, 2000);
