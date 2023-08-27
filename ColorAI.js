const tf = require('@tensorflow/tfjs');
const fs = require('fs');

const datasetPath = 'parcer/colorDataSet.json';

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
            epochs: 10,
            callbacks: {
                onEpochEnd: (epoch) => {
                    console.log(`Epoch ${epoch + 1}`);
                }
            }
        }).then(() => {
            generateColorAndName(255, 0, 0); // Вызываем генерацию после обучения
        });

        // Генерация цвета и его классификация
        const generateColorAndName = async (r, g, b) => {
            // Преобразование входных RGB-значений в диапазон [0, 1]
            const input = tf.tensor2d([[r / 255, g / 255, b / 255]]);

            // Получение предсказания от модели
            const prediction = model.predict(input);

            // Определение индекса метки с наибольшей вероятностью
            const labelIndex = prediction.argMax(1).dataSync()[0];
            const generatedName = labels[labelIndex];

            // Преобразование входных значений в массив RGB
            const rgbColor = [r, g, b];

            console.log('Input RGB color:', rgbColor);
            console.log('Generated name:', generatedName);
            console.log(`{ "rgb": ${rgbColor}, "name": ${generatedName} },`);

            // Возвращение объекта с сгенерированным цветом и именем
            return {
                rgb: rgbColor,
                name: generatedName
            };
        };
    } catch (e) {
        console.error('Error parsing dataset JSON:', e);
    }
});
