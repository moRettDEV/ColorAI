const tf = require('@tensorflow/tfjs-node-gpu');
const { ManualInput, generateColor, saveModel, readDataset } = require("./dataGenerated");

async function trainModel(inputs, targets, labels, epochs, batchSize) {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 32, inputShape: [3], activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.5 }));
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.5 }));
    model.add(tf.layers.dense({ units: labels.length, activation: 'softmax' }));
    model.compile({ loss: 'categoricalCrossentropy', optimizer: tf.train.adam() });

    await model.fit(inputs, targets, {
        epochs: epochs,
        batchSize: batchSize,
        callbacks: tf.node.tensorBoard('logs'),
    });

    return model;
}

async function main(epochs, batchSize) {
    const dataset = await readDataset();
    if (!dataset) {
        return;
    }
    const labels = [...new Set(dataset.map(item => item.name))];

    const labelToIndex = {};
    labels.forEach((label, index) => {
        labelToIndex[label] = index;
    });

    const inputs = [];
    const targets = [];
    dataset.forEach(data => {
        const { rgb, name } = data;
        inputs.push(rgb);
        targets.push(labelToIndex[name]);
    });

    const inputTensor = tf.tensor2d(inputs);
    const targetTensor = tf.oneHot(tf.tensor1d(targets, 'int32'), labels.length);

    const model = await trainModel(inputTensor, targetTensor, labels, epochs, batchSize);

    await saveModel(model);

    const manualColor = {
        r: 128,
        g: 0,
        b: 0
    };

    const autoColor = generateColor();

    console.log(ManualInput(model, labels, manualColor));
}

const epochs = 64;
const batchSize = 32;
main(epochs, batchSize);
