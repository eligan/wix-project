const FieldFactory = require('./FieldFactory');
const config = require('config');

class Board {
	constructor(initialState) {
		if (initialState) {
			this.state = initialState;
		} else {
			this.state = new FieldFactory().generateField();
		}
		this.startTime = Date.now();
		this.duration = 0;
		this.steps = 0;
		this.finished = this.isFinished();
		this.blankTileIndex = this.getBlankTileIndex();
		this.possibleMoves = this.findPossibleMoves();
	}

	getState() {
		const {field, rows, cols} = this.state;
		return {field, rows, cols};
	}

	getBlankTileIndex() {
		return this.state.field.indexOf(0);
	}

	getTopTileIndex() {
		return this.blankTileIndex - this.state.cols;
	}

	getBottomTileIndex() {
		return this.blankTileIndex + this.state.cols;
	}

	getRightTileIndex() {
		return this.blankTileIndex + 1;
	}

	getLeftTileIndex() {
		return this.blankTileIndex - 1;
	}

	incStepCount() {
		this.steps++;
	}

	findPossibleMoves() {
		const {UP, DOWN, RIGHT, LEFT} = config.game.moves;
		const steps = [];

		const topTileIndex = this.getTopTileIndex();
		if (topTileIndex >= 0) {
			steps.push(UP);
		}

		const bottomTileIndex = this.getBottomTileIndex();
		if (bottomTileIndex < this.state.field.length) {
			steps.push(DOWN);
		}

		const rightTileIndex = this.getRightTileIndex();
		if (rightTileIndex % this.state.cols !== 0) {
			steps.push(RIGHT);
		}

		const leftTileIndex = this.getLeftTileIndex();
		if (leftTileIndex >= 0 && leftTileIndex % this.state.cols < this.state.cols - 1) {
			steps.push(LEFT);
		}

		return steps;
	}

	makeMove(moveType) {
		const {UP, DOWN, RIGHT, LEFT} = config.game.moves;
		const isPossible = this.possibleMoves.includes(moveType);
		if (this.finished || !isPossible) {
			return;
		}
		let moveIndex;
		switch (moveType) {
			case UP:
				moveIndex = this.getTopTileIndex();
				break;
			case DOWN:
				moveIndex = this.getBottomTileIndex();
				break;
			case RIGHT:
				moveIndex = this.getRightTileIndex();
				break;
			case LEFT:
				moveIndex = this.getLeftTileIndex();
				break;
		}
		this.swapTiles(this.blankTileIndex, moveIndex);
		this.incStepCount();
		this.finished = this.isFinished();
		this.blankTileIndex = this.getBlankTileIndex();
		this.possibleMoves = this.findPossibleMoves();
	}

	getChildes() {
		const moves = this.possibleMoves;
		const {field, rows, cols} = this.getState();
		return moves.map((move) => {
			const childBoard = new Board({rows, cols, field: Array.from(field)});
			childBoard.makeMove(move);
			return {childBoard, move};
		});
	}

	swapTiles(i, j) {
		const {field} = this.state;
		[field[i], field[j]] = [field[j], field[i]];
	}

	isFinished() {
		const {field} = this.state;
		const finished = field.reduce((flag, item, index, arr) => {
			if (index === arr.length - 1) {
				return flag && (item === 0);
			}
			return flag && (item === index + 1);
		}, true);
		this.duration = Date.now() - this.startTime;
		return finished;
	}

	getStats() {
		return {
			finished: this.finished,
			steps: this.steps,
			duration: this.duration,
		}
	}
}

module.exports = Board;
