const FieldFactory = require('./FieldFactory');
const config = require('config');

class Board {
	constructor(initialState, steps, startTime) {
        this.state = initialState || FieldFactory.generateField(config.game.fieldSize);
        this.steps = steps || 0;
		this.startTime = startTime || Date.now();
		this.duration = 0;
		this.finished = this.isFinished();
		this.blankTileIndex = this.getBlankTileIndex();
		this.possibleMoves = this.findPossibleMoves();
	}

	getState() {
		return this.state;
	}

	getSteps() {
	    return this.steps;
    }

    getStartTime() {
	    return this.startTime;
    }

	getBlankTileIndex() {
		return this.state.field.indexOf(0);
	}

	getTopTileIndex() {
		return this.blankTileIndex - this.state.size;
	}

	getBottomTileIndex() {
		return this.blankTileIndex + this.state.size;
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
		if (rightTileIndex % this.state.size !== 0) {
			steps.push(RIGHT);
		}

		const leftTileIndex = this.getLeftTileIndex();
		if (leftTileIndex >= 0 && leftTileIndex % this.state.size < this.state.size - 1) {
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
		this.updateDuration();
		this.finished = this.isFinished();
		this.blankTileIndex = this.getBlankTileIndex();
		this.possibleMoves = this.findPossibleMoves();
	}

	getChildes() {
		const moves = this.possibleMoves;
		const {field, size} = this.state;
		return moves.map((move) => {
			const childBoard = new Board({size, field: Array.from(field)}, this.steps, this.startTime);
			childBoard.makeMove(move);
			return {childBoard, move};
		});
	}

	swapTiles(i, j) {
		const {field} = this.state;
        if (i === j || i < 0 || j < 0 || i >= field.length || j >= field.length) {
            return;
        }
        [field[i], field[j]] = [field[j], field[i]];
	}

	updateDuration() {
        this.duration = Date.now() - this.startTime;
    }

	isFinished() {
		const {field} = this.state;
        return field.reduce((flag, item, index, arr) => {
			if (index === arr.length - 1) {
				return flag && (item === 0);
			}
			return flag && (item === index + 1);
		}, true);
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
