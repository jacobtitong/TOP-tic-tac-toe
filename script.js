const GameBoard = (() => {
  let board = [];

  (function initializeBoard() {
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        row.push(0);
      }
      board.push(row);
    }
  })();

  const placeMark = (row, column, playerToken) => {
    if (board[row][column] != 0) return false;
    board[row][column] = playerToken;
    return true;
  };

  const printBoard = () => {
    console.log(board);
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
    if (!placed) {
      console.log("Position already taken! Try again.");
      printRound();
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

  return { playRound };
})();
