/*** CONSTANTS ***/

const CANVAS_BORDER_COLOR = 'black';
const CANVAS_BACKGROUND_COLOR = 'white';
const SNAKE_COLOR = 'lightgreen';
const SNAKE_BORDER_COLOR = 'darkgreen';


// Creating our snake using an array
let snake = [
  {x: 150, y: 150},
  {x: 140, y: 150},
  {x: 130, y: 150},
  {x: 120, y: 150},
  {x: 110, y: 150}
]

// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;

// Getting the canvas eleemnts
var gameCanvas = document.getElementById("gameCanvas");

// Returns a two dimensional drawing context
var ctx = gameCanvas.getContext("2d");

// Select the color to fill canvas and border of canvas
ctx.fillStyle = CANVAS_BACKGROUND_COLOR; // fillStyle = Main body
ctx.strokestyle = CANVAS_BORDER_COLOR; // strokestyle = Border

// Draw a "filled" rectangle to cover the entire canvas
ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

// Draw a "botder" around the entire canvas
ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height)

advanceSnake(); // Move ono step to the right

dx = 0;

dy = -10;

advanceSnake(); // One step up

drawSnake();


/**
 * Draws the snake on the canvas
 **/

// This will display snakePart of a specific coordinate
function drawSnakePart(snakePart) {
  ctx.fillStyle = SNAKE_COLOR;
  ctx.strokestyle = SNAKE_BORDER_COLOR;

  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

// For each coordinate pair, call the drawSnakePart function
function drawSnake() {
  snake.forEach(drawSnakePart);
}

/**
 * Updating snake when keys are pressed
 **/

/*
* Advances snake by changing the x and y coordinate
* based on the dx and dy values
*/
 function advanceSnake() {
   const head = {x: snake[0].x + dx, y: snake[0].y + dy};

   snake.unshift(head); // unshift = adds content to front of array

   snake.pop(); // removes last element of snake array
 }
