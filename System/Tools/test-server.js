const { execSync, spawn } = require('child_process');

// Kill old node processes
try { execSync('taskkill /F /IM node.exe 2>nul', { stdio: 'ignore' }); } catch {}
require('http').createServer((req, res) => {
  // Simple proxy/fetch that forwards to the real server
  // Not needed - instead, just start the server inline
}).listen(19777);

console.log('Test server');
