const gameBoard = (function () {
  let board = document.querySelector('.gameboard');


  let spots = document.querySelectorAll('.spot');
 
  const getSpots = () => {
    return spots;
  }
  const gameboard = ['','','','','','', '','',''];

  const getBoard = () => {
    return gameboard;
  }
  
  const setBoard = (i, val) => {
    gameboard[i] = val;
  }

  const render = () => {
    gameboard.forEach((e, index) => {
      document.querySelector('[data-index=' + CSS.escape(index) + ']').textContent = e;
    })
  }

  return {
    getBoard, setBoard, render, getSpots
  }
})();




const player = function(name, mark) {
  // do some function here that holds the spot and index where chose for the player maybe, then return?

  return { 
    name, mark
  };
}

const game = (function() {
  let playerArray = [];
  const playerOneInput = document.querySelector('#player-one-input');
  const playerTwoInput = document.querySelector('#player-two-input');
  const playerInputArray = [playerOneInput, playerTwoInput];
  const playerTwoContainer = document.querySelector('.player-two-container')

  const winnerMessage = document.querySelector('.winner-message');
  const gameForm = document.querySelector('.game-form');
  const _playerOne = player("", "X")
  const _playerTwo = player("", "O")


  //game mode buttons
  const humanButton = document.querySelector('.human');
  const aiButton = document.querySelector('.ai');

  const gameModeButtons = [humanButton, aiButton];

  //toggle game mode
  humanButton.addEventListener('click', (e) => {
    humanButton.classList.add('selected');
    aiButton.classList.remove('selected');
    playerTwoContainer.style.visibility = "visible";
  })

  aiButton.addEventListener('click', (e) => {
    aiButton.classList.add('selected');
    humanButton.classList.remove('selected');
    playerTwoContainer.style.visibility = "hidden";
    playerTwoInput.style.visibility = "hidden"
    // input still shows even when do visibility hidden on safari.... (display:none, .remove() similar story)
  })


  const createPlayers = () => {
    _playerOne.name = playerOneInput.value;
    _playerTwo.name = playerTwoInput.value;
    
    playerArray = [_playerOne, _playerTwo];
    if(_playerOne.name == "") {
      _playerOne.name = "Player One (X)"
    }
    if(_playerTwo.name == "") {
      _playerTwo.name = "Player Two (O)"
    }
    console.log(_playerOne)
  }
  

  const startBtn = document.querySelector('.start-btn')
  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Restart"
  restartBtn.classList.add('restart-btn')
  

  let turn = 0;
  let numOfTurns = 0;


  const start = () => {
    startBtn.addEventListener('click', (event) => {
      event.preventDefault();
      for (let i=0; i<gameBoard.getBoard().length; i++) {
        gameBoard.setBoard(i, "-");
      }
    
      gameBoard.render();
      createPlayers();
      playerOneInput.readOnly = true;
      playerTwoInput.readOnly = true;
      startBtn.remove();
      gameForm.append(restartBtn);
      handleClick();
    })
  }

  const restart = () => {
    restartBtn.addEventListener('click', (event) => {
      for (let i=0; i<gameBoard.getBoard().length; i++) {
        gameBoard.setBoard(i, "");
      }
      gameBoard.render();

      winnerMessage.textContent = "";
      gameForm.appendChild(startBtn);
      restartBtn.remove();

      playerArray.forEach(player => {
        player.name = ""
      })

      playerInputArray.forEach(playerInput => {
        playerInput.value = "";
        playerInput.readOnly = false;
      })

      turn = 0;
      numOfTurns = 0;

      gameBoard.getSpots().forEach((spot, index) => {
        spot.removeEventListener('click', update);
        spot.removeEventListener('click', checkAll);
      })
     })
  }

  const update = (e) => {
    let spotIndex = e.target.getAttribute('data-index');
    if (e.target.textContent != 'X' && e.target.textContent != 'O' && winnerMessage.textContent == "") {
      if (turn == 0) {
        gameBoard.setBoard(spotIndex, playerArray[0].mark);
        gameBoard.render();
        turn = 1;
        numOfTurns++;
      } else {
        gameBoard.setBoard(spotIndex, playerArray[1].mark);
        gameBoard.render();
        turn = 0;
        numOfTurns++;
      }
    }
    
  }

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const check = (player) => {
    winningCombinations.forEach(e => {
      const [a,b,c] = e;
      console.log([a,b,c])
      console.log('sdfsd')
      if (gameBoard.getBoard()[a]==player.mark && gameBoard.getBoard()[a] == gameBoard.getBoard()[b] && gameBoard.getBoard()[b] == gameBoard.getBoard()[c]) {
        winnerMessage.textContent = "Winner is " + player.name + "!";
        
      } else if (numOfTurns == 9 && winnerMessage.textContent == "") {
          winnerMessage.textContent = "Tie";
        }
      
    })
  }

  const checkAll = () => {
    playerArray.forEach(check)
  }

  const handleClick = () => {
    gameBoard.getSpots().forEach((spot, index) => {
      spot.addEventListener('click', update);
      spot.addEventListener('click', checkAll)
    })
    
  }

  return {
    start, restart
  }
})();

game.start();
game.restart();
