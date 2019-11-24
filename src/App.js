import React, { Component } from "react";
import "./App.css";

const delay = ms => new Promise(res => setTimeout(res, ms));

class App extends Component {
	constructor(props) {
		super(props);

		const puzzle = [
			[0, 4],
			[0, 5],
			[1, 4],
			[1, 5]
		];

		this.state = {
			board: this.createBoard(),
			puzzle
		};
	}

	componentDidMount = async () => {
		const { puzzle } = this.state;

		this.addEventListeners();

		// paint puzzle on board
		const b = this.paintPuzzleOnBoard(puzzle);
		this.setState({ board: b });

		// time interval or while loop?
		// setInterval(() => {
		while (true) {
			const { puzzle } = this.state;

			if (this.checkCollision()) {
				break;
			}

			let [isTouched, newPuzzle] = this.checkIfTouched();

			// TODO: change to if collided
			if (!isTouched) {
				this.paintBoard(newPuzzle);
			} else {
				// put puzzle in occupied
				for (let i = 0; i < puzzle.length; i++) {
					const cell = puzzle[i];
					const key = `${cell[0]},${cell[1]}`;
					this.props.occupieds[key] = true;
				}
				// drop a new puzzle
				newPuzzle = [
					[0, 4],
					[0, 5],
					[1, 4],
					[1, 5]
				];
				this.paintBoard(newPuzzle);
			}
			await delay(200);
		}
		// }, 200);

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

	addEventListeners = () => {
		window.addEventListener(
			"keydown",
			function(event) {
				const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
				let isCollided;
				let newPuzzle;
				switch (key) {
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
				key in this.props.occupieds
			) {
				isCollided = true;
				break;
			}
			newPuzzle.push([newI, newJ]);
		}
		return [isCollided, newPuzzle];
	};

	// TODO: rotate

	checkCollision = () => {
		const { puzzle } = this.state;
		let isCollided = false;
		for (let i = 0; i < puzzle.length; i++) {
			const cell = puzzle[i];
			const key = `${cell[0]},${cell[1]}`;
			if (key in this.props.occupieds) {
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
			if (newI === 20 || key in this.props.occupieds) {
				isTouched = true;
				break;
			}
			newPuzzle.push([newI, cell[1]]);
		}
		return [isTouched, newPuzzle];
	};

	paintBoard = puzzle => {
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
		const { occupieds } = this.props;
		for (const key in occupieds) {
			let [x, y] = key.split(",");
			x = parseInt(x);
			y = parseInt(y);
			board[x][y] = 1;
		}
		return board;
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

App.defaultProps = {
	occupieds: {}
};

export default App;
