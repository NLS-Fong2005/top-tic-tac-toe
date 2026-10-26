function GameBoard() {
  const columns = 3;
  const rows = 3;
  const boardState = [];

  function createInitialBoard() {
    for(let i = 0; i < rows; i++) {
      var column = [];
      for (let n = 0; n < columns; n++) {
        column.push(0);
      }

      boardState.push(column);
    }
  }

  function boxIsValid(row, column) {
    if (row < 0 || column < 0) {
      console.error("Less than space.");
      return false;
    }

    if (row > 2 || column > 2) {
      console.error("Exceeded space.");
      return false;
    }
    
    if (boardState[row][column] !== 0) {
      console.error("Space already marked.");
      return false;      
    }

    return true;
  }

  function markBox(row, column, turn) {
    boardState[row][column] = (turn === "cross") ? "x" : "o";
  }

  function printBoardState() {
    console.table(boardState);
  }

  function checkWinCondition() {
    const threeInARow = row => !row.includes(0) && row.every(val => val === row[0]);

    const horizontalWin = () => {
      boardState.forEach(row => {
        if (threeInARow(row)) return true;
        return false;
      })
    }

    const verticalWin = () => {
      for (var colNum = 0; colNum < 3; colNum++) {
        if (threeInARow([0, 1, 2].map(i => boardState[i][colNum]))) return true;
        return false;
      }
    }

    const diagonalWin = () => threeInARow([0, 1, 2].map(i => boardState[i][i])) || threeInARow([0, 1, 2].map(i => boardState[i][2 - i]));
    

    const win = [horizontalWin(), verticalWin(), diagonalWin()];
    return win.includes(true);
  }

  // [0, 0, 0]
  // [0, 0, 0]
  // [0, 0, 0]

  return { createInitialBoard, boxIsValid, markBox, printBoardState, checkWinCondition }
};

function Player(name) {
  const getInput = () => {
    let row = Number(prompt(`${name}'s Turn: Row Number`));
    let column = Number(prompt(`${name}'s turn: Column Number?`));

    return {row, column};
  }

  return {name, getInput};
}

function Match() {
  var gameBoard = GameBoard();
  var turnNumber = 0;
  const playerOne = Player("Articuno");
  const playerTwo = Player("Zapdos");

  gameBoard.createInitialBoard();

  while(!gameBoard.checkWinCondition()) {
    if (turnNumber > 9) {
      break;
    }

    turnNumber = ++turnNumber;
    console.log(`Turn Number: ${turnNumber}`);
    gameBoard.printBoardState();

    var input = (turnNumber % 2 === 0) ? playerTwo.getInput() : playerOne.getInput();
    var turn = (turnNumber % 2 === 0) ? "circle" : "cross";

    if (gameBoard.boxIsValid(input.row, input.column, turn)) {
      gameBoard.markBox(input.row, input.column, turn);
    }

    else {
      turnNumber = --turnNumber;
    }

  }

  const winner = (turnNumber % 2 === 0) ? playerTwo.name : playerOne.name; 
  console.log(`Winner: ${winner}`);
  gameBoard.printBoardState();
}

var match = Match();