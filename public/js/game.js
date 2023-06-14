const canvas = document.getElementById('Tetris');
const context = canvas.getContext('2d');
const grid = 32;
const gameOver = true

const blockBag = [];

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
    // get the shape from the name
    // get starting column
    // get starting row

    // return data
}


//rotate pieces
function rotateMatrix(matrix) {
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

// console.log(rotateMatrix(blockShapes['I']))
// console.log(rotateMatrix(blockShapes['S']))
// console.log(rotateMatrix(blockShapes['T']))
// console.log(rotateMatrix(blockShapes['Z']))


// check collision

// check if lines are filled and need to cleared and points should come

// check if the move can be done?
  // get shape, get location of shape (that would be it's column/row)
  // loop through the parts of that shape

// only the active block can be interacted with, when it reaches the bottom it becomes inactive, create a function that does this
  // check if lines are filled with the line filled function
  // 

// loop through animation
    // draw gamezone
    // draw active block
    // if the block hits something run the turn inactive function

// game over function
  // cancel all animations
  // gameOver = true

// user input

// start game