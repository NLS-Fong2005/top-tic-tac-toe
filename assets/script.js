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

  function markBox(row, column, turn) {
    if (row < 0 || column < 0) {
      console.error("Less than space.");
      return;
    }

    if (row > 2 || column > 2) {
      console.error("Exceeded space.");
      return;
    }
    
    if (boardState[row][column] === 1) {
      console.error("Space already marked.");
      return;
    }


    boardState[row][column] = (turn === "cross") ? "x" : "o";
  }

  function printBoardState() {
    console.table(boardState);
  }

  function checkWinCondition() {
    const horizontalWin = row => !row.includes(0) && row.every(val => val === row[0]);

    console.log(horizontalWin(["x", "x", "x"]));
    console.log(horizontalWin(["x", "o", "x"]));
    console.log(horizontalWin(["x", "x", "0"]));
    console.log(horizontalWin([0, 0, 0])); 
  }

  return { createInitialBoard, markBox, printBoardState, checkWinCondition }
};

function Player(name) {
  const getInput = () => {
    let row = Number(prompt(`${name}'s Turn: Row Number`));
    let column = Number(prompt(`${name}'s turn: Column Number?`));

    return {row, column};
  }

  return {getInput};
}

function Match() {
  var gameBoard = GameBoard();
  var uno = Player("Uno");
  var duo = Player("Duo");

  gameBoard.createInitialBoard();
  gameBoard.checkWinCondition();
}

var match = Match();