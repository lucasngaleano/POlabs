// Configuraciones del canvas
const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

// Parámetros del juego
const paddleWidth = 10, paddleHeight = 100;
let playerPaddleY = (canvas.height - paddleHeight) / 2;
let computerPaddleY = (canvas.height - paddleHeight) / 2;
const ballSize = 10;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 4, ballSpeedY = 4;
const paddleSpeed = 6;

// Marcador
let playerScore = 0;
let computerScore = 0;
const winningScore = 10;
let gameOver = false;

// Variable para manejar el loop del juego
let gameLoopId;

// Función para dibujar el paddle
function drawPaddle(x, y) {
    context.fillStyle = "white";
    context.fillRect(x, y, paddleWidth, paddleHeight);
}

// Función para dibujar la pelota
function drawBall() {
    context.fillStyle = "white";
    context.fillRect(ballX, ballY, ballSize, ballSize);
}

// Función para actualizar la posición de la pelota
function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Rebote en la parte superior e inferior del canvas
    if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Verificación de colisiones con las paletas
    if (ballX <= paddleWidth) {
        if (ballY > playerPaddleY && ballY < playerPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            computerScore++;
            checkGameOver();
            resetBall();
        }
    }

    if (ballX + ballSize >= canvas.width - paddleWidth) {
        if (ballY > computerPaddleY && ballY < computerPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            playerScore++;
            checkGameOver();
            resetBall();
        }
    }
}

// Función para mover la paleta del jugador
function movePlayerPaddle() {
    if (keysPressed["ArrowUp"] && playerPaddleY > 0) {
        playerPaddleY -= paddleSpeed;
    } else if (keysPressed["ArrowDown"] && playerPaddleY < canvas.height - paddleHeight) {
        playerPaddleY += paddleSpeed;
    }
}

// IA básica para mover la paleta de la computadora
function moveComputerPaddle() {
    if (computerPaddleY + paddleHeight / 2 < ballY) {
        computerPaddleY += paddleSpeed * 0.75;
    } else {
        computerPaddleY -= paddleSpeed * 0.75;
    }
}

// Resetear la pelota al centro del canvas
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    updateScore();
}

// Actualizar el marcador en pantalla
function updateScore() {
    scoreElement.textContent = `Jugador: ${playerScore} | Computadora: ${computerScore}`;
}

// Verificar si el juego ha terminado
function checkGameOver() {
    if (playerScore === winningScore || computerScore === winningScore) {
        gameOver = true;
        scoreElement.textContent += " - ¡Juego terminado!";
        resetBtn.style.display = "block";
        cancelAnimationFrame(gameLoopId); // Detener el juego
    }
}

// Resetear el juego
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    gameOver = false;
    resetBall();
    updateScore();
    resetBtn.style.display = "none";
    gameLoopId = requestAnimationFrame(gameLoop);
}

// Iniciar el juego
function startGame() {
    startBtn.style.display = "none";  // Ocultar el botón de inicio
    resetBall();  // Reseteamos la pelota al centro
    updateScore(); // Mostramos el marcador inicial
    gameLoopId = requestAnimationFrame(gameLoop);  // Iniciamos el loop del juego
}

// Detección de teclas
let keysPressed = {};
window.addEventListener("keydown", (e) => {
    keysPressed[e.key] = true;
});
window.addEventListener("keyup", (e) => {
    delete keysPressed[e.key];
});

// Función principal de renderizado
function draw() {
    // Limpiar el canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar paletas
    drawPaddle(0, playerPaddleY); // Jugador
    drawPaddle(canvas.width - paddleWidth, computerPaddleY); // Computadora

    // Dibujar pelota
    drawBall();

    // Actualizar posiciones
    if (!gameOver) {
        updateBall();
        movePlayerPaddle();
        moveComputerPaddle();
    }
}

// Iniciar el loop del juego
function gameLoop() {
    draw();
    gameLoopId = requestAnimationFrame(gameLoop);
}

// Escuchar clic en el botón de inicio
startBtn.addEventListener("click", startGame);

// Escuchar clic en el botón de reinicio
resetBtn.addEventListener("click", resetGame);
