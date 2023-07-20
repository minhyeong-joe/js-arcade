//****************Customization******************//
let rowSize = 9; // row size
let colSize = 9; // column size
let numMine = 10; // number of mines
//***********************************************//

CELL_SIZE = 16; // each cell's size in pixels
BOARD_PADDING = 16; // padding between board container and game components

let grid = [
	[0, 1, 1, 1, 0, 0, 0, 0, 0],
	[1, 2, "X", 1, 0, 0, 0, 0, 0],
	[2, "X", 2, 1, 0, 1, 1, 1, 0],
	["X", 2, 1, 0, 0, 1, "X", 1, 0],
	[1, 1, 0, 0, 0, 1, 1, 2, 1],
	[0, 1, 1, 1, 1, 1, 2, 2, "X"],
	[1, 2, "X", 2, 2, "X", 2, "X", 2],
	[1, "X", 2, 2, "X", 2, 2, 1, 1],
	[1, 1, 1, 1, 1, 1, 0, 0, 0],
];

// GAME LOGIC VARIABLES
let gameStarted = false;
let interactable = true;
// number of opened cell
let numOpenedCells = 0;
// timer interval
let timerId;
// remaining flags
let numFlag = numMine;
// flag for auto open execution
let autoOpenHandlerExecuted = false;
// keep visited cells for expand zero cells

// back button
const backBtnElem = document.querySelector(".backIcon");
backBtnElem.addEventListener("click", () => {
	window.history.back();
});
// sound button
const soundElem = document.querySelector(".soundIcon");
let soundon = true;
soundElem.addEventListener("click", (e) => {
	if (soundon) {
		e.target.setAttribute("src", "assets/img/soundoff.png");
		soundon = false;
	} else {
		e.target.setAttribute("src", "assets/img/soundon.png");
		soundon = true;
	}
});

// load common DOM elements
const gameboardElement = document.querySelector("#gameboard");
const gameInfoElement = document.querySelector("#game-info");
const gridElement = document.querySelector("#grid");
const smiley = document.querySelector("#smiley-face");
const timerElement = document.querySelector("#timer");
const mineCountElement = document.querySelector("#mine-count");

// ############## GAME SET-UP ###############
const initGame = () => {
	// set game board size and other styles
	setGameboard();
	// create cells
	setGrid();
};

const setGameboard = () => {
	// set gameboard size
	let width = colSize * CELL_SIZE;
	let height = rowSize * CELL_SIZE;
	gameInfoElement.style.width = width + "px";
	gridElement.style.width = width + "px";
	gridElement.style.height = height + "px";
	totalHeight =
		gameInfoElement.offsetHeight +
		parseInt(getComputedStyle(gameInfoElement).marginTop) +
		parseInt(getComputedStyle(gameInfoElement).marginBottom) +
		height;
	gameboardElement.style.width = width + BOARD_PADDING + "px";
	gameboardElement.style.height = parseInt(totalHeight) + BOARD_PADDING + "px";
	// set mine count and timer
	setTimer(0);
	setMineCount(numMine);
	// prevent default behavior of right click on entire board
	gameboardElement.addEventListener("contextmenu", (e) => {
		e.preventDefault();
	});
	// attach reset game event handler to smiley face
	smiley.addEventListener("click", () => {
		resetGame();
	});
};

const setGrid = () => {
	gridElement.classList.add("interactable");
	for (let i = 0; i < rowSize * colSize; i++) {
		row = Math.floor(i / colSize);
		col = i % colSize;
		cellElement = document.createElement("div");
		cellElement.classList.add("cell", "unopened");
		// add event handler for opening the cell
		cellElement.addEventListener("click", (e) => openCell(e.target));
		// add event handler for flagging
		cellElement.addEventListener("contextmenu", toggleFlag);
		// add event handlers for left+right click
		cellElement.addEventListener("mousedown", onLeftRightDown);
		cellElement.addEventListener("mouseleave", onMouseLeave);
		cellElement.addEventListener("mouseup", onLeftRightUp);
		gridElement.appendChild(cellElement);
	}
};

const setTimer = (time) => {
	let displayTime = time.toString().padStart(3, "0");
	timerElement.textContent = displayTime;
};

const setMineCount = (count) => {
	let displayCount = count.toString().padStart(3, "0");
	mineCountElement.textContent = displayCount;
};

// #################### GAME STATUS ###########################
const startGame = () => {
	gameStarted = true;
	// start timer
	let time = 1;
	setTimer(time);
	timerId = setInterval(() => {
		time++;
		setTimer(time); // Display the updated timer value
	}, 1000);
};

const resetGame = () => {
	gameStarted = false;
	// set face back to original
	smiley.classList = [];
	// reset mine count and timer
	numFlag = numMine;
	setMineCount(numMine);
	setTimer(0);
	// stop timer
	clearInterval(timerId);
	// clear grid
	setCellsInteractable(true);
	resetCells();
};

const resetCells = () => {
	numOpenedCells = 0;
	const cellElements = document.querySelectorAll(".cell");
	for (let cell of cellElements) {
		cell.className = "cell unopened";
	}
};

const gameClear = () => {
	// sunglasses
	smiley.classList.add("sunglasses");
	// stop timer
	clearInterval(timerId);
	// play success sound
	playClearSound();
	// flag all mines automatically
	for (let i = 0; i < rowSize * colSize; i++) {
		let [row, col] = getRowCol(i);
		const cellElem = gridElement.children[i];
		if (
			grid[row][col] == "X" &&
			cellElem.classList.contains("unopened") &&
			!cellElem.classList.contains("flagged")
		) {
			cellElem.classList.add("flagged");
		}
	}
	// disable grid interaction
	setCellsInteractable(false);
};

const gameOver = () => {
	// play explosition sound
	playExplosionSound();
	// end game timer
	clearInterval(timerId);
	// dead smiley face
	smiley.classList.add("dead");
	// show all mines - case if marked incorrectly
	showMines();
	// disable grid interactions
	setCellsInteractable(false);
};

const isGameCleared = () => {
	return numOpenedCells == rowSize * colSize - numMine;
};

const setCellsInteractable = (isInteractable) => {
	interactable = isInteractable;
	if (isInteractable) {
		gridElement.classList.add("interactable");
	} else {
		gridElement.classList.remove("interactable");
	}
};

// show all mines & incorrect marking at the end of game
const showMines = () => {
	for (let i = 0; i < rowSize * colSize; i++) {
		let [row, col] = getRowCol(i);
		const cellElem = gridElement.children[i];
		if (
			grid[row][col] == "X" &&
			cellElem.classList.contains("unopened") &&
			!cellElem.classList.contains("flagged")
		) {
			cellElem.classList.add("mine");
		} else if (
			grid[row][col] != "X" &&
			cellElem.classList.contains("flagged")
		) {
			cellElem.classList.add("incorrect-mark");
		}
	}
};

// #################### EVENT HANDLERS ##########################
// LEFT CLICK
const openCell = (elem) => {
	if (!gameStarted) {
		startGame();
	}
	if (
		elem.classList.contains("unopened") &&
		!elem.classList.contains("flagged") &&
		interactable
	) {
		const index = getTargetIndex(elem);
		const [row, col] = getRowCol(index);
		elem.classList.remove("unopened", "interactable");
		if (grid[row][col] == "X") {
			elem.classList.add("cell", "explosion");
			gameOver();
			return;
		} else if (typeof grid[row][col] === "number") {
			className = "number-" + grid[row][col];
			elem.classList.add("cell", className);
			if (grid[row][col] == 0) {
				openNeighboringCells(row, col);
			}
		}
		numOpenedCells++;
		if (isGameCleared()) {
			gameClear();
		}
	}
};

// RIGHT CLICK
const toggleFlag = (e) => {
	const elem = e.target;
	if (elem.classList.contains("unopened") && interactable) {
		if (!gameStarted) {
			startGame();
		}
		if (elem.classList.contains("flagged")) {
			elem.classList.remove("flagged");
			numFlag++;
		} else {
			if (numFlag > 0) {
				elem.classList.add("flagged");
				numFlag--;
			}
		}
		// update flag/mine count
		setMineCount(numFlag);
	}
};

// LEFT + RIGHT CLICK
const onLeftRightDown = (e) => {
	if (e.buttons === 3 && interactable && getNumberCellValue(e.target)) {
		highlightNeighbors(e, true);
		autoOpenHandlerExecuted = false;
	}
};

const onMouseLeave = (e) => {
	highlightNeighbors(e, false);
};

const onLeftRightUp = (e) => {
	if (!autoOpenHandlerExecuted) {
		autoOpenNeighbors(e);
		autoOpenHandlerExecuted = true;
	}
};

// ###################### GAME PLAY LOGICS ##############################
// highlight/un-highlight neighboring cells on left+right click
// isHighlighted: true - highlight; false - un-highlight
const highlightNeighbors = (e, isHighlighted) => {
	// find neighbors
	const index = getTargetIndex(e.target);
	const [row, col] = getRowCol(index);
	const neighborCells = getNeighboringCells(row, col);
	// highlight neighbors
	neighborCells.forEach((cell) => {
		if (!cell.classList.contains("flagged")) {
			if (isHighlighted) {
				cell.classList.add("highlight");
			} else {
				cell.classList.remove("highlight");
			}
		}
	});
};

// expand & open neighbor cells if number-0 cell is opened
const openNeighboringCells = (row, col) => {
	const neighborCells = getNeighboringCells(row, col);
	neighborCells.forEach((cell) => {
		openCell(cell);
	});
};

// helper feature that allows user to open all neighbor cells if neighboring cells have been
// all marked with flags equal to the number indicated by the selected cell
// Handler for releasing left+right mouse clicks
const autoOpenNeighbors = (e) => {
	highlightNeighbors(e, false);
	// if number of flags in neighboring cells == value of this cell, then open all neighboring cells
	let cellValue = getNumberCellValue(e.target);
	const index = getTargetIndex(e.target);
	const [row, col] = getRowCol(index);
	let neighborCells = getNeighboringCells(row, col);
	let countFlag = 0; // number of surrounding flags used
	neighborCells.forEach((cell) => {
		if (cell.classList.contains("flagged")) {
			countFlag++;
		}
	});
	if (cellValue === countFlag) {
		neighborCells.forEach((cell) => {
			openCell(cell);
		});
	}
};

// helper function to get neighbor cells
// row:int - row number of cell within the grid
// col:int - col number of cell within the grid
// returns
// neighbors:[DOM Element] - list of neighbor cell DOM elements
const getNeighboringCells = (row, col) => {
	let neighbors = [];
	// Define the offsets for neighboring cells
	const offsets = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1],
	];
	// Iterate through each offset and add valid neighbors to the result
	for (const [offsetRow, offsetCol] of offsets) {
		const neighborRow = row + offsetRow;
		const neighborCol = col + offsetCol;

		// Check if the neighbor is within the bounds of the grid
		if (
			neighborRow >= 0 &&
			neighborRow < rowSize &&
			neighborCol >= 0 &&
			neighborCol < colSize
		) {
			const index = getIndex(neighborRow, neighborCol);
			neighbors.push(gridElement.children[index]);
			// neighbors.push(getIndex(neighborRow, neighborCol));
		}
	}

	return neighbors;
};

// helper function to get index of selected cell element
// elem:DOM Element - target cell element
// returns
// index:int - index under parentNode (#grid)
const getTargetIndex = (elem) => {
	const children = Array.from(gridElement.children);
	const index = children.indexOf(elem);
	return index;
};

// helper function to get index from row and col
// row:int - row number of cell within the grid
// col:int - col number of cell within the grid
// returns
// index:int - index under parentNode (#grid)
const getIndex = (row, col) => {
	return row * colSize + col;
};

// helper function to get row and col from index
// index:int - index under parentNode (#grid)
// returns
// [row, col]:List[row,col]
// row:int - row number of cell within the grid
// col:int - col number of cell within the grid
const getRowCol = (index) => {
	row = Math.floor(index / colSize);
	col = index % colSize;
	return [row, col];
};

// helper function to extract indicated number from a number cell element
// cellElem:DOM Element - cell element
// returns
// int - number indicated by the cell (0~8)
// undefined if cell is non-number cell (ie. mine, flagged, etc)
const getNumberCellValue = (cellElem) => {
	for (const className of cellElem.classList) {
		// if numerical, then return value
		if (className.startsWith("number-")) {
			return parseInt(className.substring(7));
		}
	}
};

const playExplosionSound = () => {
	const audioElem = document.querySelector("#explosion-sound");
	playSound(audioElem, 0.2, 2);
};

const playClearSound = () => {
	const audioElem = document.querySelector("#start-sound");
	playSound(audioElem, 0.25);
};

const playSound = (audioElem, volume, speed = 1) => {
	if (soundon) {
		audioElem.currentTime = 0;
		audioElem.volume = volume;
		audioElem.playbackRate = speed;
		audioElem.play();
	}
};

initGame();
