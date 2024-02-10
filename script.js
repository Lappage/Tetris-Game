const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const title = document.querySelector(".title");
const scoreDisplay = document.querySelector(".score-display");
const linesDisplay = document.querySelector(".lines-display");
const grid = document.querySelector(".grid");
const displaySquares = document.querySelectorAll(".next-grid div");
const nextShape = document.querySelector(".next-grid");
let squares = Array.from(grid.querySelectorAll("div"));
const width = 10;
const height = 26;
const gridSize = width * height;
let currentPosition = 4;
let rotationArrayIndex = 0;
let nextRandom = 0;
let nextRandomColour = 0;
let timerId;
let score = 0;
let lines = 0;
let gameEnded = false;
const colors = [
  "url(images/cyan_block.png)",
  "url(images/yellow_block.png)",
  "url(images/blue_block.png)",
  "url(images/orange_block.png)",
  "url(images/red_block.png)",
  "url(images/purple_block.png)",
];

// Listen for Keypresses
function control(e) {
  if (e.keyCode === 39) {
    // right arrow
    moveRight();
  } else if (e.keyCode === 38) {
    // up arrow
    rotate();
  } else if (e.keyCode === 37) {
    // left arrow
    moveLeft();
  } else if (e.keyCode === 40) {
    // down arrow
    if (gameEnded) {
      return;
    } else {
      moveDown();
    }
  }
}

document.addEventListener("keydown", control);

// Shapes
const lShape = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zShape = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
];

const tShape = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oShape = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iShape = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const shapes = [lShape, zShape, tShape, oShape, iShape];

// Randomly select a shape
let random = Math.floor(Math.random() * shapes.length);
let randomColour = Math.floor(Math.random() * colors.length);
let currentRotation = 0;
let rotationArray = shapes[random][currentRotation];

// Draw the shape

function draw() {
  rotationArray.forEach((index) => {
    squares[currentPosition + index].classList.add("block");
    squares[currentPosition + index].style.backgroundImage = colors[randomColour];
  });
}

// Undraw the shape
function undraw() {
  rotationArray.forEach((index) => {
    squares[currentPosition + index].classList.remove("block");
    squares[currentPosition + index].style.backgroundImage = "none";
  });
}

// Move the shape down
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

// Move right and prevent collisions with shapes moving right
function moveRight() {
  undraw();
  const isAtRightEdge = rotationArray.some((index) => {
    return (currentPosition + index) % width === width - 1;
  });

  const isAtAnotherBlock = rotationArray.some((index) => {
    return squares[currentPosition + index].classList.contains("block2");
  });

  if (!isAtRightEdge) {
    currentPosition += 1;
  }

  if (isAtAnotherBlock) {
    currentPosition -= 1;
  }
  draw();
}

// Move left and prevent collisions with shapes moving left

function moveLeft() {
  undraw();
  const isAtLeftEdge = rotationArray.some((index) => {
    return (currentPosition + index) % width === 0;
  });
  const isAtAnotherBlock = rotationArray.some((index) => {
    return squares[currentPosition + index].classList.contains("block2");
  });

  if (!isAtLeftEdge) {
    currentPosition -= 1;
  }

  if (isAtAnotherBlock) {
    currentPosition += 1;
  }
  draw();
}

// Rotate Shapes
function rotate() {
  const isAtLeftEdge = rotationArray.some((index) => {
    return (currentPosition + index) % width === 0;
  });
  const isAtRightEdge = rotationArray.some((index) => {
    return (currentPosition + index) % width === width - 1;
  });

  const isAtSecondToLastColumn = rotationArray.some((index) => {
    return (currentPosition + index) % width === width - 2;
  });

  const isAtAnotherBlock = rotationArray.some((index) => {
    return squares[currentPosition + index].classList.contains("block2");
  });

  if (random === 3) {
    return;
  }

  if (random === 4 && isAtSecondToLastColumn) {
    moveLeft();
  }

  if (isAtRightEdge) {
    if (random === 0 && currentRotation === 2) {
      moveLeft();
    } else if (random === 1 && currentRotation === 0) {
      moveLeft();
    } else if (random === 2 && currentRotation === 3) {
      moveLeft();
    } else if (random === 2 && currentRotation === 2) {
      moveRight();
    } else if ((random === 4 && currentRotation === 0) || currentRotation === 2) {
      moveLeft();
      moveLeft();
    }
  }

  if (isAtLeftEdge) {
    if (random === 0 && currentRotation === 0) {
      moveRight();
    } else if (random === 2 && currentRotation === 1) {
      moveRight();
    } else if ((random === 4 && currentRotation === 0) || currentRotation === 2) {
      moveRight();
    }
  }

  undraw();
  currentRotation++;
  if (currentRotation === rotationArray.length) {
    currentRotation = 0;
  }

  rotationArray = shapes[random][currentRotation];

  draw();
}

// Show next shape
const displayWidth = 4;
const displayIndex = 0;

const smallShapes = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2], // L Shape
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // Z Shape
  [1, displayWidth, displayWidth + 1, displayWidth + 2], // T Shape
  [0, 1, displayWidth, displayWidth + 1], // O Shape
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //I Shape
];

function displayShape() {
  displaySquares.forEach((square) => {
    square.classList.remove("block");
    square.style.backgroundImage = "none";
  });
  console.log(nextRandom, random);
  if (nextRandom === 0) {
    nextShape.style.left = "5px";
  } else if (nextRandom === 1) {
    nextShape.style.left = "30px";
  } else if (nextRandom === 2 || nextRandom === 4) {
    nextShape.style.left = "15px";
  } else if (nextRandom === 3) {
    nextShape.style.left = "27px";
  }

  smallShapes[nextRandom].forEach((index) => {
    displaySquares[displayIndex + index].classList.add("block");
    displaySquares[displayIndex + index].style.backgroundImage = colors[nextRandomColour];
  });
}

// Freeze the shape
function freeze() {
  if (
    rotationArray.some((index) => {
      return squares[currentPosition + index + width].classList.contains("block3") || squares[currentPosition + index + width].classList.contains("block2");
    })
  ) {
    rotationArray.forEach((index) => {
      squares[index + currentPosition].classList.add("block2");
    });

    random = nextRandom;
    randomColour = nextRandomColour;
    nextRandom = Math.floor(Math.random() * shapes.length);
    nextRandomColour = Math.floor(Math.random() * colors.length);
    rotationArray = shapes[random][currentRotation];
    currentPosition = 4;
    draw();
    displayShape();
    gameOver();
    addScore();
  }
}

// Game Over
function gameOver() {
  if (
    rotationArray.some((index) => {
      return squares[currentPosition + index].classList.contains("block2");
    })
  ) {
    gameEnded = true;
    clearInterval(timerId);
  }
}

function addScore() {
  for (rotationArrayIndex = 0; rotationArrayIndex < gridSize; rotationArrayIndex += width) {
    const row = [
      rotationArrayIndex,
      rotationArrayIndex + 1,
      rotationArrayIndex + 2,
      rotationArrayIndex + 3,
      rotationArrayIndex + 4,
      rotationArrayIndex + 5,
      rotationArrayIndex + 6,
      rotationArrayIndex + 7,
      rotationArrayIndex + 8,
      rotationArrayIndex + 9,
    ];

    if (row.every((index) => squares[index] && squares[index].classList.contains("block2"))) {
      score += 10;
      lines += 1;
      scoreDisplay.innerHTML = `Score: ${score}`;
      linesDisplay.innerHTML = `Lines Cleared: ${lines}`;

      row.forEach((index) => {
        squares[index].classList.remove("block2", "block");
      });

      // Remove the complete row from the `squares` array
      squares.splice(rotationArrayIndex, width).forEach((cell) => {
        grid.removeChild(cell);
      });

      // Add new blank squares at the top of the grid
      for (let i = 0; i < width; i++) {
        const newSquare = document.createElement("div");
        grid.prepend(newSquare);
      }

      // Update the `squares` array to reflect the new state of the grid
      squares = Array.from(grid.querySelectorAll("div"));
    }
  }
}

// Start the game

startBtn.addEventListener("click", () => {
  if (gameEnded) {
    return;
  }

  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    draw();
    timerId = setInterval(moveDown, 1000);
    nextRandom = Math.floor(Math.random() * shapes.length);
    displayShape();
  }
});

resetBtn.addEventListener("click", () => {
  location.reload();
});
