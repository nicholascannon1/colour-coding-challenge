/**
 * linearRGB.js
 * 
 * Written by Nicholas Cannon
 */
var steps = [];
for (var i=0; i<32; i++) {
  steps[i] = (i+1)*8; 
}

/**
 * Fills image with all RGB values using a basic linear algorithm. Must call 
 * context.putImageData after to display image.
 * @param {ImageData} img Image data object from canvas context.
 * @param {Number} variation Changes the combination of RGB values. 
 *  Values either 0=RGB, 1=BRG, 2=GBR.
 */
function linearRGB(img, variation) {
  var w = img.width;
  var x = 0;
  var y = 0;

  for (var ri=0; ri<steps.length; ri++) {
    for (var gi=0; gi<steps.length; gi++) {
      for (var bi=0; bi<steps.length; bi++) {
        var pxIndex = (y * w + x) * 4;
        var rgb = [steps[ri], steps[gi], steps[bi]];

        img.data[pxIndex] = rgb[(0+variation)%3];
        img.data[pxIndex+1] = rgb[(1+variation)%3];
        img.data[pxIndex+2] = rgb[(2+variation)%3];
        img.data[pxIndex+3] = 255;
        x++;

        if (x == w) {
          x = 0;
          y++;
        }
      }
    }
  }
}