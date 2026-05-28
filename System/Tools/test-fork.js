const { fork } = require('child_process');
const http = require('http');

const URL = 'http://127.0.0.1:19777';

const child = fork('H:/RQBBOX_OS/System/Server/server.js', [], {
  cwd: 'H:/RQBBOX_OS',
  stdio: 'pipe'
});

child.stdout.on('data', d => process.stdout.write(`[out] ${d}`));
child.stderr.on('data', d => process.stderr.write(`[err] ${d}`));
child.on('exit', (code, sig) => console.log(`\n[exit] code=${code} signal=${sig}`));
child.on('error', e => console.log(`\n[error] ${e.message}`));

setTimeout(() => {
  const req = http.get(URL, res => {
    console.log(`\n[test] Status: ${res.statusCode}`);
    res.resume();
    child.kill();
    process.exit(0);
  });
  req.on('error', e => {
    console.log(`\n[test] Error: ${e.message}`);
    child.kill();
    process.exit(1);
  });
  req.setTimeout(5000, () => {
    console.log('\n[test] Timeout');
    req.destroy();
    child.kill();
    process.exit(1);
  });
}, 5000);
