function GameBoard() {
  const columns = 3;
  const rows = 3;
  let boardState = [];

  function createInitialBoard() {
    for(let i = 0; i < rows; i++) {
      var column = [];
      for (let n = 0; n < columns; n++) {
        column.push(0);
      }

      boardState.push(column);
    }
  }

  function clearBoardState() {
    boardState = [];
    const board = document.querySelector(".board");
    Array.from(board.children).forEach((child, _) => {
      child.classList = "";
      child.textContent = "";

      child.classList.add("cell");
    })
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
    printBoardState();
  }

  function printBoardState() {
    console.table(boardState);
  }

  function checkWinCondition() {
    console.log("Entered");
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

  return { createInitialBoard, clearBoardState, boxIsValid, markBox, printBoardState, checkWinCondition }
};

function Player(name) {
  let wins = 0;
  let losses = 0;

  return {name, wins, losses};
}

function Match(playerOne, playerTwo) {
  var gameBoard = GameBoard();
  const indexToCell = {
    0 : [0, 0],
    1 : [0, 1],
    2 : [0, 2],
    3 : [1, 0],
    4 : [1, 1],
    5 : [1, 2],
    6 : [2, 0],
    7 : [2, 1],
    8 : [2, 2],
  }

  function setPlayerDetails(playerOne, playerTwo) {
    const playerOneHeader = document.querySelector(".playerOne");
    const playerTwoHeader = document.querySelector(".playerTwo");

    playerOneHeader.textContent = playerOne.name;
    playerTwoHeader.textContent = playerTwo.name;

    const playerOneWins = document.querySelector(".playerOneWins");
    const playerOneLosses = document.querySelector(".playerOneLosses");
    const playerTwoWins = document.querySelector(".playerTwoWins");
    const playerTwoLosses = document.querySelector(".playerTwoLosses");

    playerOneWins.textContent = `W: ${playerOne.wins}`;
    playerOneLosses.textContent = `L: ${playerOne.losses}`;
    playerTwoWins.textContent = `W: ${playerTwo.wins}`;
    playerTwoLosses.textContent = `L: ${playerTwo.losses}`;
  }

  function createMark(turn) {
    const span = document.createElement('span');
    if (turn === 'cross') {
      span.classList.add("material-symbols-outlined", "cross");
      span.textContent = "close";
    } else {
      span.classList.add("material-symbols-outlined", "circle");
      span.textContent = "circle";
    }

    return span;
  }

  function showGameOverDialog(winner) {
    const dialog = document.getElementById("newGameDialog");
    const winningHeader = document.querySelector(".winningHeader");
    const button = document.querySelector(".newGameButton")

    winningHeader.textContent = winner.name;

    dialog.showModal();

    button.addEventListener('click', () => {
      dialog.close();
      gameBoard.clearBoardState();
      startMatch();
    })
  }

  function startMatch() {
    var turnNumber = 1;
    gameBoard.createInitialBoard();
    setPlayerDetails(playerOne, playerTwo);

    const board = document.querySelector(".board");
    Array.from(board.children).forEach((child, index) => {
      child.addEventListener('click', () => {
        let turn = (turnNumber % 2 === 0) ? 'circle' : 'cross';
        let [row, column] = indexToCell[index];

        if (!gameBoard.boxIsValid(row, column)) {
          return;
        }

        gameBoard.markBox(row, column, turn);
        child.appendChild(createMark(turn));

        if (gameBoard.checkWinCondition()) {
          const winner = (turn === 'cross') ? playerOne : playerTwo;
          const loser = (turn !== 'cross') ? playerOne : playerTwo;

          winner.wins++;
          loser.losses++;

          console.log(`Winner: ${winner.name}`);
          showGameOverDialog(winner);
        }

        turnNumber = ++turnNumber;
      })
    })
  }
  return {startMatch};
}

const dialog = document.querySelector("dialog");
dialog.addEventListener('close', () => {
  if (dialog.returnValue === 'save') {
    let playerOneName = document.forms['playerCreator']['playerOne'].value;
    let playerTwoName = document.forms['playerCreator']['playerTwo'].value;

    let playerOne = new Player(playerOneName);
    let playerTwo = new Player(playerTwoName);

    var match = Match(playerOne, playerTwo);
    match.startMatch();
  }
})
