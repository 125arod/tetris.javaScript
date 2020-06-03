/*Bugs and improvements

-space to instantly drop the tetrimino
-(Bug):When the shape is on an edge, rotating will have it wrap. 
-(Bug):Next shape doesn't show until first piece drops.
-CSS improvements
--Different shapes are different colors
--
- Add 5th shapes z reverse
-Better messaging for paused / started game


*/


document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid');
	let squares = Array.from(document.querySelectorAll('.grid div'));
	const scoreDisplay = document.querySelector('#score');
	const startBtn = document.querySelector('#start-button');
	const width = 10;
	let nextRandom = 0;
	let timerId;
	let score = 0 
	const colors = [
	'orange',
	'red',
	'purple',
	'green'
	]
	
	//Tetriminos arrays
	const lTetrimino = [
		[1, width+1, width*2+1, 2],
		[width,width+1,width+2,width*2+2],
		[1, width+1, width*2+1, width*2],
		[width,width*2,width*2+1,width*2+2]
	];
	const tTetrimino = [
		[1, width, width+1, width+2],
		[0, width, width+1, width*2],
		[0, 1, 2, width+1],
		[1,width,width+1,width*2+1]
	];
	const oTetrimino = [
		[0, 1, width, width+1],
		[0, 1, width, width+1],
		[0, 1, width, width+1],
		[0, 1, width, width+1],
	];
	const iTetrimino = [
		[1,width+1,width*2+1,width*3+1],
		[width,width+1,width+2,width+3],
		[1,width+1,width*2+1,width*3+1],
		[width,width+1,width+2,width+3]
	];


	const theTetriminos = [lTetrimino,tTetrimino,oTetrimino,iTetrimino]

	let currentPosition = 4;
	let currentRotation = 0;
	// Randomly select a tetrimino
	let random = Math.floor(Math.random()*theTetriminos.length);
	let current = theTetriminos[random][currentRotation];


//Keycodes and its movements. 
	function control (e){
		if(e.keyCode === 37){
			moveLeft();
		} else if(e.keyCode === 38){
			rotate();
		} else if(e.keyCode === 39){
			moveRight();
		} else if(e.keyCode === 40){
			moveDown();
		} else if(e.keycode === 32){
			//straightDown();
		}
	}
	document.addEventListener('keyup', control)
//Function: Draw will be used to randomly select a tetrimino shape
	function draw() {
		current.forEach( index =>{
			squares[currentPosition + index].classList.add('tetrimino');
			squares[currentPosition + index].style.backgroundColor = colors[random];
		});
	}

	function undraw() {
		current.forEach(index =>{
			squares[currentPosition + index].classList.remove('tetrimino');
			squares[currentPosition + index].style.backgroundColor = '';
		});
	}

	function moveDown(){
		undraw();
		currentPosition += width;
		draw();
		freeze(); 
	}
	//freeze function to stop shape from falling
	function freeze() {
		if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
			current.forEach(index => squares[currentPosition + index].classList.add('taken'));
			//start a new tetrimino to fall after stopping the next
			random = nextRandom
			nextRandom = Math.floor(Math.random()* theTetriminos.length);
			current = theTetriminos[random][currentRotation];
			currentPosition = 4;
			draw();
			displayShape();
			addScore();
			gameOver();
		}
	}

	//Move left, unless the edge has been met
	function moveLeft() {
		undraw();
		const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0 );
		if( !isAtLeftEdge) currentPosition -=1
		
		if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
			currentPosition += 1;
		}
		draw();
	}
	// Move right, unless the edge has been met
	function moveRight() {
		undraw();
		const isAtRightEdge = current.some(index => (currentPosition +index) % width === width -1);
		if(!isAtRightEdge) currentPosition +=1

		if(current.some(index=> squares[currentPosition + index].classList.contains('taken'))){
			currentPosition -=1;
		}
		draw();
	}
	// Rotate the tetrimino shape
	function rotate() {
		undraw();
		currentRotation++
		// When the last shape is seen, go back to the first one
		if(currentRotation === current.length){
			currentRotation = 0;
		}
		current = theTetriminos[random][currentRotation];
		draw();
	}

	// mini grid work for Up-next 

	const displaySquares = document.querySelectorAll('.mini-grid div');
	const displayWidth = 4;
	let displayIndex = 0;

	//the tetriminos for the mini-grid
	const upNextTetrimino = [
		[1, displayWidth+1, displayWidth*2+1, 2],
		[1, displayWidth, displayWidth+1, displayWidth+2],
		[0, 1, displayWidth, displayWidth+1],
		[1, displayWidth+1, displayWidth*2+1, displayWidth*3+1],
	]

	function displayShape() {
		//remove any trace of a tetrimino from the entire grid
		displaySquares.forEach(square => {
			square.classList.remove('tetrimino');
			square.style.backgroundColor = ''
		})
		upNextTetrimino[nextRandom].forEach( index => {
			displaySquares[displayIndex + index].classList.add('tetrimino');
			displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
		})
	}

	//Add start/pause functionality
	startBtn.addEventListener('click', () =>{
		if(timerId){
			clearInterval(timerId);
			timerId = null;
			alert('Game is Paused');
		} else {
			draw()
			timerId = setInterval(moveDown, 1000);
			nextRandom = Math.floor(Math.random() * theTetriminos.length);
			displayShape();
			
		}
	})

	//Add score and remove the row when you hit it
	function  addScore() {
		for ( let i=0; i<199; i+=width){
			const row = [i, i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];
			if(row.every(index => squares[index].classList.contains('taken'))){
				score+=10
				scoreDisplay.innerHTML =score;
				row.forEach(index=>{
					squares[index].classList.remove('taken');
					squares[index].classList.remove('tetrimino');
					squares[index].style.backgroundColor = '';
				})
				const squaresRemoved = squares.splice(i,width);
				squares = squaresRemoved.concat(squares);
				squares.forEach(cell => grid.appendChild(cell));
			}
		}
	}	

	function gameOver() {
		if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
			scoreDisplay.innerHTML = 'Game Over';
			clearInterval(timerId);
		}
	}

});
	