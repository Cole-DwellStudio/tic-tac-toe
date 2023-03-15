const gameBoard = (() => {
  const rows = 3;
  const columns = 3;
  var board = [];
  const winCondArray = [[[0], []]];

  // INITIALIZE OUR BOARD ARRAY:
  // add three arrays to our board array to represent the rows
  // store a cell object in each grid cell
  const initBoard = () => {
    for (let row = 0; row < rows; row++) {
      // create a new empty row array for each row
      board[row] = [];
      for (let column = 0; column < columns; column++) {
        // add a new Cell object for each column in the row
        board[row].push(Cell());
      }
    }
  };

  initBoard();

  const resetBoard = () => {
    board = [];
    initBoard();
  };

  const getBoard = () => board;

  const setToken = (index, playerToken) => {
    board[index[0]][index[1]].setToken(playerToken);
    return true;
  };

  // expose public methods:
  return { getBoard, setToken, resetBoard };
})();

const player = {
  create: function (name, token) {
    var instance = Object.create(this);
    instance.name = name;
    instance.token = token;
    return instance;
  },

  token: "",
  name: "",
  score: "",

  returnScore: function () {
    return this.score;
  },
};

function Cell() {
  let token = "";

  const setToken = (playerToken) => {
    token = playerToken;
  };

  const getToken = () => token;

  return {
    getToken,
    setToken,
  };
}

const GameController = (() => {
  const board = gameBoard;
  // store a list of players
  const players = [
    player.create("Player One", "x"),
    player.create("Player Two", "o"),
  ];

  // active player defaults to the first player in the players array
  let activePlayer = players[0];

  let winningPlayer;

  // check if the active is the first player, if it is, change it to the second and vice versa
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const checkWinner = () => {
    let rowValues = [];
    board.getBoard().forEach((row) => {
      row.forEach((cell) => {
        rowValues.push(cell.getToken());
      });
      if (
        rowValues[0] !== "" &&
        rowValues.every((value, i, arr) => value === arr[0])
      ) {
        winningPlayer = activePlayer;
      }
    });
    if (
      rowValues[0] !== "" &&
      rowValues[0] == rowValues[4] &&
      rowValues[0] == rowValues[8]
    ) {
      winningPlayer = activePlayer;
    }
    if (
      rowValues[2] !== "" &&
      rowValues[2] == rowValues[4] &&
      rowValues[2] == rowValues[6]
    ) {
      winningPlayer = activePlayer;
    }
  };

  const checkForTie = () => {
    var fullCells = 0;
    board.getBoard().forEach((row) => {
      row.forEach((cell) => {
        if (cell.getToken() !== "") {
          fullCells++;
        }
      });
    });
    if (fullCells >= 9) {
      return true;
    } else {
      return false;
    }
  };

  const playRound = (index) => {
    if (!index || winningPlayer) {
      return;
    }
    // check if the cell the player clicked on is already taken
    // if so warn the player and return early
    if (board.getBoard()[index[0]][index[1]].getToken() !== "") {
      console.log("That cell is already taken, try again!");
      return;
    }

    board.setToken(index, activePlayer.token);

    checkWinner();

    if (!winningPlayer) {
      if (checkForTie()) {
        alert("Game tied");
        return;
      }
    }

    if (winningPlayer) {
      alert(`${winningPlayer.name} has won!`);
      return;
    }

    switchPlayerTurn();
  };

  const resetGame = () => {
    winningPlayer = null;
    board.resetBoard();
  };

  const getActivePlayer = () => activePlayer;
  const getPlayers = () => players;

  // return (expose) functions and variables for public use
  return { getPlayers, getActivePlayer, playRound, resetGame };
})();

const ScreenController = (() => {
  const game = GameController;
  const board = gameBoard;
  const boardElement = document.querySelector(".board");
  const activePlayerElement = document.querySelector(".activePlayer");
  const restartButtonElement = document.querySelector(".restartButton");

  restartButtonElement.addEventListener("click", () => {
    game.resetGame();
    renderBoard();
  });

  const renderBoard = () => {
    boardElement.textContent = "";
    activePlayerElement.textContent = `${game.getActivePlayer().name}'s turn`;

    activePlayerElement.classList.add("text-2xl", "font-bold");

    board.getBoard().forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        // console.log(`${rowIndex},${columnIndex}`);
        const cellButton = document.createElement("button");
        const cellToken = document.createElement("img");

        cellToken.classList.add(
          "absolute",
          "top-0",
          "left-0",
          "right-0",
          "bottom-0",
          "overflow-clip",
          "p-3"
        );

        if (cell.getToken() == "") {
          cellToken.src = "";
        } else {
          cellToken.src =
            cell.getToken() == "x" ? "./cross.png" : "./circle.png";
        }

        cellButton.classList.add(
          "bg-white",
          "rounded-lg",
          "shadow-md",
          "hover:bg-slate-50",
          "relative"
        );

        cellButton.appendChild(cellToken);
        cellButton.dataset.index = `${rowIndex}${columnIndex}`;

        cellButton.addEventListener("click", clickHandler);

        boardElement.appendChild(cellButton);
      });
    });
  };

  clickHandler = function (clickEvent) {
    const clickedCell = clickEvent.target.dataset.index;

    if (!clickedCell) return;

    game.playRound(clickedCell);
    updateScreen();
  };

  const updateScreen = () => {
    renderBoard();
  };

  return {
    updateScreen,
  };
})();

GameController.playRound();
ScreenController.updateScreen();
