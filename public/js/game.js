const canvas = document.getElementById('tetris')
const context = canvas.getContext('2d')
const blockSize = 32;
let score = 0
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
}

// game over function
function showGameOver() {
  // window method to stop animation
  cancelAnimationFrame(rAF);
  gameOver = true;

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
});

// start game
rAF = requestAnimationFrame(gameLoop)