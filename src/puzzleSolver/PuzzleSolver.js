const Vertex = require('./Vertex');
const PriorityQueue = require('./PriorityQueue');
const LogProvider = require('../providers/LogProvider');

class PuzzleSolver {
	constructor(initialBoard) {
        this.logger = LogProvider.logger.child({class: 'PuzzleSolver'});
        this.close = []; //contains vertex hashes
        this.open = new PriorityQueue();
		this.addVertexToOpen(new Vertex(null, initialBoard, null));
    }

	getBestOpenVertex() {
		const {element} = this.open.dequeue();
        this.logger.info(
            'Get the best vertex with metrics:  steps=%d  wrongTiles=%d  manhattan=%d  linearConflicts=%d  measure=%d',
            element.steps,
            element.wrongTiles,
            element.manhattan,
            element.linearConflicts,
            element.measure,
        );
        return element;
	}

	addVertexToOpen(vertex) {
        this.logger.info('Add vertex to OPEN list:', vertex.getHash());
        this.open.enqueue(vertex, vertex.getMeasure());
	}

	addVertexToClose(vertex) {
	    const hash = vertex.getHash();
        this.logger.info('Add vertex to CLOSE list:', hash);
        this.close.push(hash);
	}

	isVertexInClose(vertex) {
		return this.close.includes(vertex.getHash());
	}

	run() {
        this.logger.info('Start solver algorythm');
        while (!this.open.isEmpty()) {
			const vertex = this.getBestOpenVertex();

			if (vertex.isGoal()) {
                this.logger.info('Find goal vertex');
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
