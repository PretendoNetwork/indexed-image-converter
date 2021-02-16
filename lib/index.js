const fs = require('fs');
const imagePalette = require('image-palette');
const imagePixels = require('image-pixels');

function getDataFromPathOrBuffer(pathOrBuffer) {
	let data;
	if (pathOrBuffer instanceof Buffer) {
		data = pathOrBuffer;
	} else {
		data = fs.readFileSync(pathOrBuffer);
	}

	return data;
}

// Convert a standard image into a BMP style indexed image
async function toIndexed(pathOrBuffer) {
	// get the data from either a string path or Buffer
	const data = getDataFromPathOrBuffer(pathOrBuffer);

	const pixels = await imagePixels(data); // get the pixel data of the image
	const { ids, colors } = imagePalette(pixels, 256); // get the color palette data from the pixel data

	const palette = Buffer.alloc(0x400); // 256 color palette
	const indexes = Buffer.alloc(ids.length); // the pixel color indexes into the color palette

	// fill the color palette section with the colors
	for (let i = 0; i < colors.length; i++) {
		// get the RGB values from each color
		const r = colors[i][0];
		const g = colors[i][1];
		const b = colors[i][2];
		const x = 0xFF;

		// BMP style indexed images order the colors as B, G, R, X
		const color = Buffer.from([b, g, r, x]);

		// put the color into the palette
		color.copy(palette, i*4);
	}

	// fill the indexes section with the pixel color indexes
	for (let i = 0; i < ids.length; i++) {
		indexes.writeUInt8(ids[i], i);
	}

	// return the converted image
	return Buffer.concat([
		palette,
		indexes
	]);
}

module.exports = {
	toIndexed
};