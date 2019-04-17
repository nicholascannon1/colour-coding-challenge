/**
 * noiseNeighbours.js 
 * 
 * Written by Nicholas Cannon
 */
var rgbSet;
var imgData;
var w;
var h;
var ITERATIONS = 2331000;

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
 * Populates the imgData array with random pixel data for all RGB values.
 * @param {Number} w width in pixels 
 * @param {Number} h height in pixels
 */
function genNoise(w, h) {
  // Generate xy points for image size
  var x = Array.apply(null, {length: w}).map(Number.call, Number);
  var y = Array.apply(null, {length: h}).map(Number.call, Number);

  // Initialize new empty set
  rgbSet = new Set();

  imgData = [];

  for (var xi=0; xi<x.length; xi++) {
    for (var yi=0; yi<y.length; yi++) {
      var pxIndex = (yi * w + xi) * 4; // Pixel buffer index
      var rgb = genRGB(); // Generates random unique RGB value

      imgData[pxIndex] = rgb[0];     // Red
      imgData[pxIndex+1] = rgb[1];   // Green
      imgData[pxIndex+2] = rgb[2];   // Blue
      imgData[pxIndex+3] = 255;      // Alpha
    }
  }
}

/**
 * Calculates the neighbouring pixels in [x, y] format for a given pixel.
 * @param {Array} px Pixel in format [x, y] 
 * @returns {Array} Neighbouring pixels.
 */
function getNeighbours(px) {
  var n = [];
  for (var y=-1; y<=1; y++) {
    if (px[1]+y == -1 || px[1]+y == h) { continue; }
    for (var x=-1; x<=1; x++) {
      if (px[0]+x == -1 || px[0]+x == w) { continue; }
      n.push([ px[0]+x, px[1]+y ]);
    }
  }
  return n;
}

/**
 * Calculates the difference between two pixels colours in the imgData array.
 * @param {Array} px1 Pixel in format [x, y]
 * @param {Array} px2 Pixel in format [x, y]
 */
function colourDifference(px1, px2) {
  var pxi1 = (px1[1] * w + px1[0]) * 4;
  var pxi2 = (px2[1] * w + px2[0]) * 4;

  var r = imgData[pxi1] - imgData[pxi2];
  var g = imgData[pxi1+1] - imgData[pxi2+1];
  var b = imgData[pxi1+2] - imgData[pxi2+2];
  return r*r + g*g + b*b;
}

/**
 * Swaps two pixels colours in the imgData array.
 * @param {Array} px1 Pixel in format [x, y]
 * @param {Array} px2 Pixel in format [x, y]
 */
function swapPixels(px1, px2) {
  var pxi1 = (px1[1] * w + px1[0]) * 4;
  var pxi2 = (px2[1] * w + px2[0]) * 4;

  // store pixel 2 colours in temp variable
  var temp = [imgData[pxi2], imgData[pxi2+1], imgData[pxi2+2]];
  
  // swap pixel 2 colours with pixel 1 colours
  imgData[pxi2] = imgData[pxi1];
  imgData[pxi2+1] = imgData[pxi1+1];
  imgData[pxi2+2] = imgData[pxi1+2];

  // swap pixel 1 colours with temp colours
  imgData[pxi1] = temp[0];
  imgData[pxi1+1] = temp[1];
  imgData[pxi1+2] = temp[2];
}

/**
 * Generates image with all RGB values quantized to 32 steps between 8 and 256.
 * Initially generates a noisey image then randomly selects two pixels and checks if 
 * swapping them increases the similarity of the pixel to its neighbours. If it increases
 * the similarity then swap them, if not then leave them. Repeat this process.
 * 
 * NOTE: This function performs some heavy rendering and runs at different speeds in 
 *  different browsers.
 * @param {ImageData} img Image data object from canvas context. 
 */
function noiseNeighboursRGB(img) {
  w = img.width;
  h = img.height;

  // generate initial noisey image
  genNoise(w, h);

  for (var i=0; i<ITERATIONS; i++) {
    // pick two random pixels
    var xy1 = [Math.floor(Math.random()*w), Math.floor(Math.random()*h)];
    var xy2 = [Math.floor(Math.random()*w), Math.floor(Math.random()*h)];

    // Calculate similarites
    var n1 = getNeighbours(xy1);
    var sim1 = 0;
    var swapSim1 = 0;
    for (var pxi in n1) {
      sim1 += colourDifference(n1[pxi], xy1); // Similarity of px1 and neighbours
      swapSim1 += colourDifference(n1[pxi], xy2); // Similarity of px2 and px1 neighbours
    }

    var n2 = getNeighbours(xy2);
    var sim2 = 0;
    var swapSim2 = 0;
    for (var pxi in n2) {
      sim2 += colourDifference(n2[pxi], xy2); // Similarity of px2 and neighbours
      swapSim2 += colourDifference(n2[pxi], xy1); // Similarity of px1 and px2 neighbours
    }

    if (swapSim1 < sim1 && swapSim2 < sim2) {
      // pixels more similar to neighbours if swapped so swap
      swapPixels(xy1, xy2);
    }
  }
  
  for (var i=0; i<img.data.length; i++) {
    img.data[i] = imgData[i];
  }
}