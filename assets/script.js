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

  function markBox(row, column) {
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


    boardState[row][column] = 1;
  }

  function printBoardState() {
    console.table(boardState);
  }

  createInitialBoard();
  printBoardState();
  var uno = Player("Uno"); 

  var input = uno.getInput();
  markBox(input.row, input.column);
  printBoardState();
};

function Player(name) {
  const getInput = () => {
    let row = Number(prompt("Row Number?"));
    let column = Number(prompt("Column Number?"));

    return {row, column};
  }

  return {getInput};
}

const game = GameBoard();