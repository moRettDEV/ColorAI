const tf = require('@tensorflow/tfjs-node-gpu');
const { ManualInput, generateColor, saveModel, readDataset } = require("./dataGenerated");



async function trainModel(inputs, targets, labels, epochs) {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, inputShape: [3], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: labels.length, activation: 'softmax' }));
    model.compile({ loss: 'categoricalCrossentropy', optimizer: 'adam' });

    await model.fit(inputs, targets, {
        epochs: epochs,
        callbacks: {
            onEpochEnd: (epoch) => {
                console.log(`Epoch ${epoch + 1}`);
            }
        }
    });

    return model;
}

async function main(epochs) {

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
        const input = rgb;
        const target = labelToIndex[name];
        inputs.push(input);
        targets.push(target);
    });
    const inputTensor = tf.tensor2d(inputs);
    const targetTensor = tf.oneHot(tf.tensor1d(targets, 'int32'), labels.length);

    const model = await trainModel(inputTensor, targetTensor, labels, epochs);

    // Сохранение модели
    await saveModel(model);

    // Указываем цвет в ручную
    const manualColor = {
        r: 251,
        g: 206,
        b: 177
    };

    // Автомотически сгенирированный массив, на случай если нужен рандомный цвет
    const autoColor = generateColor();

    // Выдаем в консоль результат работы
    console.log(ManualInput(model, labels, manualColor));
}

main(Math.pow(2, 14));