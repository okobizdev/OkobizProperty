// Production entry point - checks for compiled version first
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist', 'server.js');
const srcPath = path.join(__dirname, 'server.ts');

if (fs.existsSync(distPath)) {
  // Use compiled version if available
  require('./dist/server.js');
} else {
  // Fallback to TypeScript with ts-node
  require('ts-node/register');
  require('./server.ts');
}
