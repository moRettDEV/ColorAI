const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const modelPath = './saved_model/model.json';
const datasetPath = 'parser/colorDataSet.json';

// Генирируем имя исходя из цвета
function generateName(model, labels, input) {
    // Получение предсказания от модели
    const prediction = model.predict(input);

    // Определение индекса метки с наибольшей вероятностью
    const labelIndex = prediction.argMax(1).dataSync()[0];

    // Возвращение объекта с сгенерированным именем
    return {name: labels[labelIndex]}
}

// Генирируем цвет для ии
function generateColor() {
    const input = tf.tensor2d([[Math.random(), Math.random(), Math.random()]]);

    //Переводим Rgb в 255
    let generatedColor = input.dataSync();
    const rgbColor = generatedColor.map(value => Math.round(value * 255));

    //Выводим объект со значением цвета в RGB
    return {r: rgbColor[0],g: rgbColor[1],b: rgbColor[2]}
}

// Генерация цвета и его классификация
function ManualInput(model,labels, {r, g, b}) {
    // Преобразование входных RGB-значений в диапазон [0, 1]
    const input = tf.tensor2d([[r / 255, g / 255, b / 255]]);

    // Получение предсказания от модели
    const prediction = model.predict(input);

    // Определение индекса метки с наибольшей вероятностью
    const labelIndex = prediction.argMax(1).dataSync()[0];
    const generatedName = labels[labelIndex];

    // Преобразование входных значений в массив RGB
    const rgbColor = [r, g, b];

    // Возвращение объекта с сгенерированным цветом и именем
    return {
        rgb: rgbColor,
        name: generatedName
    };
}

// Сохранение модели
async function saveModel(model) {
    const modelData = await model.save(tf.io.withSaveHandler(async (artifacts) => {
        await fs.promises.writeFile(modelPath, JSON.stringify(artifacts.modelTopology));
        return modelPath;
    }));
    console.log('Model saved:', modelData);
}

async function loadModel() {
    const modelTopology = JSON.parse(await fs.promises.readFile(modelPath, 'utf8'));
    return await tf.loadLayersModel(tf.io.fromMemory(modelTopology));
}

async function readDataset() {
    try {
        const data = await fs.promises.readFile(datasetPath, 'utf8');
        const dataset = JSON.parse(data);
        return dataset;
    } catch (err) {
        console.error('Error reading the dataset file:', err);
        return null;
    }
}

module.exports = {generateName, readDataset, generateColor, saveModel, loadModel, ManualInput}