const { ManualInput, readDataset, loadModel } = require("./dataGenerated");

async function main() {
    // Загрузка обученной модели
    const loadedModel = await loadModel();

    // Чтение датасета
    const dataset = await readDataset();
    if (!dataset) {
        return;
    }

    // Создание маппинга меток к индексам
    const labels = [...new Set(dataset.map(item => item.name))];

    // Использование загруженной модели для классификации цвета
    const manualColor = {
        r: 255,
        g: 0,
        b: 0
    };
    const result = ManualInput(loadedModel, labels, manualColor);
    console.log(result);
}

main();
