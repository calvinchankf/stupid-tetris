class Puzzle {
	constructor(shapes, shapeIdx, coordinates, anchor) {
		this.shapes = shapes;
		this.shapeIdx = shapeIdx;
		this.coordinates = coordinates;
		this.anchor = anchor;
	}
	rotate() {
		// BFS + hashtable
		const newShapeIdx = (this.shapeIdx + 1) % this.shapes.length;
		const newShape = this.shapes[newShapeIdx];
		const q = [[...this.anchor, ...this.coordinates[0]]];
		// let i, j, x, y
		const newCoordinates = [];
		const seen = {};
		while (q.length > 0) {
			const [i, j, x, y] = q.shift();
			if (
				i < 0 ||
				i >= newShape.length ||
				j < 0 ||
				j >= newShape[0].length
			) {
				continue;
			}
			if (newShape[i][j] > 0) {
				const key = `${i},${j}`;
				if (key in seen) {
					continue;
				}
				seen[key] = true;
				newCoordinates.push([x, y]);
				q.push([i - 1, j, x - 1, y]);
				q.push([i + 1, j, x + 1, y]);
				q.push([i, j - 1, x, y - 1]);
				q.push([i, j + 1, x, y + 1]);
			}
		}
		return [newShapeIdx, newCoordinates];
	}
	setCoordinates(coordinates) {
		this.coordinates = coordinates;
	}
	setShapeIdxAndCoordinates(shapeIdx, coordinates) {
		this.shapeIdx = shapeIdx;
		this.coordinates = coordinates;
	}
}

export default Puzzle;
