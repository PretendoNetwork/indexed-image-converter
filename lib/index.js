const fs = require('fs');
const imagePalette = require('image-palette');
const imagePixels = require('image-pixels');
const imageEncode = require('image-encode');

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

// Convert indexed image data to standard image type
function toImage(pathOrBuffer, width, height, type) {
	// get the data from either a string path or Buffer
	const data = getDataFromPathOrBuffer(pathOrBuffer);

	const paletteData = data.subarray(0, 0x400); // grab the palette section raw data
	const indexes = data.subarray(0x400); // grab the indexes
	const palette = []; // will store the palette RGBA values
	let i = 0;

	// split the palette section buffer into the correct format
	while (i < paletteData.length) {
		const splice = paletteData.slice(i, i += 4); // get the next color in the palette

		// indexed images store colors in BMP style B, G, R, X
		// need to get them back into RGBA
		const r = splice[2];
		const g = splice[1];
		const b = splice[0];
		const a = 0xFF;

		const color = [r, g, b, a];

		palette.push(color);
	}

	const pixels = []; // will store pixels as raw RGBA values one after the other

	// fill the pixels array based on the indexes into the decoded palette
	for (const index of indexes) {
		pixels.push(palette[index]);
	}

	// encode the pixel array into a buffer of the given image type
	return Buffer.from(imageEncode(pixels, [width, height], type));
}

module.exports = {
	toIndexed,
	toImage
};