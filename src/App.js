import React, { Component } from "react";
import "./App.css";
import { getRandomPuzzle } from "./PuzzleFactory";

const delay = ms => new Promise(res => setTimeout(res, ms));

let puzzleInstance;
let occupieds = {};
class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			board: this.createBoard(),
			puzzle: undefined
		};
	}

	componentDidMount = async () => {
		this.addGameEventListeners();

		// paint puzzle on board
		puzzleInstance = getRandomPuzzle();
		this.paintBoard(puzzleInstance.coordinates);
		await delay(500);

		// time interval or while loop?
		while (true) {
			const { puzzle } = this.state;

			if (this.checkCollision(puzzle)) {
				break;
			}

			let [isTouched, newPuzzle] = this.checkIfTouched();

			if (!isTouched) {
				this.paintBoard(newPuzzle);
			} else {
				// put puzzle in the hashtable
				for (let i = 0; i < puzzle.length; i++) {
					const cell = puzzle[i];
					const key = `${cell[0]},${cell[1]}`;
					occupieds[key] = true;
				}
				// clear if necessary
				const fullRows = this.findFullRows();
				if (fullRows.length > 0) {
					await delay(100);
				}
				this.clearFullRows(fullRows);
				// drop a new puzzle
				puzzleInstance = getRandomPuzzle();
				this.paintBoard(puzzleInstance.coordinates);
			}
			await delay(500);
		}

		const c = window.confirm("❌❌❌ GAME OVER ❌❌❌");
		if (c) {
			window.location.reload();
		}
	};

	createBoard = () => {
		const board = [];
		for (let i = 0; i < 20; i++) {
			const temp = [];
			for (let j = 0; j < 10; j++) {
				temp.push(0);
			}
			board.push(temp);
		}
		return board;
	};

	addGameEventListeners = () => {
		window.addEventListener(
			"keydown",
			function(event) {
				const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
				let isCollided;
				let newPuzzle;
				switch (key) {
					case "ArrowUp":
						const res = puzzleInstance.rotate();
						const shapeIdx = res[0];
						newPuzzle = res[1];
						if (!this.checkCollision(newPuzzle)) {
							puzzleInstance.setShapeIdxAndCoordinates(
								shapeIdx,
								newPuzzle
							);
							this.paintBoard(newPuzzle);
						}
						break;
					case "ArrowRight":
						[isCollided, newPuzzle] = this.movePuzzle(0, 1);
						if (!isCollided) {
							this.paintBoard(newPuzzle);
						}
						break;
					case "ArrowDown":
						[isCollided, newPuzzle] = this.movePuzzle(1, 0);
						if (!isCollided) {
							this.paintBoard(newPuzzle);
						}
						break;
					case "ArrowLeft":
						[isCollided, newPuzzle] = this.movePuzzle(0, -1);
						if (!isCollided) {
							this.paintBoard(newPuzzle);
						}
						break;
					default:
						break;
				}
			}.bind(this)
		);
	};

	movePuzzle = (di, dj) => {
		const { puzzle } = this.state;
		let isCollided = false;
		let newPuzzle = [];
		for (let i = 0; i < puzzle.length; i++) {
			const cell = puzzle[i];
			const newI = cell[0] + di;
			const newJ = cell[1] + dj;
			const key = `${newI},${newJ}`;
			if (
				newI < 0 ||
				newI === 20 ||
				newJ < 0 ||
				newJ === 10 ||
				key in occupieds
			) {
				isCollided = true;
				break;
			}
			newPuzzle.push([newI, newJ]);
		}
		return [isCollided, newPuzzle];
	};

	checkCollision = puzzle => {
		let isCollided = false;
		for (let i = 0; i < puzzle.length; i++) {
			const cell = puzzle[i];
			const newI = cell[0];
			const newJ = cell[1];
			const key = `${newI},${newJ}`;
			if (
				newI < 0 ||
				newI === 20 ||
				newJ < 0 ||
				newJ === 10 ||
				key in occupieds
			) {
				isCollided = true;
				break;
			}
		}
		return isCollided;
	};

	checkIfTouched = () => {
		const { puzzle } = this.state;
		let isTouched = false;
		let newPuzzle = [];
		for (let i = 0; i < puzzle.length; i++) {
			const cell = puzzle[i];
			const newI = cell[0] + 1;
			const key = `${newI},${cell[1]}`;
			if (newI === 20 || key in occupieds) {
				isTouched = true;
				break;
			}
			newPuzzle.push([newI, cell[1]]);
		}
		return [isTouched, newPuzzle];
	};

	paintBoard = puzzle => {
		puzzleInstance.setCoordinates(puzzle);
		let b = this.paintPuzzleOnBoard(puzzle);
		b = this.paintOccupiesdOnBoard(b);
		this.setState({
			board: b,
			puzzle
		});
	};

	paintPuzzleOnBoard = puzzle => {
		const board = this.createBoard();
		for (let i = 0; i < puzzle.length; i++) {
			const cell = puzzle[i];
			const x = cell[0];
			const y = cell[1];
			board[x][y] = 1;
		}
		return board;
	};

	paintOccupiesdOnBoard = board => {
		for (const key in occupieds) {
			let [x, y] = key.split(",");
			x = parseInt(x);
			y = parseInt(y);
			board[x][y] = 1;
		}
		return board;
	};

	findFullRows = () => {
		const { board } = this.state;
		const fullRows = [];
		for (let i = 0; i < board.length; i++) {
			let isFull = true;
			for (let j = 0; j < board[i].length; j++) {
				if (board[i][j] === 0) {
					isFull = false;
					break;
				}
			}
			if (isFull) {
				fullRows.push(i);
			}
		}
		return fullRows;
	};

	clearFullRows = fullRows => {
		const newOccupied = {};
		const keys = Object.keys(occupieds);
		for (let idx = 0; idx < keys.length; idx++) {
			const key = keys[idx];
			let [i, j] = key.split(",");
			i = parseInt(i);
			j = parseInt(j);
			if (fullRows.indexOf(i) > -1) {
				continue;
			} else {
				let n = 0;
				fullRows.forEach(row => {
					if (row > i) {
						n += 1;
					}
				});
				if (n > 0) {
					const newKey = `${i + n},${j}`;
					newOccupied[newKey] = true;
				} else {
					newOccupied[key] = true;
				}
			}
		}
		occupieds = newOccupied;
	};

	render = () => {
		const { board } = this.state;

		const rowDivs = board.map((row, i) => {
			return (
				<div key={i} className="row">
					{row.map((cell, j) => {
						let name = "cell";
						if (j === 9) {
							name += " last-col";
						}
						if (i === 19) {
							name += " last-row";
						}
						if (cell === 1) {
							name += " colored";
						}
						return <div key={j} className={name} />;
					})}
				</div>
			);
		});

		const boardDiv = <div className="board">{rowDivs}</div>;

		return <div>{boardDiv}</div>;
	};
}

export default App;
