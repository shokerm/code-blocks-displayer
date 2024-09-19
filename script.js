document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.getElementById('codeInput');
    const displayButton = document.getElementById('displayButton');
    const screenshotButton = document.getElementById('screenshotButton');
    const codeBlock = document.getElementById('codeBlock');
    const languageSelect = document.getElementById('languageSelect');
    const codeDisplayWrapper = document.getElementById('codeDisplayWrapper');

    displayButton.addEventListener('click', () => {
        const code = codeInput.value;
        const language = languageSelect.value;
        
        let formattedCode = code;
        
        try {
            switch (language) {
                case 'javascript':
                    formattedCode = prettier.format(code, {
                        parser: 'babel',
                        plugins: prettierPlugins,
                        printWidth: 80,
                        tabWidth: 2,
                        singleQuote: true,
                        trailingComma: 'es5',
                    });
                    break;
                case 'html':
                    formattedCode = prettier.format(code, {
                        parser: 'html',
                        plugins: prettierPlugins,
                        printWidth: 80,
                        tabWidth: 2,
                    });
                    break;
                case 'css':
                    formattedCode = prettier.format(code, {
                        parser: 'css',
                        plugins: prettierPlugins,
                        printWidth: 80,
                        tabWidth: 2,
                    });
                    break;
                case 'python':
                    formattedCode = formatPython(code);
                    break;
                case 'csharp':
                    formattedCode = formatCSharp(code);
                    break;
            }
        } catch (error) {
            console.error('Formatting error:', error);
            formattedCode = code; // Use original code if formatting fails
        }
        
        // Remove previous classes
        codeBlock.className = '';
        
        // Add new language class
        codeBlock.classList.add(`language-${language}`);
        
        // Set the formatted code content
        codeBlock.textContent = formattedCode;
        
        // Highlight the code
        Prism.highlightElement(codeBlock);

        // Refresh line numbers
        Prism.plugins.lineNumbers.resize(codeBlock);
    });

    screenshotButton.addEventListener('click', () => {
        html2canvas(codeDisplayWrapper, {
            backgroundColor: null,
            scale: 2 // Increase resolution
        }).then(canvas => {
            // Create a new canvas with padding
            const paddedCanvas = document.createElement('canvas');
            const ctx = paddedCanvas.getContext('2d');
            paddedCanvas.width = canvas.width + 40;
            paddedCanvas.height = canvas.height + 40;
            
            // Fill with a background color (e.g., light gray)
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
            
            // Draw the original canvas in the center of the new canvas
            ctx.drawImage(canvas, 20, 20);

            // Create a temporary link element
            const link = document.createElement('a');
            link.download = 'polacode_screenshot.png';
            link.href = paddedCanvas.toDataURL();
            
            // Trigger the download
            link.click();
        });
    });

    function formatPython(code) {
        const lines = code.split('\n');
        let formattedLines = [];
        let indentLevel = 0;
        const indentSize = 4;

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.endsWith(':')) {
                formattedLines.push(' '.repeat(indentLevel * indentSize) + trimmedLine);
                indentLevel++;
            } else if (trimmedLine.startsWith('return') || trimmedLine.startsWith('break') || trimmedLine.startsWith('continue') || trimmedLine.startsWith('pass')) {
                indentLevel = Math.max(0, indentLevel - 1);
                formattedLines.push(' '.repeat(indentLevel * indentSize) + trimmedLine);
            } else if (trimmedLine === '') {
                formattedLines.push('');
            } else {
                formattedLines.push(' '.repeat(indentLevel * indentSize) + trimmedLine);
            }
        });

        return formattedLines.join('\n');
    }

    function formatCSharp(code) {
        const lines = code.split('\n');
        let formattedLines = [];
        let indentLevel = 0;
        const indentSize = 4;

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.endsWith('{')) {
                formattedLines.push(' '.repeat(indentLevel * indentSize) + trimmedLine);
                indentLevel++;
            } else if (trimmedLine.startsWith('}')) {
                indentLevel = Math.max(0, indentLevel - 1);
                formattedLines.push(' '.repeat(indentLevel * indentSize) + trimmedLine);
            } else if (trimmedLine === '') {
                formattedLines.push('');
            } else {
                formattedLines.push(' '.repeat(indentLevel * indentSize) + trimmedLine);
            }
        });

        return formattedLines.join('\n');
    }
});