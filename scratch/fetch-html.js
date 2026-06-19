const fs = require('fs');
const http = require('http');

const url = 'http://localhost:3000/uploads/learning-content-files/1780482835900-671635248.html';

const fetch = (url) => {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
  });
};

fetch(url)
  .then(html => {
    console.log("HTML length:", html.length);
    // Find style tags
    const styleTags = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
    console.log("Number of style tags:", styleTags.length);
    styleTags.forEach((tag, idx) => {
      console.log(`\n--- Style Tag ${idx + 1} (first 200 chars) ---`);
      console.log(tag.slice(0, 200));
    });
    // Check if there are body or layout styles in the HTML
    const bodyStyles = html.match(/body\s*{[^}]*}/gi);
    console.log("Body styles matches:", bodyStyles);
  })
  .catch(err => {
    console.error("Error:", err);
  });
