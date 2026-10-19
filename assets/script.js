function gameBoard() {
  this.columns = 3;
  this.rows = 3;
  this.boardState = [];
    
  for(let i = 0; i < this.rows; i++) {
    var column = [];
    for (let n = 0; n < this.columns; n++) {
      column.push(0);
    }
    this.boardState.push(column);
  }

  console.log(this.boardState);
};

const game = gameBoard();