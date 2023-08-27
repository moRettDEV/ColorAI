const generatedColor = [
    0.5393370389938354,
    0.08603251725435257,
    0.9425329566001892
];
let color = 'rgb( 138, 22, 240 )'

const rgbColor = generatedColor.map(value => Math.round(value * 255));

console.log('Generated RGB color:', rgbColor);
