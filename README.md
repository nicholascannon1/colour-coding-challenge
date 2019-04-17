# Colour Coding Challenge
Colour Coding Challenge: Produce image with each pixel being a unique RGB value

## Glitch Algorithm
This algorithm generates array of all RGB values then sorts that array by randomly comparing RGB values by 
each component. This array is then placed into the image linearly.

## Linear Algorithm
This algorithm steps through each pixel horizontally starting at (0, 0) generating a new RGB value for each 
pixel linearly.

## Noise Algorithm
This algorithm runs horizontally through each pixel generating a new random RGB value for that pixel. Each RGB value
generated is stored in a set. The set is checked after each generation of a new RGB value to avoid duplicate colours.

## Noise Neighbours Algorithm
Starts by generating an image with each pixel assigned an unique random RGB value (exactly like the noise algorithm).
The algorithm then selects two random pixels and calculates if swapping those two pixels increases the similarity of 
that pixels colour to the neighbouring pixels colours. If this swap increases the similarity then it swaps them otherwise
it leaves them where they are and repeats the process. Note this algorithm takes a few seconds to render a 256x128px image
with 2,331,000 iterations.
