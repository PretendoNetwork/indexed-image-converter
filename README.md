# Index Image Converter
### Convert between normal images and BMP style indexed images


## What is this?
Some images used by the WiiU (unsure about the 3DS) use an indexed image type rather than normal images. This can be seen on the images used by `eco_proc` to display images on the WiiU gamepad. This tool will convert between normal images and this indexed image type for easier use


## Installation
```
npm i https://github.com/PretendoNetwork/indexed-image-converter
```



## Supported functionality:
- [x] Image->Indexed
- [ ] Indexed->Image

# Example
## Convert a PNG image to an indexed image
```js
const fs = require('fs');
const { toIndexed } = require('indexed-image-converter');

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
```