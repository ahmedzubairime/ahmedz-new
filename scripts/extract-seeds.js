const fs = require('fs');
const path = require('path');

async function main() {
  const inputFile = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\8ca0ac20-56de-44b5-93cf-df3e362b93b0\\.system_generated\\steps\\51\\output.txt';
  const outDir = path.join(__dirname, '..', 'src', 'db', 'seed-data');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  try {
    const rawContent = fs.readFileSync(inputFile, 'utf-8');
    const rootParsed = JSON.parse(rawContent);
    const resultStr = rootParsed.result;
    
    // Find where the JSON array inside the untrusted block starts
    const jsonStart = resultStr.indexOf('[');
    const jsonEnd = resultStr.lastIndexOf(']');
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('Could not find JSON array in output');
      return;
    }

    const jsonString = resultStr.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonString);
    const dataObj = parsed[0].data;

    for (const [key, value] of Object.entries(dataObj)) {
      if (value) {
        fs.writeFileSync(
          path.join(outDir, `${key}.json`),
          JSON.stringify(value, null, 2)
        );
        console.log(`Successfully generated ${key}.json with ${value.length} rows`);
      }
    }
  } catch (error) {
    console.error('Extraction failed:', error);
  }
}

main();
