const GameBoard = (() => {
  let board = [];

  function Cell() {
    let value = 0;

    const addToken = (token) => {
      value = token;
    };

    const getValue = () => value;
    return { addToken, getValue };
  }

  (function initializeBoard() {
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        row.push(Cell());
      }
      board.push(row);
    }
  })();

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
    const rowColumn = column - leftMostColumn;
    const range = Math.min(rowRange, rowColumn);
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

  return { placeMark, printBoard, getBoard };
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

  const switchActivePlayer = () => {
    if (activePlayer == playerDetails[0]) {
      activePlayer = playerDetails[1];
      return;
    }
    activePlayer = playerDetails[0];
  };

  const playRound = (row, column) => {
    const placed = GameBoard.placeMark(row, column, activePlayer.token);
    if (!placed.status) {
      console.log("Position already taken! Try again.");
      printRound();
      return;
    }
    const winExists = checkPotentialWin(placed, activePlayer);
    if (winExists) {
      console.log(`${activePlayer.name} wins!`);
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

  return { playRound };
})();
