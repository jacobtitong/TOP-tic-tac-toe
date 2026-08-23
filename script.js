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
    return { status: true, getRowArray };
  };

  const setRowArray = (row) => {
    let rowArray = board[row];
    return rowArray;
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
        console.log(consecutiveTokens);
        return getWin(consecutiveTokens);
      };
      const getWin = (consecutiveTokens) => {
        let win = false;
        consecutiveTokens.forEach((consecutiveItems) => {
          console.log(consecutiveItems.length);
          if (consecutiveItems.length == 3) {
            win = true;
          }
        });
        return win;
      };
      return { checkConsecutive };
    })();
    winExists = findConsecutiveTokens.checkConsecutive(arr.getRowArray);
    return winExists;
  };

  return { playRound };
})();
