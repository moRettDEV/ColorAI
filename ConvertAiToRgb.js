const generatedColor = [
    0.12987445294857025,
    0.45930272340774536,
    0.6365097761154175
]

let color = 'rgb( 33, 117, 162 )'

const rgbColor = generatedColor.map(value => Math.round(value * 255));

console.log('Generated RGB color:', rgbColor);
