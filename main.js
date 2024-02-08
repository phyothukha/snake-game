import "./style.css";

const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  SnakeY = 5;
let velocityX = 0,
  velocityY = 0;
let snakeBody = [];
let setInervalId;
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score :${highScore}`;

const updatFoodPosition = () => {
  // passing a random 1-30 value as food position
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  //clearing the tmer and reloading the page on game over
  clearInterval(setInervalId);
  alert("Game Over !Press Ok to replay");
  location.reload();
};

const changeDirection = (e) => {
  //changing velocity value based on key press
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

controls.forEach((button) =>
  button.addEventListener("click", () =>
    changeDirection({ key: button.dataset.key })
  )
);

const initGame = () => {
  if (gameOver) return handleGameOver();
  let html = `<div class="food" style="grid-area:${foodY}/${foodX}"></div>`;

  //checking if the snake hit the food
  if (snakeX === foodX && SnakeY === foodY) {
    updatFoodPosition();
    snakeBody.push([foodY, foodX]);
    score++;
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score :${highScore}`;
  }
  snakeX += velocityX;
  SnakeY += velocityY;
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, SnakeY];

  if (snakeX <= 0 || snakeX > 30 || SnakeY <= 0 || SnakeY > 30) {
    return (gameOver = true);
  }
  for (let i = 0; i < snakeBody.length; i++) {
    //adding a div for each part of the snake's body
    html += `<div class="head" style="grid-area:${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;

    //checking if the nsake head hit the body,if so set gameOVer to true
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  playBoard.innerHTML = html;
};

updatFoodPosition();
setInervalId = setInterval(initGame, 150);
document.addEventListener("keyup", changeDirection);
