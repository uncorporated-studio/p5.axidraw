/**
 * This example uses the AxiDraw to play a tic-tac-toe game.
 * Click the canvas to connect to the AxiDraw.
 */

const MAX_X_MM = 50; // Maximum width in millimeters for the AxiDraw plotting area.
const MAX_Y_MM = 50; // Maximum height in millimeters for the AxiDraw plotting area.

const circle_RADIUS = 5; // Radius for drawing a circle in the game.

const axi = new axidraw.AxiDraw(); // Create a new AxiDraw object for controlling the plotter.
let connected = false; // Keeps track of whether the AxiDraw is connected.
let isCircle = false; // Determines if the current move should draw a circle or an X.

let minVal = 0; // Minimum value for the drawing area in millimeters.
let maxVal = 50; // Maximum value for the drawing area in millimeters.
let space = maxVal / 3; // Space between grid lines in the tic-tac-toe board.

function setup() {
  createCanvas(400, 400); // Creates a canvas with 400x400 pixels.

  ellipseMode(CENTER); // Sets ellipse drawing mode to CENTER.
  textAlign(CENTER); // Aligns text to the center for easy positioning.
}

function getMoveCoords() {
  // Determines the grid cell based on the mouse position.
  let coords = createVector(0, 0);
  if (mouseX > width / 3) { // Check if in the right column
    coords.x = 1;
    if (mouseX > width * 2 / 3) { // Check if in the far-right column
      coords.x = 2;
    }
  }
  if (mouseY > height / 3) { // Check if in the middle row
    coords.y = 1;
    if (mouseY > height * 2 / 3) { // Check if in the bottom row
      coords.y = 2;
    }
  }
  return coords; // Return the coordinates of the cell.
}

function drawAxis() {
  // Draws the tic-tac-toe grid on the AxiDraw.
  axi.penUp();
  axi.moveTo(minVal, minVal); // Move to top-left corner.
  axi.penDown();
  axi.moveTo(maxVal, minVal); // Draw the top horizontal border.
  axi.moveTo(maxVal, maxVal); // Draw the right vertical border.
  axi.moveTo(minVal, maxVal); // Draw the bottom horizontal border.
  axi.moveTo(minVal, minVal); // Draw the left vertical border to complete the outer square.
  axi.penUp();

  // Draw vertical lines for the grid.
  axi.moveTo(minVal + space, minVal);
  axi.penDown();
  axi.moveTo(minVal + space, maxVal); // First vertical line inside the grid.
  axi.penUp();

  axi.moveTo(minVal + space * 2, maxVal);
  axi.penDown();
  axi.moveTo(minVal + space * 2, minVal); // Second vertical line.
  axi.penUp();

  // Draw horizontal lines for the grid.
  axi.moveTo(maxVal, minVal + space);
  axi.penDown();
  axi.moveTo(minVal, minVal + space); // First horizontal line inside the grid.
  axi.penUp();

  axi.moveTo(minVal, minVal + space * 2);
  axi.penDown();
  axi.moveTo(maxVal, minVal + space * 2); // Second horizontal line.
  axi.penUp();
}

function drawX(coords) {
  // Draws an X symbol at the specified grid cell coordinates.
  let ctr = createVector((coords.x * space) + space / 2, (coords.y * space) + space / 2);
  let xSz = 6; // Size of the X.
  axi.moveTo(ctr.x - xSz, ctr.y - xSz);
  axi.penDown();
  axi.moveTo(ctr.x + xSz, ctr.y + xSz); // First diagonal of the X.
  axi.penUp();
  axi.moveTo(ctr.x - xSz, ctr.y + xSz);
  axi.penDown();
  axi.moveTo(ctr.x + xSz, ctr.y - xSz); // Second diagonal of the X.
  axi.penUp();
}

function drawCircle(coords) {
  // Draws a simple circle symbol at the specified grid cell coordinates.
  let ctr = createVector((coords.x * space) + space / 2, (coords.y * space) + space / 2);
  drawArc(ctr.x, ctr.y, 6, 0, TWO_PI); // Only one full circle is needed here.
}


function mmToPx(mmPos) {
  // Converts millimeter coordinates to pixel coordinates for the canvas display.
  return createVector(
    constrain(map(mmPos.x, 0, MAX_X_MM, 0, width), 0, width),
    constrain(map(mmPos.y, 0, MAX_Y_MM, 0, height), 0, height)
  );
}

function drawArc(x, y, radius, startAngle, endAngle, pointCount = 16) {
  // Draws an arc by calculating points on the arc and moving the AxiDraw pen to them.
  const angleInc = (endAngle - startAngle) / pointCount;
  const x1 = radius * cos(startAngle);
  const y1 = radius * sin(startAngle);
  axi.moveTo(x + x1, y + y1);
  axi.penDown();

  for (let i = 0; i <= pointCount; i += 1) {
    const angle = startAngle + i * angleInc;
    const relX = radius * cos(angle);
    const relY = radius * sin(angle);
    axi.moveTo(x + relX, y + relY);
  }

  axi.penUp();
}

function mouseClicked() {
  // Handles mouse clicks for connecting and making moves.
  if (!connected) {
    axi.connect().then(() => {
      connected = true;
      drawAxis(); // Draws the grid once connected.
    });
    return;
  }

  let c = getMoveCoords(); // Get the cell coordinates based on the mouse position.
  if (isCircle) {
    drawCircle(c); // Draw a circle if it’s the circle's turn.
  } else {
    drawX(c); // Otherwise, draw an X.
  }
  axi.moveTo(0, 0); // Move back to the origin after drawing.
  isCircle = !isCircle; // Toggle between circle and X for the next turn.
}

function draw() {
  // Main draw loop for the canvas. It also shows the tic-tac-toe grid.
  if (!connected) {
    background(255, 0, 0);
    text('Click to Connect', width / 2, height / 2);
    return;
  }

  background(0, 255, 0);
  // Draw grid lines on the canvas to visualize the tic-tac-toe board.
  let xx = width / 3;
  let yy = height / 3;
  stroke(0, 0, 0);
  line(xx, 0, xx, height); // First vertical line.
  line(0, yy, width, yy); // First horizontal line.
  xx = width * 2 / 3;
  yy = height * 2 / 3;
  line(xx, 0, xx, height); // Second vertical line.
  line(0, yy, width, yy); // Second horizontal line.
}
