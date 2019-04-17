/**
 * main.js 
 * 
 * Written by Nicholas Cannon
 */
var animating = false;
var animateId;

window.onload = function () {
  // Generate glitch image
  var glitchCanvas = document.getElementById('glitchImage');
  var glitchCtx = glitchCanvas.getContext('2d');
  var glitchImg = glitchCtx.createImageData(glitchCanvas.width, glitchCanvas.height);
  glitchRGB(glitchImg, 0);
  glitchCtx.putImageData(glitchImg, 0, 0);

  // Generate linear image
  var linearCanvas = document.getElementById('linearImage');
  var linearCtx = linearCanvas.getContext('2d');
  var linearImg = linearCtx.createImageData(linearCanvas.width, linearCanvas.height);
  linearRGB(linearImg, 0);
  linearCtx.putImageData(linearImg, 0, 0);

  // Generarte Noise image
  var noiseCanvas = document.getElementById('noiseImage');
  var noiseCtx = noiseCanvas.getContext('2d');
  var noiseImg = noiseCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
  noiseRGB(noiseImg);
  noiseCtx.putImageData(noiseImg, 0, 0);

  // Noise Neighbours image
  var grnCanvas = document.getElementById('grnImage');
  var grnCtx = grnCanvas.getContext('2d');
  var grnImg = grnCtx.createImageData(grnCanvas.width, grnCanvas.height);

  // Event handlers
  document.getElementById('render').onclick = function() {
    alert('NOTE: Starting render, may take a couple seconds. This probably shouldn\'t be rendered in a browser ;)');
    this.style = 'display: none;';
    noiseNeighboursRGB(grnImg);
    grnCtx.putImageData(grnImg, 0, 0);
  }
  document.getElementById('noiseRefresh').onclick = function() {
    noiseRGB(noiseImg);
    noiseCtx.putImageData(noiseImg, 0, 0);
  };
  document.getElementById('glitchRefresh').onclick = function() {
    glitchRGB(glitchImg);
    glitchCtx.putImageData(glitchImg, 0, 0);
  };
  document.getElementById('linearSelect').onchange = function() {
    linearRGB(linearImg, this.options[this.selectedIndex].value);
    linearCtx.putImageData(linearImg, 0, 0);
  };
  document.getElementById('animateBtn').onclick = function() {
    if (animating) {
      window.cancelAnimationFrame(animateId);
      this.innerText = 'Animate!';
      animating = false;
    } else {
      animate();
      this.innerText = 'Stop animation';
      animating = true;
    }
  };

  /**
   * Animation callback
   */
  function animate() {
    animateId = window.requestAnimationFrame(animate);

    glitchRGB(glitchImg, 0);
    glitchCtx.putImageData(glitchImg, 0, 0);

    noiseRGB(noiseImg);
    noiseCtx.putImageData(noiseImg, 0, 0);
  }
}