// Single instances: GameBoard, GameController, Player

const players = (() => {
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
