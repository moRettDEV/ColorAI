const fs = require('fs');

function getRandomRGB() {
    return [
        Math.floor(Math.random() * 256), // Red
        Math.floor(Math.random() * 256), // Green
        Math.floor(Math.random() * 256)  // Blue
    ];
}

function generateRandomColorName() {
    const adjectives = ['Vibrant', 'Elegant', 'Soothing', 'Bold', 'Delicate', 'Serene', 'Bright', 'Subtle', 'Lively', 'Muted'];
    const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Gray', 'Black', 'White', 'Cyan', 'Magenta'];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return `${randomAdjective} ${randomColor}`;
}

const datasetSize = 100; // Number of samples in the dataset
const generatedDataset = [];

for (let i = 0; i < datasetSize; i++) {
    const rgb = getRandomRGB();
    const name = generateRandomColorName();
    generatedDataset.push({ rgb, name });
}

const outputJSON = JSON.stringify(generatedDataset, null, 2);

fs.writeFile('generated_dataset.json', outputJSON, 'utf8', err => {
    if (err) {
        console.error('Error writing the output file:', err);
        return;
    }
    console.log('Generated dataset file saved successfully.');
});
