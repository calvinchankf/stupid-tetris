import Puzzle from "./Puzzle";

const W = {
	shapes: [
		[
			[1, 1],
			[1, 1]
		]
	],
	shapeIdx: 0,
	coordinates: [
		[0, 4],
		[0, 5],
		[1, 4],
		[1, 5]
	],
	anchor: [0, 0]
};

const I = {
	shapes: [
		[
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		],
		[
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0]
		]
	],
	shapeIdx: 0,
	coordinates: [
		[0, 5],
		[0, 3],
		[0, 4],
		[0, 6]
	],
	anchor: [0, 2]
};

const T = {
	shapes: [
		[
			[0, 1, 0],
			[1, 1, 1],
			[0, 0, 0]
		],
		[
			[0, 1, 0],
			[0, 1, 1],
			[0, 1, 0]
		],
		[
			[0, 0, 0],
			[1, 1, 1],
			[0, 1, 0]
		],
		[
			[0, 1, 0],
			[1, 1, 0],
			[0, 1, 0]
		]
	],
	shapeIdx: 0,
	coordinates: [
		[1, 5],
		[0, 5],
		[1, 4],
		[1, 6]
	],
	anchor: [1, 1]
};

const Z = {
	shapes: [
		[
			[1, 1, 0],
			[0, 1, 1],
			[0, 0, 0]
		],
		[
			[0, 0, 1],
			[0, 1, 1],
			[0, 1, 0]
		]
	],
	shapeIdx: 0,
	coordinates: [
		[1, 5],
		[0, 5],
		[0, 4],
		[1, 6]
	],
	anchor: [1, 1]
};

const S = {
	shapes: [
		[
			[0, 1, 1],
			[1, 1, 0],
			[0, 0, 0]
		],
		[
			[1, 0, 0],
			[1, 1, 0],
			[0, 1, 0]
		]
	],
	shapeIdx: 0,
	coordinates: [
		[1, 5],
		[0, 5],
		[0, 6],
		[1, 4]
	],
	anchor: [1, 1]
};

const L = {
	shapes: [
		[
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0]
		],
		[
			[0, 1, 1],
			[0, 1, 0],
			[0, 1, 0]
		],
		[
			[0, 0, 0],
			[1, 1, 1],
			[0, 0, 1]
		],
		[
			[0, 1, 0],
			[0, 1, 0],
			[1, 1, 0]
		]
	],
	shapeIdx: 0,
	coordinates: [
		[1, 5],
		[1, 4],
		[1, 6],
		[0, 4]
	],
	anchor: [1, 1]
};

const RL = {
	shapes: [
		[
			[0, 0, 1],
			[1, 1, 1],
			[0, 0, 0]
		],
		[
			[0, 1, 0],
			[0, 1, 0],
			[0, 1, 1]
		],
		[
			[0, 0, 0],
			[1, 1, 1],
			[1, 0, 0]
		],
		[
			[1, 1, 0],
			[0, 1, 0],
			[0, 1, 0]
		]
	],
	shapeIdx: 0,
	coordinates: [
		[1, 5],
		[1, 4],
		[1, 6],
		[0, 6]
	],
	anchor: [1, 1]
};

const shapes = [W, I, T, Z, S, L, RL];

const getRandomPuzzle = () => {
	const r = Math.floor(Math.random() * shapes.length);
	const s = shapes[r];
	return new Puzzle(s.shapes, s.shapeIdx, s.coordinates, s.anchor);
};

export { getRandomPuzzle };
