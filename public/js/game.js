// !!! make sure to go through and remove all console logs

const canvas = document.getElementById('tetris')
const context = canvas.getContext('2d')
const blockSize = 32;
// gameover should be defaulted to false, had it set to true oops
const gameOver = false

let timer = 0;
let rAF = null  // for canvas animations default to null so we can start and end it

const blockBag = []

// create the shapes of the blocks
const blockShapes = {
    'I': [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    'J': [
      [1,0,0],
      [1,1,1],
      [0,0,0],
    ],
    'L': [
      [0,0,1],
      [1,1,1],
      [0,0,0],
    ],
    'O': [
      [1,1],
      [1,1],
    ],
    'S': [
      [0,1,1],
      [1,1,0],
      [0,0,0],
    ],
    'Z': [
      [1,1,0],
      [0,1,1],
      [0,0,0],
    ],
    'T': [
      [0,1,0],
      [1,1,1],
      [0,0,0],
    ]
}

// set up more data about the blocks?

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
    console.log(blockBag)
}

// go into the blockbag and get the next matrix tile
getNextBlock = () => {
    // check if the bag exists and create one if it doesnt
    if(blockBag.length === 0) {
        console.log("something happened")
        generateBag()
    }

    // get a name from the bag
    const name = blockBag.pop()
    console.log(name)
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
console.log(currentBlock.shape.length)

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

console.log(rotateMatrix(blockShapes['I']))
console.log(rotateMatrix(blockShapes['S']))
console.log(rotateMatrix(blockShapes['T']))
console.log(rotateMatrix(blockShapes['Z']))


// check collision

// check if lines are filled and need to cleared and points should come

removeFill = () => {
  //starting from the bottom, (massive pain), iterate through each row column to check if filled
  for(let r = gameZone.length - 1; r >= 0;) {
    for(let c = 0; c < gameZone[r].length; c++) {
      if(!gameZone[r][c]){

        //then iterate through all the rows ABOVE the row if it was filled and move them
        //down a row, also starting from the bottom
        for(let newR = r; newR >= 0; newR--) {
          for(let newC = c; newC >= gameZone[newR].length; newC++) {
            gameZone[newR][newC] = gameZone[newR - 1][newC]
            //this is probably where score is added
            //maybe increase a number to see how many rows were moved and then add more for
            // a higher number?
          }
        }
      } else {
        // if the row WAS filled we now need to check the current NEW row that was moved down
        // r is only iterated when the row WASN'T cleared
        r--;
      }
    }
}
}
// check if the move can be done?
  // get shape, get location of shape (that would be it's column/row)
  // loop through the parts of that shape
// checks shape,  checks where it is
isValidMove = (matrix, blockRow, blockCol) => {
  for(let r = 0; r < matrix.length; r++) {
    for(let c = 0; c < matrix[r].length; c++) {
      if(matrix[r][c] && (
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
          // return gameOverFunction or whatever it ends up being called
        }

        gameZone[currentBlock.row + r][currentBlock.col + c] = currentBlock.name
      }
    }
  }

  // after a block is deactivated we check for filled rows
  // just stops everything? idk 
  //removeFill()

  // after a block is deactivated we
  currentBlock = getNextBlock()

}


// loop through animation
    // draw gamezone
    // draw active block
    // if the block hits something run the turn inactive function
function gameLoop() {
  rAF = requestAnimationFrame(gameLoop)
  context.clearRect(0,0,canvas.width, canvas.height)

  for (let r = 0; r < zoneRows; r++) {
    for(let c= 0; c < zoneColumns; c++) {
      if(gameZone[r][c]) {
        context.fillStyle = 'red'
        context.fillRect(c*blockSize, r*blockSize, blockSize, blockSize)
      }
    }
  }

  // checks if a current block exists
  if (currentBlock) {

    //sets speed of the antimation using a timer
    if(++timer > 20) {
      currentBlock.row++
      timer = 0
      
      // if the piece hits something on the way down deactivate it 
      if(!isValidMove(currentBlock.shape, currentBlock.row, currentBlock.col)) {
        currentBlock.row--
        deactivateBlock()
      }
    }

    context.fillStyle = "blue"

    for(let r = 0; r < currentBlock.shape.length; r++) {
      for (let c = 0; c < currentBlock.shape[r].length; c++) {
        if (currentBlock.shape[r][c]) {

          context.fillRect((currentBlock.col + c) * blockSize, (currentBlock.row + r) * blockSize, blockSize, blockSize)
        }
      }
    }
  }
}

// game over function
  // cancel all animations
  // gameOver = true

// user input

// start game
rAF = requestAnimationFrame(gameLoop)