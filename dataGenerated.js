const tf = require('@tensorflow/tfjs');

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

module.exports = {generateName, generateColor, ManualInput}