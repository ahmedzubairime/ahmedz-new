const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'src/components/cms');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Add imports if missing
    if (!content.includes('PlayfulModal')) {
        // Find last import
        const lastImportIndex = content.lastIndexOf('import ');
        let endOfLastImport = content.indexOf('\n', lastImportIndex) + 1;
        if (lastImportIndex === -1) endOfLastImport = 0;

        const importsToAdd = `import { PlayfulInput, PlayfulTextarea, PlayfulSelect, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";\nimport { PlayfulModal } from "@/components/ui/PlayfulModal";\n`;
        content = content.slice(0, endOfLastImport) + importsToAdd + content.slice(endOfLastImport);
    }

    // 1. Replace modal wrappers
    // This is tricky because the modal wrapper could be anything, but usually they have:
    // {isModalOpen && ( <div className="fixed ..."> ... <div className="...bg-white..."> <h2>Title</h2> ... <form> ... </form> ... </div></div> )}
    // Let's use regex to find `{is\w+Open && (\begin{div}... \end{div})}`? Too hard with nested divs.

}

const files = fs.readdirSync(DIR);
for (const file of files) {
    if (file.endsWith('.tsx')) {
        processFile(path.join(DIR, file));
    }
}
