const fs = require('fs');
const path = require('path');

const folders = [
    path.join(__dirname, 'frontend', 'src'),
    path.join(__dirname, 'backend', 'src')
];

const outputMd = path.join(__dirname, 'Complete_Codebase.md');

let markdownContent = '# Complete Codebase for Service Connect App\n\n';

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
                markdownContent += `## File: \`${relPath}\`\n\n`;
                const ext = path.extname(file).substring(1);
                let syntax = 'javascript';
                if (['ts', 'tsx'].includes(ext)) syntax = 'typescript';
                else if (ext === 'css') syntax = 'css';
                else if (ext === 'html') syntax = 'html';
                
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    markdownContent += `\`\`\`${syntax}\n${content}\n\`\`\`\n\n`;
                } catch (e) {
                    markdownContent += `*Error reading file: ${e.message}*\n\n`;
                }
            }
        }
    }
}

for (const folder of folders) {
    traverseDirectory(folder);
}

fs.writeFileSync(outputMd, markdownContent, 'utf8');
console.log('Markdown generated at Complete_Codebase.md');
