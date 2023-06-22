const scoreBoard = document.getElementById("score-board")
const canvas = document.getElementById('tetris')
const context = canvas.getContext('2d')
const blockSize = 32;
const columns = 10
let score = 0
scoreBoard.innerHTML = "Score: " + score;

//save tetromino
const savedTetrominoCanvas = document.getElementById('saved-tetromino');
const savedTetrominoContext = savedTetrominoCanvas.getContext('2d');
let savedTetromino = null;

//next tetromino
const nextTetrominoCanvas = document.getElementById('next-tetromino');
const nextTetrominoContext = nextTetrominoCanvas.getContext('2d');

// gameover should be defaulted to false, had it set to true oops
let gameOver = false

let timer = 0;
let rAF = null  // for canvas animations default to null so we can start and end it

const blockBag = []

// create the shapes of the blocks
const blockShapes = {
  'I': [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  'J': [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  'L': [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  'O': [
    [1, 1],
    [1, 1],
  ],
  'S': [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  'Z': [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  'T': [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ]
}

// set up more data about the blocks?

// sets the colors for the tetrominoes
const colors = {
  'I': ['#00ffff'],
  'O': ['#ffff00'],
  'T': ['#800080'],
  'S': ['#39892F'],
  'Z': ['#FD3F59'],
  'J': ['#485DC5'],
  'L': ['#FE4819']
};

//get random number with min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// create the area that will be played in
const gameZone = []

// tetris has 20 rows and 10 columns
const zoneRows = 20
const zoneColumns = 10

// create a matrix for the gameZone using zoneRows and zoneColumns, it's like all right here idk if i need these variables
// row starts at -2 so that there are 2 STARTER rows for blocks or tiles or whatever to appear
for (let row = -2; row < zoneRows; row++) {
  gameZone[row] = []

  for (let col = 0; col < zoneColumns; col++) {
    gameZone[row][col] = 0
  }
}

// generate a "bag" of tiles for use in game
// this is something that REAL tetris does :^)

generateBag = () => {
  const blockNames = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']

  while (blockNames.length) {
    const randy = getRandomInt(0, blockNames.length - 1)
    const name = blockNames.splice(randy, 1)[0]
    blockBag.push(name)
  }
}

// go into the blockbag and get the next matrix tile
getNextBlock = () => {
  // check if the bag exists and create one if it doesnt
  if (blockBag.length === 0) {
    generateBag()
  }

  // get a name from the bag
  const name = blockBag.pop()

  // checks again if the bag exists - if there isnt anything then create a new bag.
  if (blockBag.length === 0) {
    generateBag()
  }
  // get the shape from the name
  const localShape = blockShapes[name]
  // get starting column
  // stuff starts in the middle, use first row, divide by 2
  // it's an equation so if we make the tetris field huge this doesn't need be changed
  startingCol = gameZone[0].length / 2
  // get starting row
  // all things start at -1 and have a nice little head room with -2
  startingRow = -1

  // return data it's an object that knows everthing about the way it looks

  return {
    name: name,
    shape: localShape,
    row: startingRow,
    col: startingCol
  }
}

drawNextTetromino = () => {
  nextTetrominoContext.clearRect(0, 0, nextTetrominoCanvas.width, nextTetrominoCanvas.height);

  if (blockBag.length > 0) {
    const nextBlock = blockShapes[blockBag[blockBag.length - 1]];
    const blockSize = nextTetrominoCanvas.width / nextBlock.length;

    for (let r = 0; r < nextBlock.length; r++) {
      for (let c = 0; c < nextBlock[r].length; c++) {
        if (nextBlock[r][c]) {
          const color = colors[blockBag[blockBag.length - 1]][0]; // Use the color of the next tetromino
          nextTetrominoContext.fillStyle = color;
          nextTetrominoContext.fillRect(c * blockSize, r * blockSize, blockSize - 1, blockSize - 1);
        }
      }
    }
  }
}

drawNextTetromino();

const drawSavedTetromino = () => {
  savedTetrominoContext.clearRect(0, 0, savedTetrominoCanvas.width, savedTetrominoCanvas.height);

  if (savedTetromino) {
    const blockSize = savedTetrominoCanvas.width / savedTetromino.shape.length;

    for (let r = 0; r < savedTetromino.shape.length; r++) {
      for (let c = 0; c < savedTetromino.shape[r].length; c++) {
        if (savedTetromino.shape[r][c]) {
          const color = colors[savedTetromino.name][0];
          savedTetrominoContext.fillStyle = color;
          savedTetrominoContext.fillRect(c * blockSize, r * blockSize, blockSize - 1, blockSize - 1);
        }
      }
    }
  }
};

// Function to save the current tetromino
const saveTetromino = () => {
  // If no tetromino is saved, save the current tetromino and get the next one
  if (!savedTetromino) {
    savedTetromino = {
      name: currentBlock.name,
      shape: currentBlock.shape,
      row: currentBlock.row,
      col: currentBlock.col
    };
    currentBlock = getNextBlock();
  }
  // Otherwise, swap the current tetromino with the saved tetromino
  else {
    const tempTetromino = {
      name: currentBlock.name,
      shape: currentBlock.shape,
      row: currentBlock.row,
      col: currentBlock.col
    };
    currentBlock = {
      name: savedTetromino.name,
      shape: savedTetromino.shape,
      row: 0, // Place the saved tetromino at the top
      col: Math.floor((columns - savedTetromino.shape[0].length) / 2) // Center the saved tetromino horizontally
    };
    savedTetromino = tempTetromino;
  }

  drawSavedTetromino();
};

deactivateBlock = () => {
  // ...

  // after a block is deactivated we
  currentBlock = getNextBlock();
  savedTetromino = null;
};

drawShadow = () => {
  const shadowTetromino = {
    ...currentBlock,
    row: currentBlock.row // copies the currentBlock row
  }

  while (isValidMove(shadowTetromino.shape, shadowTetromino.row + 1, shadowTetromino.col)) {
    shadowTetromino.row++;
  }

  // Draw the shadow tetromino on the game zone
  for (let r = 0; r < shadowTetromino.shape.length; r++) {
    for (let c = 0; c < shadowTetromino.shape[r].length; c++) {
      if (shadowTetromino.shape[r][c]) {
        context.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Set the color of the shadow tetromino
        context.fillRect(
          (shadowTetromino.col + c) * blockSize,
          (shadowTetromino.row + r) * blockSize,
          blockSize - 1,
          blockSize - 1
        );
      }
    }
  }
};
// set current block to whatver getNextBlock is for ease of use
let currentBlock = getNextBlock()

//rotate pieces
rotateMatrix = (matrix) => {
  const rows = matrix.length
  const columns = matrix[0].length

  // create a new matrix of the same size
  const newMatrix = new Array(columns)
  for (let i = 0; i < columns; i++) {
    newMatrix[i] = new Array(rows)
  }

  // this goes through the ORIGINAL
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      // column and row are reversed and it works from the HIGHEST row value descending
      newMatrix[col][rows - 1 - row] = matrix[row][col]
    }
  }

  return newMatrix
}

// check if lines are filled and need to cleared and points should come
removeFill = () => {
  let comboMeter = 0
  for (let row = gameZone.length - 1; row >= 0;) {
    if (gameZone[row].every(cell => !!cell)) {
      comboMeter++
      // drop every row above this one
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < gameZone[r].length; c++) {
          gameZone[r][c] = gameZone[r - 1][c];
        }
      }
    }
    else {
      row--;
    }
  }
  score += (comboMeter * 10)
  scoreBoard.innerHTML = "Score: " + score;
  console.log(score)
}

// check if the move can be done?
// get shape, get location of shape (that would be it's column/row)
// loop through the parts of that shape
// checks shape,  checks where it is
isValidMove = (matrix, blockRow, blockCol) => {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] && (
        // we need to check if it's at the max left
        blockCol + c < 0 ||
        // the max right
        blockCol + c >= gameZone[0].length ||
        // or the bottom
        blockRow + r >= gameZone.length ||
        // this checks if any area our matrix block is filled with an already placed block
        gameZone[blockRow + r][blockCol + c])
      ) {
        return false
      }
    }
  }
  // if we're NOT at the EDGE and there's NOT a piece in the way we return true
  return true
}

// only the active block can be interacted with, when it reaches the bottom it becomes inactive, create a function that does this
// check if lines are filled with the line filled function
// 
deactivateBlock = () => {
  for (let r = 0; r < currentBlock.shape.length; r++) {
    for (let c = 0; c < currentBlock.shape[r].length; c++) {
      if (currentBlock.shape[r][c]) {

        // checks if the block has tried to move and ended up in the negatives
        if (currentBlock.row + r < 0) {
          showGameOver()
        }

        gameZone[currentBlock.row + r][currentBlock.col + c] = currentBlock.name
      }
    }
  }


  removeFill()

  // for loop to check for filled rows from the bottom up
  for (let row = gameZone.length - 1; row >= 0; ) {
    if (gameZone[row].every(cell => !!cell)) {

      // lowers the rows that were above the filled one.
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < gameZone[r].length; c++) {
          gameZone[r][c] = gameZone[r-1][c];
        }
      }
    }
    else {
      row--;
    }
  }

  // after a block is deactivated we
  currentBlock = getNextBlock()

}


// loop through animation
// draw gamezone
// draw active block
// if the block hits something run the turn inactive function
function gameLoop() {
  rAF = requestAnimationFrame(gameLoop)
  context.clearRect(0, 0, canvas.width, canvas.height)

  for (let r = 0; r < zoneRows; r++) {
    for (let c = 0; c < zoneColumns; c++) {
      if (gameZone[r][c]) {
        const name = gameZone[r][c]
        context.fillStyle = colors[name]
        context.fillRect(c * blockSize, r * blockSize, blockSize - 1, blockSize - 1)
      }
    }
  }

  // checks if a current block exists
  if (currentBlock) {

    //sets speed of the antimation using a timer
    if (++timer > 40) {
      currentBlock.row++
      timer = 0

      // if the piece hits something on the way down deactivate it 
      if (!isValidMove(currentBlock.shape, currentBlock.row, currentBlock.col)) {
        currentBlock.row--
        deactivateBlock()
      }
    }

    context.fillStyle = colors[currentBlock.name];

    for (let r = 0; r < currentBlock.shape.length; r++) {
      for (let c = 0; c < currentBlock.shape[r].length; c++) {
        if (currentBlock.shape[r][c]) {

          context.fillRect((currentBlock.col + c) * blockSize, (currentBlock.row + r) * blockSize, blockSize - 1, blockSize - 1)
        }
      }
    }
  }
  drawShadow();
  drawNextTetromino();
}

// game over function
function showGameOver() {
  // window method to stop animation
  cancelAnimationFrame(rAF);
  gameOver = true;

  // create highscore
  const user = localStorage.getItem("user_id")
  const newHiScore = score

  fetch(`/api/users/hiscore/${user}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ hiscore: newHiScore })
  })
  .then(response => {
    if (response.ok) {
      console.log('High score updated successfully!');
    } else {
      console.error('Failed to update high score.');
    }
  })
  .catch(error => {
    console.error('Error updating high score:', error);
  });

  // banner overlay for text
  context.fillStyle = 'gray';
  context.globalAlpha = 0.75;
  context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

  // text generation to state the game is over
  context.globalAlpha = 1;
  context.fillStyle = 'white';
  context.font = '36px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
}

document.addEventListener('keydown', function (e) {
  // dont let users play if the game is over
  if (gameOver) return;

  // left and right arrow keys (move)
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {

    if (e.key === 'ArrowLeft') {
      newCol = currentBlock.col - 1
    } else {
      newCol = currentBlock.col + 1
    }

    if (isValidMove(currentBlock.shape, currentBlock.row, newCol)) {
      currentBlock.col = newCol;
    }
  }

  // up arrow key (rotate)
  if (e.key === 'ArrowUp') {
    const newShape = rotateMatrix(currentBlock.shape);
    if (isValidMove(newShape, currentBlock.row, currentBlock.col)) {
      currentBlock.shape = newShape;
    }
  }

  // down arrow key (drop)
  if (e.key === 'ArrowDown') {
    const newRow = currentBlock.row + 1;

    if (!isValidMove(currentBlock.shape, newRow, currentBlock.col)) {
      currentBlock.row = newRow - 1;

      deactivateBlock();
      return;
    }

    currentBlock.row = newRow;
  }

  if(e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' '){
    e.preventDefault();
  };

  if (e.key === ' ') {
    saveTetromino();
  }
});




// start game
rAF = requestAnimationFrame(gameLoop)