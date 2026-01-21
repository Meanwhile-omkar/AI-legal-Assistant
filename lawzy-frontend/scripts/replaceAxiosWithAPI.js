const fs = require("fs");
const path = require("path");

const PAGES_DIR = path.join(__dirname, "../src/pages");
const API_IMPORT = `import { generateDocument, prefetchSuggestions, generateQuestions, analyzeQuery } from "../api";\n`;

// Helper to replace axios calls
function replaceAxiosCalls(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");

  // Remove any import axios
  content = content.replace(/import\s+axios\s+from\s+['"]axios['"];?\n/, "");

  // Add centralized api import at the top
  if (!content.includes(API_IMPORT)) {
    content = API_IMPORT + content;
  }

  // Replace specific axios calls
  content = content.replace(/axios\.post\([`'"].*?\/documents\/generate['"`],\s*{[^}]+}\)/g, "generateDocument(caseData, selectedDoc)");
  content = content.replace(/axios\.post\([`'"].*?\/documents\/suggest['"`],\s*{[^}]+}\)/g, "prefetchSuggestions(caseData)");
  content = content.replace(/axios\.post\([`'"].*?\/questions\/generate['"`],\s*{[^}]+}\)/g, "generateQuestions(caseData)");
  content = content.replace(/axios\.post\([`'"].*?\/analyze['"`],\s*{[^}]+}\)/g, "analyzeQuery(query)");

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`✅ Updated axios calls in: ${filePath}`);
}

// Recursively go through pages
function updatePages(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      updatePages(fullPath);
    } else if (file.endsWith(".js")) {
      replaceAxiosCalls(fullPath);
    }
  });
}

updatePages(PAGES_DIR);
console.log("✨ All done!");
