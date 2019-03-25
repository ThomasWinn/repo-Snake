/*** CONSTANTS ***/

const CANVAS_BORDER_COLOR = 'black';
const CANVAS_BACKGROUND_COLOR = 'white';
const SNAKE_COLOR = 'lightgreen';
const SNAKE_BORDER_COLOR = 'darkgreen';
const FOOD_COLOR = 'red';
const FOOD_BORDER_COLOR = 'darkred';
const POWERUP_COLOR = 'blue';
const POWERUP_BORDER_COLOR = 'darkblue';


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
let powerUpCount = 3; // number of powerUps available

let powerUpMenu = [
  "ghost",
  "DoublePoint",
  "KillEnemySnakes"
]

let foodX;
let foodY;
let powerUpX;
let powerUpY;

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

// Create the first powerUp location
createPowerUp();

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
    powerUpSpawnRate();
    drawPowerUp();
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
  createPowerUp();

}

// Spawn rate of powerUp 1 in 5
function powerUpSpawnRate() {
  let random5 = Math.floor((Math.random * 5) + 1);
  if(random5 == 1) {
    drawPowerUp();
  }
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
   const didEatPowerUp = snake[0].x === powerUpX && snake[0].y === powerUpY;
   if (didEatFood) {
     score += 10;
     document.getElementById('score').innerHTML = score;

     createFood(); // Once eat food, it spawns new location
   }
   else if (didEatPowerUp) {
     let randomNum = randomPowerUpChooser();
     switch (randomNum) {
       case 1:
          ghost(); // ghost powerup
          createPowerUp();
          // document.getElementById('score').innerHTML = randomNum;
          break;

       case 2:
          //doublePoints(); // Double Point powerup
          createPowerUp();
          document.getElementById('score').innerHTML = randomNum;
          break;

       case 3:
          //KillEnemySnakes(); // kill enemy snakes
          createPowerUp();
          document.getElementById('score').innerHTML = randomNum;
          break;

       default:
          document.getElementById('score').innerHTML = "no powerup";

     }

   }

   else {
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

 /* ----------------------------------------------------------------------------
 * Power-Up FUNCTIONALITY
 * ---------------------------------------------------------------------------*/

function createPowerUp() {
  powerUpX = randomTen(0, gameCanvas.width - 10);
  powerUpY = randomTen(0, gameCanvas.height - 10);

  snake.forEach(function isPowerUpOnSnake(part) {
    const powerUpIsOnSnake = part.x == powerUpX && part.y == powerUpY;
    // If theres powerup on snake, try new coordinates
    if (powerUpIsOnSnake) {
      createPowerUp();
    }
  });
}

function drawPowerUp() {
  ctx.fillStyle = POWERUP_COLOR;
  ctx.strokestyle = POWERUP_BORDER_COLOR;
  ctx.fillRect(powerUpX, powerUpY, 10, 10);
  ctx.strokeRect(powerUpX, powerUpY, 10, 10);
}

function randomPowerUpChooser() {
  return Math.floor((Math.random() * powerUpMenu.length) + 1) //return random num 1 - .length()
}


// SHIT BREAKS WHEN CALLED
// SO WHEN IT CALLS GHOST FROM SWITCH, IT WONT USE THE GHOST
// TIMER FUNCTION SET INTERVAL AND CHANGE COLOR.
// ghost
function ghost() {
  document.getElementById('score').innerHTML = "randomNum";
  let ghostTimer = setInterval(function() {

    // Make snake yellow in duration of double points
    ctx.fillStyle = 'black';
    ctx.strokestyle = 'grey';

    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
  }, 15000);

  clearInterval(ghostTimer); // clears timer after 15 sec
}
/*
// DoublePoints
function doublePoints() {
  let doublePointsTimer = setInterval(function() {

    // Make snake yellow in duration of double points
    ctx.fillStyle = 'yellow';
    ctx.strokestyle = 'darkyellow';

    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);

    // Update score
    score += 10 * 2;
    document.getElementById('score').innerHTML = score;
  }, 15000); // 15 seconds

  clearInterval(doublePointsTimer); // clear 15 sec
}

// KillEnemySnakes
function killEnemySnakes() {
  let killEnemySnakesTimer = setInterval(function() {

    // Make snake blue
    ctx.fillStyle = 'blue';
    ctx.strokestyle = 'darkblue';

    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);

    // When the snake touches any part of the body of another snake, kill setInterval(function () {

    }, 15000);

    clearInterval(killEnemySnakesTimer);
  }
}
*/
