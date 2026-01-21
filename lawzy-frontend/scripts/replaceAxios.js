const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');

const apiMap = {
  '/analyze': 'analyzeQuery(query)',
  '/documents/suggest': 'suggestDocuments(caseData)',
  '/documents/generate': 'generateDocument(caseData, selectedDoc)',
  '/questions/generate': 'generateQuestions(caseData)',
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (fullPath.endsWith('.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

function replaceAxiosCalls(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let replaced = false;

  Object.keys(apiMap).forEach((endpoint) => {
    const regex = new RegExp(`axios\\.post\\(['"\`]http://localhost:8000${endpoint}['"\`],\\s*{[^}]*}\\)`, 'g');
    if (regex.test(content)) {
      replaced = true;
      content = content.replace(regex, apiMap[endpoint]);
    }
  });

  if (replaced) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Updated axios calls in: ${filePath}`);
  }
}

const allFiles = walk(SRC_DIR);
allFiles.forEach(replaceAxiosCalls);

console.log('✨ All done!');
