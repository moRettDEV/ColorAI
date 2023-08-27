const tf = require('@tensorflow/tfjs');
const fs = require('fs');

const datasetPath = 'generated_dataset.json';

fs.readFile(datasetPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the dataset file:', err);
        return;
    }

    try {
        const dataset = JSON.parse(data);

        const labels = [...new Set(dataset.map(item => item.name))]; // Extract unique labels
        const labelToIndex = {};
        labels.forEach((label, index) => {
            labelToIndex[label] = index;
        });

        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 64, inputShape: [3], activation: 'relu' }));
        model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
        model.add(tf.layers.dense({ units: labels.length, activation: 'softmax' })); // Output layer units set to number of labels

        model.compile({ loss: 'categoricalCrossentropy', optimizer: 'adam' });

        const inputs = [];
        const targets = [];

        dataset.forEach(data => {
            const { rgb, name } = data;
            const input = rgb;
            const target = labelToIndex[name];

            inputs.push(input);
            targets.push(target);
        });

        const inputTensor = tf.tensor2d(inputs);
        const targetTensor = tf.oneHot(tf.tensor1d(targets, 'int32'), labels.length);

        model.fit(inputTensor, targetTensor, {
            epochs: 100,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    console.log(`Epoch ${epoch + 1} - loss: ${logs.loss}`);
                }
            }
        });

        const generateColorAndName = async () => {
            const input = tf.tensor2d([[Math.random(), Math.random(), Math.random()]]);
            const prediction = model.predict(input);

            const labelIndex = prediction.argMax(1).dataSync()[0];
            const generatedName = labels[labelIndex];

            console.log('Generated color:', input.dataSync());
            console.log('Generated name:', generatedName);
        };

        generateColorAndName();

    } catch (e) {
        console.error('Error parsing dataset JSON:', e);
    }
});
