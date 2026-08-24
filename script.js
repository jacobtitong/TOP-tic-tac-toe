const GameBoard = (() => {
  let board = [];
  initializeBoard();

  function Cell() {
    let value = 0;

    const addToken = (token) => {
      value = token;
    };

    const getValue = () => value;
    return { addToken, getValue };
  }

  function initializeBoard() {
    board = [];
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        row.push(Cell());
      }
      board.push(row);
    }
  }

  const placeMark = (row, column, playerToken) => {
    if (board[row][column].getValue() != 0) return { status: false };
    board[row][column].addToken(playerToken);
    const getRowArray = setRowArray(row);
    const getColumnArray = setColumnArray(column);
    const getPrimaryArray = setPrimaryArray(row, column);
    const getSecondaryArray = setSecondaryArray(row, column);
    return {
      status: true,
      getRowArray,
      getColumnArray,
      getPrimaryArray,
      getSecondaryArray,
    };
  };

  const setRowArray = (row) => {
    const rowArray = board[row];
    return rowArray;
  };

  const setColumnArray = (column) => {
    const columnArray = board.map((row) => row[column]);
    return columnArray;
  };

  //   Although this could be much simpler, I applied the same logic I used when creating the "Connect Four" game!
  const setPrimaryArray = (row, column) => {
    const primaryDiagonal = [];
    const range = Math.min(row, column);
    let topMostRow = row - range;
    let leftMostColumn = column - range;
    let currentCell = board[topMostRow][leftMostColumn];

    while (topMostRow <= 2 && leftMostColumn <= 2) {
      primaryDiagonal.push(currentCell);
      if (topMostRow == 2 || leftMostColumn == 2) break;
      currentCell = board[++topMostRow][++leftMostColumn];
    }
    return primaryDiagonal;
  };

  const setSecondaryArray = (row, column) => {
    const secondaryDiagonal = [];
    let bottomMostRow = 2;
    let leftMostColumn = 0;
    const rowRange = bottomMostRow - row;
    const columnRange = column - leftMostColumn;
    const range = Math.min(rowRange, columnRange);
    bottomMostRow = row + range;
    leftMostColumn = column - range;
    let currentCell = board[bottomMostRow][leftMostColumn];

    while (bottomMostRow >= 0 && leftMostColumn <= 2) {
      secondaryDiagonal.push(currentCell);
      if (bottomMostRow == 0 || leftMostColumn == 2) break;
      currentCell = board[--bottomMostRow][++leftMostColumn];
    }
    return secondaryDiagonal;
  };

  const printBoard = () => {
    const boardWithValues = board.map((row) => {
      return row.map((cell) => cell.getValue());
    });
    console.log(boardWithValues);
  };

  const getBoard = () => board;

  const restartGame = () => initializeBoard();

  return { placeMark, printBoard, getBoard, restartGame };
})();

const Players = (() => {
  const playerDetails = [
    {
      name: "Player One",
      token: 1,
    },
    {
      name: "Player Two",
      token: 2,
    },
  ];

  const setPlayerNames = (firstName, secondName) => {
    playerDetails[0].name = firstName;
    playerDetails[1].name = secondName;
  };

  const getPlayers = () => playerDetails;

  return { setPlayerNames, getPlayers };
})();

const GameController = (() => {
  const playerDetails = Players.getPlayers();
  let activePlayer = playerDetails[0];
  let winExists = false;
  let boardFull = false;

  const switchActivePlayer = () => {
    if (activePlayer == playerDetails[0]) {
      activePlayer = playerDetails[1];
      return;
    }
    activePlayer = playerDetails[0];
  };

  const playRound = (row, column) => {
    if (winExists || boardFull) return;

    const placed = GameBoard.placeMark(row, column, activePlayer.token);
    if (!placed.status) {
      console.log("Position already taken! Try again.");
      printRound();
      return;
    }
    winExists = checkPotentialWin(placed, activePlayer);
    boardFull = checkBoardStatus();

    if (winExists) {
      console.log(`${activePlayer.name} wins!`);
      GameBoard.printBoard();
      return;
    }

    if (boardFull) {
      console.log("Tie! Try again.");
      GameBoard.printBoard();
      return;
    }
    switchActivePlayer();
    printRound();
  };

  const printRound = () => {
    GameBoard.printBoard();
    console.log(`It's ${activePlayer.name}'s turn!`);
  };

  printRound();

  const checkBoardStatus = () => {
    let full = true;
    GameBoard.getBoard().forEach((row) => {
      row.forEach((cell) => {
        if (cell.getValue() == 0) {
          full = false;
        }
      });
    });
    return full;
  };

  const checkPotentialWin = (arr, activePlayer) => {
    let winExists = false;
    const findConsecutiveTokens = (() => {
      const checkConsecutive = (direction) => {
        consecutiveTokens = direction
          .map((cell) => cell.getValue())
          .map((item) => (item != activePlayer.token ? 0 : activePlayer.token));
        consecutiveTokens = consecutiveTokens
          .join("")
          .split("0")
          .filter((item) => item !== "");
        return getWin(consecutiveTokens);
      };
      const getWin = (consecutiveTokens) => {
        let win = false;
        consecutiveTokens.forEach((consecutiveItems) => {
          if (consecutiveItems.length == 3) {
            win = true;
          }
        });
        return win;
      };
      return { checkConsecutive };
    })();
    winExists = findConsecutiveTokens.checkConsecutive(arr.getRowArray);
    if (!winExists) {
      winExists = findConsecutiveTokens.checkConsecutive(arr.getColumnArray);
      if (!winExists) {
        winExists = findConsecutiveTokens.checkConsecutive(arr.getPrimaryArray);
        if (!winExists) {
          winExists = findConsecutiveTokens.checkConsecutive(
            arr.getSecondaryArray,
          );
        }
      }
    }
    return winExists;
  };

  const restartGame = () => {
    activePlayer = playerDetails[0];
    GameBoard.restartGame();
    printRound();
  };

  const getActivePlayer = () => activePlayer;
  const getWinStatus = () => winExists;
  const restartWinStatus = () => (winExists = false);
  const getBoardStatus = () => boardFull;
  const restartBoardStatus = () => (boardFull = false);

  return {
    playRound,
    restartGame,
    getActivePlayer,
    getWinStatus,
    getBoardStatus,
    restartWinStatus,
    restartBoardStatus,
  };
})();

const ScreenController = () => {
  const gameStatus = document.querySelector(".game-status");
  const board = document.querySelector(".board");
  const gameContainer = document.querySelector(".game-container");

  const renderStatus = () => {
    if (GameController.getWinStatus()) {
      gameStatus.textContent = `${GameController.getActivePlayer().name} wins!`;
      return;
    }

    if (GameController.getBoardStatus()) {
      gameStatus.textContent = `Tie! Try again.`;
      return;
    }
    gameStatus.textContent = `It's ${GameController.getActivePlayer().name}'s turn.`;
  };
  renderStatus();

  const renderBoard = () => {
    board.textContent = "";
    GameBoard.getBoard().forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const button = document.createElement("button");
        button.classList.add("cell");
        button.textContent = cell.getValue();
        button.dataset.column = columnIndex;
        button.dataset.row = rowIndex;
        button.dataset.player = cell.getValue();
        board.appendChild(button);
      });
    });
  };
  renderBoard();

  const getGameContainer = () => gameContainer;

  function addToken(e) {
    if (GameController.getWinStatus() || GameController.getBoardStatus())
      return;
    const selectedCell = {
      row: e.target.dataset.row,
      column: e.target.dataset.column,
    };
    if (!selectedCell.row || !selectedCell.column) return;
    const restartButton = document.querySelector(".restart-button");
    GameController.playRound(
      Number(selectedCell.row),
      Number(selectedCell.column),
    );
    renderStatus();
    renderBoard();
    if (GameController.getWinStatus() || GameController.getBoardStatus()) {
      restartButton.removeAttribute("style");
      restartButton.addEventListener("click", (e) => {
        GameController.restartGame();
        GameController.restartWinStatus();
        GameController.restartBoardStatus();
        renderStatus();
        renderBoard();
        restartButton.setAttribute("style", "display: none");
      });
    }
  }

  board.addEventListener("click", addToken);
  return { getGameContainer };
};

const startMenu = (() => {
  const startButton = document.querySelector(".play-button");
  const startUI = document.querySelector(".start");
  const form = document.querySelector("form");

  const displayForm = () => {
    startUI.setAttribute("style", "display: none");
    form.removeAttribute("style");
    getForm();
  };

  const getForm = () => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const formDataObj = Object.fromEntries(formData);
      form.setAttribute("style", "display: none");
      console.log(formDataObj);
      Players.setPlayerNames(
        formDataObj["player-one"],
        formDataObj["player-two"],
      );
      const gameContainer = ScreenController().getGameContainer();
      gameContainer.removeAttribute("style");
    });
  };

  startButton.addEventListener("click", displayForm);
})();
