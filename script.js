// Single instances: GameBoard, GameController, Player
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
    board[row][column] = playerToken;
    printBoard();
  };

  const printBoard = () => {
    console.log(board);
  };

  const getBoard = () => board;

  return { placeMark, getBoard };
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
