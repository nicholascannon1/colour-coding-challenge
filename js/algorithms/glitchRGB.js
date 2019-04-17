/**
 * glitchRGB.js
 * 
 * Written by Nicholas Cannon
 */
var steps = [];
for (var i=0; i<32; i++) {
  steps[i] = (i+1)*8; 
}

/**
 * Produces an image using all RGB values quantized to 32 steps. This algorithm 
 * generates array of all RGB values then sorts that array by randomly comparing
 * RGB values by each component. This array is then placed into the image linearly.
 * @param {ImageData} img Image data object from canvas context. 
 */
function glitchRGB(img) {
  var w = img.width;
  var h = img.height;
  var colourIndex = 0;

  // Generate xy values
  var x = Array.apply(null, {length: w}).map(Number.call, Number);
  var y = Array.apply(null, {length: h}).map(Number.call, Number);

  // Generate all RGB values, must do this each time image is generated
  var colours = [];
  for (var ri=0; ri < steps.length; ri++) {
    for (var gi=0; gi < steps.length; gi++) {
      for (var bi=0; bi < steps.length; bi++) {
        colours.push([steps[ri], steps[gi], steps[bi]]);
      }
    }
  }
  // Sort each RGB value by randomly indexing into the RGB array and comparing
  // different components of the colour. a and b in the format of [R, G, B]
  colours = colours.sort(function (a, b) {
    return a[Math.floor(Math.random()*2)]-b[Math.floor(Math.random()*2)];
  });

  // fill image with RGB data 
  for (var xi=0; xi<w; xi++) {
    for (var yi=0; yi<h; yi++) {
      var pxIndex = (y[yi] * w + x[xi]) * 4;

      img.data[pxIndex] = colours[colourIndex][0];
      img.data[pxIndex+1] = colours[colourIndex][1];
      img.data[pxIndex+2] = colours[colourIndex][2];
      img.data[pxIndex+3] = 255;
      colourIndex++;
    }
  }
}