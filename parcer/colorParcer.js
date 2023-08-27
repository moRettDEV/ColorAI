const fs = require('fs');

fs.readFile('colorLibNotConvert.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    const lines = data.split('\n');
    const colorDataSet = [];

    lines.forEach(line => {
        const parts = line.trim().split('#');
        if (parts.length === 2) {
            const name = parts[0].trim();
            const hexPart = parts[1].trim();
            const r = parseInt(hexPart.substring(0, 2), 16);
            const g = parseInt(hexPart.substring(2, 4), 16);
            const b = parseInt(hexPart.substring(4, 6), 16);

            colorDataSet.push({ name, rgb: [r, g, b] });
        }
    });

    const jsonOutput = JSON.stringify(colorDataSet, null, 2);

    fs.writeFile('colorDataSet.json', jsonOutput, 'utf8', err => {
        if (err) {
            console.error('Error writing the JSON file:', err);
            return;
        }
        console.log('JSON file has been created successfully!');
    });
});
