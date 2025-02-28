const PlayBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setintervalId;
let score = 0;

let highscore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highscore}`;

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setintervalId);
    alert("Game over! Press Ok to replay..");
    location.reload();
}

const changeDirection = e => {
    if (e.key == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(button => button.addEventListener("click", () => changeDirection({
    key: button.dataset.key
})));

const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highscore = score >= highscore ? score : highscore;
        localStorage.setItem("high-score", highscore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highscore}`;
    }

    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    PlayBoard.innerHTML = html;
}

updateFoodPosition();
setintervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
