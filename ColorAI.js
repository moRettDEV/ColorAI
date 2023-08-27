const tf = require('@tensorflow/tfjs');
const fs = require('fs');

const datasetPath = 'colorDataSet.json';

// Чтение датасета из файла
fs.readFile(datasetPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the dataset file:', err);
        return;
    }

    try {
        const dataset = JSON.parse(data);

        // Извлечение уникальных меток (названий цветов) из датасета
        const labels = [...new Set(dataset.map(item => item.name))];
        const labelToIndex = {};
        labels.forEach((label, index) => {
            labelToIndex[label] = index;
        });

        // Создание модели нейронной сети
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 64, inputShape: [3], activation: 'relu' }));
        model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
        model.add(tf.layers.dense({ units: labels.length, activation: 'softmax' }));

        // Компиляция модели
        model.compile({ loss: 'categoricalCrossentropy', optimizer: 'adam' });

        // Подготовка входных данных и меток для обучения
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

        // Обучение модели с выводом номера эпохи
        model.fit(inputTensor, targetTensor, {
            epochs: 1000,
            callbacks: {
                onEpochEnd: (epoch) => {
                    console.log(`Epoch ${epoch + 1}`);
                }
            }
        }).then(() => {
            generateColorAndName(); // Вызываем генерацию после обучения
        });

        // Генерация цвета и его классификация
        const generateColorAndName = async () => {
            const input = tf.tensor2d([[Math.random(), Math.random(), Math.random()]]);
            const prediction = model.predict(input);

            const labelIndex = prediction.argMax(1).dataSync()[0];
            const generatedName = labels[labelIndex];

            let generatedColor = input.dataSync();
            const rgbColor = generatedColor.map(value => Math.round(value * 255));

            console.log('Generated RGB color:', rgbColor);
            console.log('Generated color:', input.dataSync());
            console.log('Generated name:', generatedName);
            console.log(`{ "rgb": ${rgbColor}, "name": ${generatedName} },`);
        };
    } catch (e) {
        console.error('Error parsing dataset JSON:', e);
    }
});
