const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const folders = [
    path.join(__dirname, 'frontend', 'src'),
    path.join(__dirname, 'backend', 'src')
];

const outputPdf = path.join(__dirname, 'Complete_Codebase.pdf');

const doc = new PDFDocument({ margin: 40, size: 'A4' });
doc.pipe(fs.createWriteStream(outputPdf));

doc.font('Courier').fontSize(10);

let textContent = 'Complete Codebase for Service Connect App\n\n';

function traverseDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            traverseDirectory(fullPath);
        } else {
            if (file.match(/\.(ts|tsx|css|js|jsx|html)$/)) {
                const relPath = path.relative(__dirname, fullPath);
                textContent += `=======================================================\n`;
                textContent += `File: ${relPath}\n`;
                textContent += `=======================================================\n\n`;
                
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    textContent += content + `\n\n\n`;
                } catch (e) {
                    textContent += `*Error reading file: ${e.message}*\n\n\n`;
                }
            }
        }
    }
}

for (const folder of folders) {
    traverseDirectory(folder);
}

// Write the whole text into the PDF
// `doc.text` automatically handles page breaks and wrapping.
doc.text(textContent, {
  lineBreak: true
});

doc.end();

console.log('PDF generated successfully at Complete_Codebase.pdf (Plain Text Mode)');
