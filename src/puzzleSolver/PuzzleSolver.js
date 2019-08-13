const Vertex = require('./Vertex');
const PriorityQueue = require('./PriorityQueue');

class PuzzleSolver {
	constructor(initialBoard) {
		this.open = new PriorityQueue();
		this.addVertexToOpen(new Vertex(null, initialBoard, null));
		this.close = []; //contains vertex hashes
	}

	getBestOpenVertex() {
		const queueItem = this.open.dequeue();
		return queueItem.element;
	}

	addVertexToOpen(vertex) {
		this.open.enqueue(vertex, vertex.getMeasure());
	}

	addVertexToClose(vertex) {
		this.close.push(vertex.getHash());
	}

	isVertexInClose(vertex) {
		return this.close.includes(vertex.getHash());
	}

	run() {
		while (!this.open.isEmpty()) {
			const vertex = this.getBestOpenVertex();
			// console.log('Steps: ', vertex.steps, 'Wrong: ', vertex.wrongTiles, ' Manhattan: ', vertex.manhattan, ' Linear: ',vertex.linearConflicts, ' Measure: ', vertex.measure);
			if (vertex.isGoal()) {
				return vertex.getPath();
			}
			this.addVertexToClose(vertex);
			const childrens = vertex.board.getChildes();
			childrens.forEach(({childBoard, move}) => {
				const childVertex = new Vertex(vertex, childBoard, move);
				const isVertexClosed = this.isVertexInClose(childVertex);
				if (!isVertexClosed) {
					this.addVertexToOpen(childVertex);
				}
			});
		}
	}
}

module.exports = PuzzleSolver;
