const gameBoard = (function () {
  let board = document.querySelector('.gameboard');


  let spots = document.querySelectorAll('.spot');
 
  const getSpots = () => {
    return spots;
  }
  const gameboard = [
    {e: '', i:0},
    {e: '', i:1},
    {e: '', i:2},
    {e: '', i:3},
    {e: '', i:4},
    {e: '', i:5},
    {e: '', i:6},
    {e: '', i:7},
    {e: '', i:8},

  ];

  const getBoard = () => {
    return gameboard;
  }
  
  const setBoard = (i, val) => {
    gameboard[i]["e"] = val;
  }

  const render = () => {
    gameboard.forEach((e, index) => {
      document.querySelector('[data-index=' + CSS.escape(index) + ']').textContent = e["e"];
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
  const selector = document.querySelector('.selector');
  const gameModeButtons = [humanButton, aiButton];
  const difficulties = document.querySelectorAll('.difficulty');
  console.log(difficulties)
  //toggle game mode
  humanButton.addEventListener('click', (e) => {
    humanButton.classList.add('selected');
    aiButton.classList.remove('selected');
    playerTwoContainer.style.visibility = "visible";
    playerTwoInput.style.visibility = "visible"
    selector.style.visibility = "hidden"
    restart();
  })

  aiButton.addEventListener('click', (e) => {
    aiButton.classList.add('selected');
    humanButton.classList.remove('selected');
    playerTwoContainer.style.visibility = "hidden";
    playerTwoInput.style.visibility = "hidden";
    selector.style.visibility = "visible"
    // input still shows even when do visibility hidden on safari.... (display:none, .remove() similar story)
    restart();
  })

  selector.addEventListener('change', () => {
    restart();
  })




  const createPlayers = () => {
    _playerOne.name = playerOneInput.value;
    if(_playerOne.name == "") {
      _playerOne.name = "Player One (X)"
    }
    if(humanButton.classList.contains('selected')) {
      
    _playerTwo.name = playerTwoInput.value;
    
    playerArray = [_playerOne, _playerTwo];
  
    if(_playerTwo.name == "") {
      _playerTwo.name = "Player Two (O)"
    }
    console.log(_playerOne)
    } else if (aiButton.classList.contains('selected')) {
      _playerTwo.name = "AI";
      playerArray = [_playerOne, _playerTwo];
    }
    
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
      if (humanButton.classList.contains('selected')) {
        handleClick();
      }

      else if (aiButton.classList.contains('selected')) {
        if (selector.value=="easy"){
          handleClickAiRandMode();
        } else if (selector.value == "unbeatable") {
          handleClickAiMinimax();
        }
        
      }
    })
  }

  const restart = () => {
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
      spot.removeEventListener('click', updateAiRandMode);
      spot.removeEventListener('click', updateAiMinimax);
    })
  }

  const restartListen = () => {
    restartBtn.addEventListener('click', restart)
  }

  const update = (e) => {
    let spotIndex = e.target.getAttribute('data-index');
    if (e.target.textContent != 'X' && e.target.textContent != 'O' && winnerMessage.textContent == "") {
      if (turn == 0) {
        gameBoard.setBoard(spotIndex, playerArray[0].mark);
        gameBoard.render();
        turn = 1;
        numOfTurns++;
        displayWinner();
      } else {
        gameBoard.setBoard(spotIndex, playerArray[1].mark);
        gameBoard.render();
        turn = 0;
        numOfTurns++;
        displayWinner();
      }
    }
  }

  const emptySpots = (board) => {
    return Array.from(board).filter((spot) => spot.innerText == "-")
  }

  const emptyElements = (board) => {
    return board.filter((e) => ((e["e"] != "X") && (e["e"]!="O") && (e["e"]!="")));
  }


  const aiRand = () => {
    return emptySpots(gameBoard.getSpots())[Math.floor(Math.random() * emptySpots(gameBoard.getSpots()).length)].getAttribute("data-index");
  }

  const minimax = (currBoard, player) => {
    let availCells = [];

    //collect array of the available cells
    emptyElements(currBoard).forEach((spot) => {
      availCells.push(spot);
    })

    //this is the terminal checker, i.e. returning a score based on who wins
    if (check(currBoard, _playerOne)) {
      return {score:-1};
    } else if (check(currBoard, _playerTwo)) {
      return {score: 1};
    } else if (availCells.length === 0) {
      return {score: 0};
    }

    let moves = [];

    // goes through available cells. for each one, makes a move object.
    for (let i=0; i<availCells.length; i++) {
      let move = {};
      move.index = availCells[i]["i"];

      //fills gameboard with the player marking that cell
      currBoard[availCells[i]["i"]]["e"] = player.mark;
      
      //if that player is AI, then it recursively calls minimax with Human player.
      // this means that the turn switches to the human and it tries to optimize
      if (player == _playerTwo) {
        let result = minimax(currBoard, _playerOne);
        move.score = result.score;
      } else if (player == _playerOne) {
        let result = minimax(currBoard, _playerTwo)
        move.score = result.score;
      }

      currBoard[availCells[i]["i"]]["e"] = "-";
      
      moves.push(move);
    }

    let bestMoveIndex;

//depending on which player's turn it is, the best move will be the smallest value (if analyzing human), or the largest value (if analyzing AI)
    if (player == _playerTwo) {
      bestScore = -10000;
      for (let i=0; i<moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestMoveIndex = i;
          bestScore = moves[i].score;
        }
      }
    } else if (player == _playerOne) {
      bestScore = 10000;
      for (let i=0; i<moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestMoveIndex = i;
          bestScore = moves[i].score;
        }
      }
    }

    //returns the best-move object
    return moves[bestMoveIndex];
  }




  const updateAiRandMode = (e) => {
    let spotIndex = e.target.getAttribute('data-index');
    if (e.target.textContent != 'X' && e.target.textContent != 'O' && winnerMessage.textContent == "") {
      if (turn == 0) {
        gameBoard.setBoard(spotIndex, playerArray[0].mark);
        gameBoard.render();
        displayWinner();
        numOfTurns++;
        console.log(emptySpots(gameBoard.getSpots()))
        gameBoard.setBoard(aiRand(), "O");
        numOfTurns++;
        gameBoard.render();
        displayWinner();
      } 
    }
  }



  const updateAiMinimax = (e) => {
    let spotIndex = e.target.getAttribute('data-index');
    if (e.target.textContent != 'X' && e.target.textContent != 'O' && winnerMessage.textContent == "") {
      if (turn == 0) {
        gameBoard.setBoard(spotIndex, playerArray[0].mark);
        gameBoard.render();
        displayWinner();
        numOfTurns++;
        console.log(minimax(gameBoard.getBoard(), _playerTwo))
        gameBoard.setBoard(minimax(gameBoard.getBoard(), _playerTwo).index, "O");
        gameBoard.render();
        displayWinner();
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

  const check = (board, player) => {
    let winnerFound = false;
    winningCombinations.forEach(e => {
      const [a,b,c] = e;
      if (board[a]["e"]==player.mark && board[a]["e"] == board[b]["e"] && board[b]["e"] == board[c]["e"]) {
        winnerFound = true;
        return winnerFound;
        
      } 
      
    })
    return winnerFound;
  }

  

  const displayWinner = () => {
    if (check(gameBoard.getBoard(), _playerOne)) {
      winnerMessage.textContent = "Winner is " + _playerOne.name + "!";
    } else if (check(gameBoard.getBoard(), _playerTwo)) {
      winnerMessage.textContent = "Winner is " + _playerTwo.name + "!";
    } else if (numOfTurns == 9) {
      winnerMessage.textContent = "Tie"
    }
  }

  const handleClick = () => {
    gameBoard.getSpots().forEach((spot, index) => {
      spot.addEventListener('click', update);
      
    })
    
  }

  const handleClickAiRandMode = () => {
    gameBoard.getSpots().forEach((spot, index) => {
      spot.addEventListener('click', updateAiRandMode);
      spot.addEventListener('click', displayWinner)
    })
  }

  const handleClickAiMinimax = () => {
    gameBoard.getSpots().forEach((spot, index) => {
      spot.addEventListener('click', updateAiMinimax);
      spot.addEventListener('click', displayWinner);
    })
  }

  return {
    start, restartListen, check, emptySpots
  }
})();

game.start();
game.restartListen();
