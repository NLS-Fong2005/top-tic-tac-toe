function GameBoard() {
  const columns = 3;
  const rows = 3;
  let boardState = [];

  function createInitialBoard() {
    boardState = [];
    for (let i = 0; i < rows; i++) {
      let column = [];
      for (let n = 0; n < columns; n++) {
        column.push(0);
      }
      boardState.push(column);
    }
  }

  function clearBoardState() {
    createInitialBoard();
    const board = document.querySelector(".board");
    Array.from(board.children).forEach((child) => {
      child.classList = "cell";
      child.textContent = "";
    });
  }

  function boxIsValid(row, column) {
    if (row < 0 || column < 0 || row > 2 || column > 2) {
      console.error("Out of bounds.");
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
    const threeInARow = row => !row.includes(0) && row.every(val => val === row[0]);

    const horizontalWin = () => boardState.some(row => threeInARow(row));

    const verticalWin = () => {
      for (let colNum = 0; colNum < 3; colNum++) {
        if (threeInARow([0, 1, 2].map(i => boardState[i][colNum]))) return true;
      }
      return false;
    };

    const diagonalWin = () => 
      threeInARow([0, 1, 2].map(i => boardState[i][i])) || 
      threeInARow([0, 1, 2].map(i => boardState[i][2 - i]));

    return horizontalWin() || verticalWin() || diagonalWin();
  }

  return { createInitialBoard, clearBoardState, boxIsValid, markBox, printBoardState, checkWinCondition };
}

function Player(name) {
  let wins = 0;
  let losses = 0;
  return { name, wins, losses };
}

function Match(playerOne, playerTwo) {
  const gameBoard = GameBoard();
  let turnNumber = 1;
  let isGameOver = false;

  const indexToCell = {
    0: [0, 0], 1: [0, 1], 2: [0, 2],
    3: [1, 0], 4: [1, 1], 5: [1, 2],
    6: [2, 0], 7: [2, 1], 8: [2, 2],
  };

  function setPlayerDetails() {
    document.querySelector(".playerOne").textContent = playerOne.name;
    document.querySelector(".playerTwo").textContent = playerTwo.name;
    document.querySelector(".playerOneWins").textContent = `W: ${playerOne.wins}`;
    document.querySelector(".playerOneLosses").textContent = `L: ${playerOne.losses}`;
    document.querySelector(".playerTwoWins").textContent = `W: ${playerTwo.wins}`;
    document.querySelector(".playerTwoLosses").textContent = `L: ${playerTwo.losses}`;
  }

  function createMark(turn) {
    const span = document.createElement("span");
    if (turn === "cross") {
      span.classList.add("material-symbols-outlined", "cross");
      span.textContent = "close";
    } else {
      span.classList.add("material-symbols-outlined", "circle");
      span.textContent = "circle";
    }
    return span;
  }

  function handleCellClick(e) {
    const cell = e.target.closest(".cell");
    if (!cell || isGameOver) return;

    const board = document.querySelector(".board");
    const index = Array.from(board.children).indexOf(cell);
    if (index === -1) return;

    const [row, column] = indexToCell[index];
    const turn = (turnNumber % 2 === 0) ? "circle" : "cross";

    if (!gameBoard.boxIsValid(row, column)) return;

    gameBoard.markBox(row, column, turn);
    cell.appendChild(createMark(turn));

    if (gameBoard.checkWinCondition()) {
      isGameOver = true;
      const winner = (turn === "cross") ? playerOne : playerTwo;
      const loser = (turn !== "cross") ? playerOne : playerTwo;

      winner.wins++;
      loser.losses++;
      setPlayerDetails();

      showGameOverDialog(winner);
      return;
    }

    turnNumber++;
  }

  function setupEventListeners() {
    const board = document.querySelector(".board");
    board.addEventListener("click", handleCellClick);

    const dialogButton = document.querySelector(".newGameButton");
    dialogButton.addEventListener("click", () => {
      const dialog = document.getElementById("newGameDialog");
      dialog.close();
      resetMatch();
    });
  }

  function showGameOverDialog(winner) {
    const dialog = document.getElementById("newGameDialog");
    document.querySelector(".winningHeader").textContent = winner.name;
    dialog.showModal();
  }

  function resetMatch() {
    turnNumber = 1;
    isGameOver = false;
    gameBoard.clearBoardState();
  }

  function startMatch() {
    gameBoard.createInitialBoard();
    setPlayerDetails();
    setupEventListeners();
  }

  return { startMatch };
}

const dialog = document.querySelector("dialog");
dialog.addEventListener("close", () => {
  if (dialog.returnValue === "save") {
    let playerOneName = document.forms["playerCreator"]["playerOne"].value;
    let playerTwoName = document.forms["playerCreator"]["playerTwo"].value;

    let playerOne = Player(playerOneName);
    let playerTwo = Player(playerTwoName);

    var match = Match(playerOne, playerTwo);
    match.startMatch();
  }
});