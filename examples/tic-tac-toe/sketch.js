/**
 * This example uses the AxiDraw to play a tic-tac-toe game.
 * Click the canvas to connect to the AxiDraw.
 */

const axi = new axidraw.AxiDraw(); // Create a new AxiDraw object for controlling the plotter.
let screen  = new Screen();
let plotter;
let game;
let ai = new AiPlayer();
let isPlayer1Turn = true;

///
/// p5
///

function setup() {
  createCanvas(400, 400); // Creates a canvas with 400x400 pixels.

  ellipseMode(CENTER); // Sets ellipse drawing mode to CENTER.
  textAlign(CENTER); // Aligns text to the center for easy positioning.

  plotter = new Plotter(axi);
  game = new Game();
}

function draw(){
  // Main draw loop for the canvas. It also shows the tic-tac-toe grid.
  if(plotter.isStandingBy()){
    background(255, 0, 0);
    text('\'c\' to connect to AXI\n\'s\' to skip connection', width / 2, height / 2);
    return;
  }

  screen.drawBoard();
  screen.drawMoves(game);
}

function keyPressed(){
  if(plotter.isStandingBy()){
    if(key==='c'){
      if (!plotter.connected) {
        plotter.connect();
      }
    }else if(key==='s'){
      plotter.skipped = true;
    }
  }
}

function mouseClicked(){
  if(plotter.isStandingBy())return;

  if(game.isGameWon())return;
  if(!isPlayer1Turn)return;

  let c = getMoveCoords(); // Get the cell coordinates based on the mouse position.
  
  let moveResult = game.addMove(c, 0);
  switch(moveResult){
    case MoveOutcome.Forbidden:
      console.log("Player not allowed to move there");
      return;
    default:
      plotter.drawX(c);
      letAiPlay();
      break;
  }
}

///
/// interaction
///

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

function letAiPlay(){
  isPlayer1Turn = false;
  let moveResult = ai.move(game);
  if(moveResult==MoveType.Forbidden){
    console.log("AI not allowed to move here");
  }else{
    plotter.drawO(game.lastMove);
  }
  isPlayer1Turn = true;
}

