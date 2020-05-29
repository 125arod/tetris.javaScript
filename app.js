/*Bugs and improvements

-space to instantly drop the tetrimino
-(Bug):When the shape is on an edge, rotating will have it wrap. 
-(Bug):Next shape doesn't show until first piece drops.
-CSS improvements
--Different shapes are different colors
--
- Add 5th shapes z reverse



*/

document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid');
	let squares = Array.from(document.querySelectorAll('.grid div'));
	const scoreDisplay = document.querySelector('#score');
	const startBtn = document.querySelector('#start-button');
	const width = 10;
	let nextRandom = 0;
	let timerId;
	
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
		});
	}

	function undraw() {
		current.forEach(index =>{
			squares[currentPosition + index].classList.remove('tetrimino');
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
		})
		upNextTetrimino[nextRandom].forEach( index => {
			displaySquares[displayIndex + index].classList.add('tetrimino');
		})
	}

	//Add start/pause functionality
	startBtn.addEventListener('click', () =>{
		if(timerId){
			clearInterval(timerId);
			timerId = null;
		} else {
			draw()
			timerId = setInterval(moveDown, 1000);
			nextRandom = Math.floor(Math.random() * theTetriminos.length);
			displayShape();
		}
	})
//Stopped here: 1:17:03
});
	