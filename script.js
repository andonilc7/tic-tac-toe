const gameBoard = (function () {
  let board = document.querySelector('.gameboard');


  let spots = document.querySelectorAll('.spot');
 
  const gameboard = ['-','-','-','-','-','-', '-','-','-'];

  const getGameboard = () => {
    return gameboard;
  }
  let turnIndex = 0;

  const check = (arr) => {
    if (arr[0] == arr[1] && arr[1] == arr[2]) {
      alert
    }
  }

  const handleClick = (e) => {
    let spotIndex = e.target.getAttribute('data-index');
    console.log(e.target)
    if (e.target.textContent == '-') {
     if(turnIndex%2 == 0) {
       gameboard[spotIndex] = "X";
       e.target.textContent = "X";
       turnIndex++;
      
     } else {
       gameboard[spotIndex] = "O";
       e.target.textContent = "O";
       turnIndex++;
     }
    }
    
   };
  const render = () => {
    console.log(spots)
    gameboard.forEach((e, index) => {
      document.querySelector('[data-index=' + CSS.escape(index) + ']').textContent = e;
      
    })
    spots.forEach((spot) => {
      spot.addEventListener('click', handleClick)
      
    })
  };

    

  return {
    getGameboard;
  }
})();




const player = function(name, mark) {
  // do some function here that holds the spot and index where chose for the player maybe, then return?

  return { 
    name, mark
  };
}

const gameController = (function() {
  const _playerOne = player('John', "X");
  const _playerTwo = player('Patrick', 'O');
  
  
})();

gameBoard.render();

