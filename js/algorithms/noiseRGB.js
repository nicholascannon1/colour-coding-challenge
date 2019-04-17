/**
 * noiseRGB.js
 * 
 * Written by Nicholas Cannon
 */
var rgbSet;

/**
 * Generates unique random RGB values quantized to 32 steps. Each random RGB
 * value generated is checked against the set rgbSet. Non unique RGB values
 * are recursively generated until unique. 
 * @return {Array} Array of unique random RGB values.
 */
function genRGB() {
  var rgb = [
    Math.floor(Math.random()*32+1)*8,
    Math.floor(Math.random()*32+1)*8,
    Math.floor(Math.random()*32+1)*8,
  ];

  // check if unique, if not call the function again
  if (!rgbSet.has(rgb)) {
    rgbSet.add(rgb);
    return rgb;
  }
  genRGB();
}

/**
 * Fills image randomly with RGB values. Must call context.putImageData after
 * to display image.
 * @param {ImageData} img Image data object from canvas context.
 */
function noiseRGB(img) {
  var w = img.width;
  var h = img.height;

  // Generate xy points for image size
  var x = Array.apply(null, {length: w}).map(Number.call, Number);
  var y = Array.apply(null, {length: h}).map(Number.call, Number);

  // Initialize new empty set
  rgbSet = new Set();

  for (var xi=0; xi<x.length; xi++) {
    for (var yi=0; yi<y.length; yi++) {
      var pxIndex = (yi * w + xi) * 4; // Pixel buffer index
      var rgb = genRGB(); // Generates random unique RGB value

      img.data[pxIndex] = rgb[0];     // Red
      img.data[pxIndex+1] = rgb[1];   // Green
      img.data[pxIndex+2] = rgb[2];   // Blue
      img.data[pxIndex+3] = 255;      // Alpha
    }
  }
}