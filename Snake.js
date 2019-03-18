/*** CONSTANTS ***/

const CANVAS_BORDER_COLOR = 'black';
const CANVAS_BACKGROUND_COLOR = 'white';
const SNAKE_COLOR = 'lightgreen';
const SNAKE_BORDER_COLOR = 'darkgreen';
const FOOD_COLOR = 'red';
const FOOD_BORDER_COLOR = 'darkred';


// Creating our snake using an array
let snake = [
  {x: 150, y: 150},
  {x: 140, y: 150},
  {x: 130, y: 150},
  {x: 120, y: 150},
  {x: 110, y: 150}
];

// Scoring
let score = 0;
let restartButton;

let foodX;
let foodY;

let changingDirection = false;

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
ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);

// Starts game
main();

// Create the first food location
createFood();

// Call changeDirection whenever a key is pressed
document.addEventListener("keydown", changeDirection);

// Listening to click on Restart
restartButton = document.getElementById("restart");
restartButton.addEventListener("click", myRestartButton);

/* -----------------------------------------------------------------------------
* GAME STATE
* ----------------------------------------------------------------------------*/

function main() {
  if (didGameEnd()) {
    return;

  }
  setTimeout(function onTick() {
    changingDirection = false;
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    // Call main again
    main();
  }, 100)
}


function myRestartButton() {
  snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150}
  ];
  score = 0;
  document.getElementById('score').innerHTML = score;
  main();
  createFood();

}


function clearCanvas() {
  // Select the color to fill canvas and border of canvas
  ctx.fillStyle = CANVAS_BACKGROUND_COLOR; // fillStyle = Main body
  ctx.strokestyle = CANVAS_BORDER_COLOR; // strokestyle = Border

  // Draw a "filled" rectangle to cover the entire canvas
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Draw a "botder" around the entire canvas
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

// Returns true if head of snake touches a part of snake or wall
 function didGameEnd() {
   // Tests if snake hit itself
   // Uses 4 because first 3 cant hit, and didCollide would be true at index 0
   for(let i = 4; i < snake.length; i++) {
     const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;

     if (didCollide) {
       return true;
     }
   }

   const hitLeftWall = snake[0].x < 0;
   const hitRightWall = snake[0].x > gameCanvas.width - 10;
   const hitTopWall = snake[0].y < 0;
   const hitBottomWall = snake[0].y > gameCanvas.height - 10;

   return hitLeftWall ||
          hitRightWall ||
          hitTopWall ||
          hitBottomWall;
 }


/* -----------------------------------------------------------------------------
* PLAYER SNAKE FUNCTIONALITY
* -----------------------------------------------------------------------------*/

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

// For each coordinate pair in array, call the drawSnakePart function to draw it
function drawSnake() {
  snake.forEach(drawSnakePart);
}

/**
 * Updating snake when keys are pressed
 **/
function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  if(changingDirection) {
    return;
  }

  changingDirection = true;

  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

/*
* Advances snake by changing the x and y coordinate
* based on the dx and dy values
*/
 function advanceSnake() {
   const head = {x: snake[0].x + dx, y: snake[0].y + dy};

   snake.unshift(head); // unshift = adds content to front of array

   // Checks if snake is over food, otherwise, update snake position
   const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
   if (didEatFood) {
     score += 10;
     document.getElementById('score').innerHTML = score;

     createFood();
   } else {
     snake.pop();
   }
 }

 /* ----------------------------------------------------------------------------
 * FOOD FUNCTIONALITY
 * ---------------------------------------------------------------------------*/


 function randomTen(min, max) {
   return Math.round((Math.random() * (max - min) + min) / 10) * 10;
 }

 function createFood() {
   foodX = randomTen(0, gameCanvas.width - 10) // So it doesn't hit x border
   foodY = randomTen(0, gameCanvas.height - 10) // So it doesn't hit y border

   snake.forEach(function isFoodOnSnake(part) {
     const foodIsOnSnake = part.x == foodX && part.y == foodY; // Checks if food is generated on any part of snake array
     // If theres food on snake, try new coordinates
     if (foodIsOnSnake) {
       createFood();
     }
   });
 }

 function drawFood() {
   ctx.fillStyle = FOOD_COLOR;
   ctx.strokestyle = FOOD_BORDER_COLOR;
   ctx.fillRect(foodX, foodY, 10, 10);
   ctx.strokeRect(foodX, foodY, 10, 10);
 }
