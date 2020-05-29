document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid');
	let squares = Array.from(document.querySelectorAll('.grid div'));
	const scoreDisplay = document.querySelector('#score');
	const startBtn = document.querySelector('#start-button');
	const width = 10;
	
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

	timerId = setInterval(moveDown, 500) //1000 (ms) = 1 second
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
			random = Math.floor(Math.random()* theTetriminos.length);
			current = theTetriminos[random][currentRotation];
			currentPosition = 4;
			draw();
		}
	}
});
	