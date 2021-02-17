const fs = require('fs');
const { toImage } = require('..');

const data = fs.readFileSync('./image.data'); // read the indexed image data
const width = 854; // WiiU gamepad width
const height = 400; // WiiU gamepad height
const type = 'png'; // image type to convert to (supports png, gif, tif, bmp, jpg)

const png = toImage(data, width, height, type); // convert indexed image to PNG

fs.writeFileSync('./image.png', png); // save disk
