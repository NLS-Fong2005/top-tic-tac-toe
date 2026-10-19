function gameBoard() {
  this.columns = 3;
  this.rows = 3;
  this.boardState = [];

  function createInitialBoard() {
    for(let i = 0; i < this.rows; i++) {
      var column = [];
      for (let n = 0; n < this.columns; n++) {
        column.push(0);
      }

      this.boardState.push(column);
    }
  }

  function markBox(row, column) {
    this.boardState[row][column] = 1;
  }

  createInitialBoard();
  console.log(this.boardState);
  markBox(0, 0);
  console.log(this.boardState);
};

const game = gameBoard();