const config = require('config');

class FieldFactory {
	constructor() {
		this.rows = config.game.field.rows;
		this.cols = config.game.field.cols;
	}

	getFieldBlank() {
		return (new Array(this.rows * this.cols)).fill().map((val, index) => (index));
	}

	shuffleField(field) {
		const clone = Array.from(field);
		for (let i = clone.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[clone[i], clone[j]] = [clone[j], clone[i]];
		}
		return clone;
	}

	isFieldSolvable(field) {
		const indexOfZero = field.indexOf(0) + 1;
		const rawOfZero = (indexOfZero - indexOfZero % this.cols) / this.cols + 1;

		const criteria = field.reduce((summ, item, index) => {
			if (index === field.length - 1) {
				return summ;
			}

			const amountOfBiggerItems = field
				.slice(index + 1)
				.filter(nextItem => nextItem > item)
				.length;

			return summ + amountOfBiggerItems;
		}, rawOfZero);

		return criteria % 2 === 0;
	}

	generateField() {
		let shuffledField;
		let solvable = false;
		do {
			const fieldBlank = this.getFieldBlank();
			shuffledField = this.shuffleField(fieldBlank);
			solvable = this.isFieldSolvable(shuffledField);
		} while (!solvable);
		return {
			field: shuffledField,
			rows: this.rows,
			cols: this.cols,
		};
	}
}

module.exports = FieldFactory;
