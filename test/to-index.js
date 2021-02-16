const fs = require('fs');
const { toIndexed } = require('..');

(async () => {
	const png = fs.readFileSync('./image.png'); // read the image

	const converted = await toIndexed(png); // convert image to indexed BMP style image

	fs.writeFileSync('./image.data', converted); // image.datacan be loaded into GIMP

	// When loading into GIMP use these settings:
	// - "indexed" image type
	// - "1024" offset
	// - the width and height of the original image
	// - "BMP Style" palette type
	// - select the same .data file for the palette
})();