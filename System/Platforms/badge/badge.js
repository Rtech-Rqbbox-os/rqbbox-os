// RQBBOX OS — Dynamic Badge Generator
// Run with: node badge.js [version]
// Generates a shields.io-style SVG badge for GitHub README

const fs = require('fs');
const version = process.argv[2] || 'v1.2.0';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="28" viewBox="0 0 240 28">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0a0e1a"/>
      <stop offset="100%" stop-color="#14161c"/>
    </linearGradient>
    <linearGradient id="acc" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#007bff"/>
      <stop offset="100%" stop-color="#00d4ff"/>
    </linearGradient>
  </defs>
  <rect width="240" height="28" rx="6" fill="url(#bg)" stroke="#1a1e2a" stroke-width="1"/>
  <!-- R logo -->
  <rect x="0" y="0" width="28" height="28" rx="6" fill="url(#acc)"/>
  <text x="14" y="19" text-anchor="middle" font-size="16" font-weight="800" fill="#fff" font-family="Arial">R</text>
  <!-- Label -->
  <text x="38" y="18" font-size="11" fill="#8b9dc3" font-family="Arial,sans-serif" font-weight="500">RQBBOX OS</text>
  <!-- Version -->
  <text x="120" y="18" font-size="11" fill="#00d4ff" font-family="Arial,sans-serif" font-weight="700">${version}</text>
  <!-- Status -->
  <text x="180" y="18" font-size="11" fill="#4cff88" font-family="Arial,sans-serif" font-weight="500">USB GAMING OS</text>
</svg>`;

fs.writeFileSync('badge.svg', svg);
console.log('Generated badge.svg for ' + version);
