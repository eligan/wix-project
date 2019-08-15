const Board = require('./../board/Board');

class Vertex {
	constructor(parentVertex, board, move) {
		this.board = board || new Board();
		this.parentVertex = parentVertex || null;
		this.move = move || null;
		this.steps = this.board.getSteps();
		this.wrongTiles = this.getWrongTiles();
		this.manhattan = this.getManhattanDistance();
		this.linearConflicts = this.getLinearConflictsCount();
		this.measure = this.steps + this.wrongTiles + this.manhattan + this.linearConflicts * 2;
	}

	getHash() {
		return this.board.getState().field.join('-');
	}

	getMeasure() {
		return this.measure;
	}

	getPath() {
		const result = [this.move];
		let pVertex = this.parentVertex;
		while (pVertex && pVertex.move) {
			result.push(pVertex.move);
			pVertex = pVertex.parentVertex;
		}
		return result.reverse();
	}

	getManhattanDistance() {
		const {field, size} = this.board.getState();
		return field.reduce((summ, item, index) => {
			if (item === 0) {
				return summ
			}
			const winIndex = item - 1;
			const delta = Math.abs(index - winIndex);
			const row = (delta - delta % size) / size;
			const col = delta % size;
			return summ + row + col
		}, 0);
	}

	getWrongTiles() {
		const {field} = this.board.getState();
		return field.reduce((count, item, index, arr) => {
			if (index === arr.length - 1) {
				return item === 0 ? count : count + 1;
			}
			return item === index + 1 ? count : count + 1;
		}, 0);
	}

	getLinearConflictsCount() {
		const {field, size} = this.board.getState();
		let conflictCount = 0;
		// check each row for linear conflict
		for (let row = 0; row < size; row++)
			for (let i = row * size; i < (row + 1) * size - 1; i++) {
				if (field[i] === 0) {
					continue;
				}
				const iGoal = field[i] - 1;
				const iGoalRow = (iGoal - iGoal % size) / size;
				for (let j = i + 1; j < (row + 1) * size; j++) {
					if (field[j] === 0) {
						continue;
					}
					const jGoal = field[j] - 1;
					const jGoalRow = (jGoal - jGoal % size) / size;
					const necessityCondition = (i !== iGoal) && (j !== jGoal) && (iGoalRow === row && jGoalRow === row);
					const sufficiencyCondition = (iGoal > jGoal);
					if (necessityCondition && sufficiencyCondition) {
						conflictCount++;
					}
				}
			}
		// check each column for linear conflict
		for (let col = 0; col < size; col++)
			for (let i = col; i < size * (size - 1) + col; i = i + size) {
				if (field[i] === 0) {
					continue;
				}
				const iGoal = field[i] - 1;
				const iGoalCol = iGoal % size;
				for (let j = i + size; j <= size * (size - 1) + col; j = j + size) {
					if (field[j] === 0) {
						continue;
					}
					const jGoal = field[j] - 1;
					const jGoalCol = jGoal % size;
					const necessityCondition = (i !== iGoal) && (j !== jGoal) && (iGoalCol === col && jGoalCol === col);
					const sufficiencyCondition = (iGoal > jGoal);
					if (necessityCondition && sufficiencyCondition) {
						conflictCount++;
					}
				}
			}
		return conflictCount;
	}

	isGoal() {
		return this.board.finished;
	}
}

module.exports = Vertex;
