//****************Customization******************//
let rowSize = 9; // row size
let colSize = 9; // column size
let numMine = 10; // number of mines
//***********************************************//

let soundon = true;
let gameStarted = false;
let interactable = true;
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
soundElem.addEventListener("click", (e) => {
	if (soundon) {
		e.target.setAttribute("src", "assets/img/soundoff.png");
		soundon = false;
	} else {
		e.target.setAttribute("src", "assets/img/soundon.png");
		soundon = true;
	}
});

// ############## GAME SET-UP ###############
const initGame = () => {
	// load common DOM elements
	const gameboardElement = document.querySelector("#gameboard");
	const gameInfoElement = document.querySelector("#game-info");
	const gridElement = document.querySelector("#grid");
	// set game board size and other styles
	setGameboard(gameboardElement, gameInfoElement, gridElement);
	setTimer(0);
	setMineCount(numMine);
	// create cells
	setGrid(gridElement);
};

const setGrid = (gridElement) => {
	for (let i = 0; i < rowSize * colSize; i++) {
		row = Math.floor(i / colSize);
		col = i % colSize;
		cellElement = document.createElement("div");
		cellElement.classList.add("cell", "unopened", "interactable");
		// add event handler for opening the cell
		cellElement.addEventListener("click", onClickHandler);
		cellElement.addEventListener("contextmenu", toggleFlagHandler);
		gridElement.appendChild(cellElement);
	}
};

const setGameboard = (gameboardElement, gameInfoElement, gridElement) => {
	let width = colSize * CELL_SIZE;
	let height = rowSize * CELL_SIZE;
	gameInfoElement.style.width = width + "px";
	gridElement.style.width = width + "px";
	gridElement.style.height = height + "px";
	// set gameboard size
	totalHeight =
		gameInfoElement.offsetHeight +
		parseInt(getComputedStyle(gameInfoElement).marginTop) +
		parseInt(getComputedStyle(gameInfoElement).marginBottom) +
		height;
	gameboardElement.style.width = width + BOARD_PADDING + "px";
	gameboardElement.style.height = parseInt(totalHeight) + BOARD_PADDING + "px";
	gameboardElement.addEventListener("contextmenu", (e) => {
		e.preventDefault();
	});
	// attach start game to smiley face
	const smiley = document.querySelector("#smiley-face");
	smiley.addEventListener("click", () => {
		resetGame();
	});
};

const setTimer = (time) => {
	const timerElement = document.querySelector("#timer");
	let displayTime = time.toString().padStart(3, "0");
	timerElement.textContent = displayTime;
};

const setMineCount = (count) => {
	const mineCountElement = document.querySelector("#mine-count");
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
	// make grid cells interactable
};

const resetGame = () => {
	// set face back to original
	const smiley = document.querySelector("#smiley-face");
	smiley.classList = [];
	numFlag = numMine;
	setMineCount(numMine);
	setTimer(0);
	gameStarted = false;
	// stop timer
	clearInterval(timerId);
	// clear grid
	setCellsInteractable(true);
	numOpenedCells = 0;
	let cellElements = document.querySelectorAll(".cell");
	for (let cellElement of cellElements) {
		cellElement.className = "cell unopened interactable";
		// cellElement.removeEventListener("click", onClickHandler);
		// cellElement.removeEventListener("contextmenu", toggleFlagHandler);
		// cellElement.removeEventListener("mousedown", onLeftRightDown);
		// cellElement.removeEventListener("mouseleave", onMouseLeave);
		// cellElement.removeEventListener("mouseup", onLeftRightUp);
	}
};

const gameClear = () => {
	// TODO
	// sunglasses
	const smiley = document.querySelector("#smiley-face");
	smiley.classList.add("sunglasses");
	// stop timer
	clearInterval(timerId);
	// play success sound
	playClearSound();
	// flag all mines automatically
	const parentElement = document.querySelector("#grid");
	for (let i = 0; i < rowSize * colSize; i++) {
		let [row, col] = getRowCol(i);
		const cellElem = parentElement.children[i];
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
	// TODO
	// play explosition sound
	playExplosionSound();
	// end game timer
	clearInterval(timerId);
	// dead smiley face
	const smiley = document.querySelector("#smiley-face");
	smiley.classList.add("dead");
	// show all mines - case if marked incorrectly
	showMines();
	// disable grid interactions
	setCellsInteractable(false);
};

const isGameCleared = () => {
	console.log(numOpenedCells);
	console.log(rowSize * colSize - numMine);
	return numOpenedCells == rowSize * colSize - numMine;
};

const setCellsInteractable = (isInteractable) => {
	interactable = isInteractable;
	const cellElements = document.querySelectorAll(".cell");
	for (let cellElement of cellElements) {
		if (isInteractable) {
			cellElement.classList.add("interactable");
			// add event handler for opening the cell
			cellElement.addEventListener("click", onClickHandler);
			cellElement.addEventListener("contextmenu", toggleFlagHandler);
		} else {
			cellElement.classList.remove("interactable");
			// add event handler for opening the cell
			cellElement.removeEventListener("click", onClickHandler);
			cellElement.removeEventListener("contextmenu", toggleFlagHandler);
		}
	}
};

// #################### GAMEPLAY LOGICS ##########################
const onClickHandler = (e) => {
	openCell(e.target);
};

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
		console.log(index);
		const [row, col] = getRowCol(index);
		console.log(row, col);
		elem.classList.remove("unopened", "interactable");
		if (grid[row][col] == "X") {
			elem.classList.add("cell", "explosion");
			gameOver();
		} else if (typeof grid[row][col] === "number") {
			className = "number-" + grid[row][col];
			elem.classList.add("cell", className);
			// addLeftRightClickEventListener(e);
			elem.addEventListener("mousedown", onLeftRightDown);
			elem.addEventListener("mouseleave", onMouseLeave);
			elem.addEventListener("mouseup", onLeftRightUp);
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

const toggleFlagHandler = (e) => {
	if (e.target.classList.contains("unopened") && interactable) {
		toggleFlag(e);
	}
};

const toggleFlag = (e) => {
	if (!gameStarted) {
		startGame();
	}
	if (e.target.classList.contains("flagged")) {
		e.target.classList.remove("flagged");
		numFlag++;
	} else {
		if (numFlag > 0) {
			e.target.classList.add("flagged");
			numFlag--;
		}
	}
	// update flag/mine count
	setMineCount(numFlag);
};

const openNeighboringCells = (row, col) => {
	const parentElement = document.querySelector("#grid");
	const neighborIndices = getNeighboringCells(row, col);
	for (let neighborIndex of neighborIndices) {
		const cellElem = parentElement.children[neighborIndex];
		console.log(cellElem);
		openCell(cellElem);
	}
};

const onLeftRightDown = (e) => {
	if (e.buttons === 3 && interactable) {
		highlightNeighbors(e);
		autoOpenHandlerExecuted = false;
	}
};

const onMouseLeave = (e) => {
	unhighlightNeighbors(e);
};

const onLeftRightUp = (e) => {
	if (!autoOpenHandlerExecuted) {
		autoOpenNeighbors(e);
		autoOpenHandlerExecuted = true;
	}
};

const highlightNeighbors = (e) => {
	// find neighbors
	const index = getTargetIndex(e.target);
	const [row, col] = getRowCol(index);
	const neighborsIndices = getNeighboringCells(row, col);
	console.log(neighborsIndices);
	// highlight neighbors
	const parentElement = e.target.parentNode; // Get the parent element
	Array.from(parentElement.children).forEach((child, index) => {
		if (
			neighborsIndices.includes(index) &&
			!child.classList.contains("flagged")
		) {
			child.classList.add("highlight");
		}
	});
};

const unhighlightNeighbors = (e) => {
	// find neighbors
	const index = getTargetIndex(e.target);
	const [row, col] = getRowCol(index);
	const neighborsIndices = getNeighboringCells(row, col);
	// un-highlight neighbors
	const parentElement = e.target.parentNode; // Get the parent element
	Array.from(parentElement.children).forEach((child, index) => {
		if (neighborsIndices.includes(index)) {
			child.classList.remove("highlight");
		}
	});
};

const autoOpenNeighbors = (e) => {
	unhighlightNeighbors(e);
	// if number of flags in neighboring cells == value of this cell, then open all neighboring cells
	let cellValue = getNumberCellValue(e.target.classList);
	console.log(cellValue);
	const index = getTargetIndex(e.target);
	const [row, col] = getRowCol(index);
	let neighborsIndices = getNeighboringCells(row, col);
	let countFlag = 0;
	const parentElement = e.target.parentNode; // Get the parent element
	Array.from(parentElement.children).forEach((child, index) => {
		if (
			neighborsIndices.includes(index) &&
			child.classList.contains("flagged")
		) {
			countFlag++;
		}
	});
	console.log(countFlag);
	if (cellValue === countFlag) {
		Array.from(parentElement.children).forEach((child, index) => {
			if (neighborsIndices.includes(index)) {
				openCell(child);
			}
		});
	}
};

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
			neighbors.push(getIndex(neighborRow, neighborCol));
		}
	}

	return neighbors;
};

const showMines = () => {
	const parentElement = document.querySelector("#grid");
	for (let i = 0; i < rowSize * colSize; i++) {
		let [row, col] = getRowCol(i);
		const cellElem = parentElement.children[i];
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

const getTargetIndex = (elem) => {
	const parentElement = elem.parentNode;
	const children = Array.from(parentElement.children);
	const index = children.indexOf(elem);
	return index;
};

const getIndex = (row, col) => {
	return row * colSize + col;
};

const getRowCol = (index) => {
	row = Math.floor(index / colSize);
	col = index % colSize;
	return [row, col];
};

const getNumberCellValue = (classList) => {
	for (const className of classList) {
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
