class FieldFactory {
    static getFieldBlank(size) {
        return (new Array(size * size)).fill().map((val, index) => (index));
    }

    static shuffleField(field) {
        const clone = Array.from(field);
        for (let i = clone.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [clone[i], clone[j]] = [clone[j], clone[i]];
        }
        return clone;
    }

    static isFieldSolvable(field, size) {
        const isEven = (field.length % 2 === 0);
        return isEven
            ? FieldFactory.isEvenSizeFieldIsSolvable(field, size)
            : FieldFactory.isOddSizeFieldIsSolvable(field);
    }

    static isOddSizeFieldIsSolvable(field) {
        let inversionCount = 0;
        for (let i = 0; i < field.length - 2; i++) {
            for (let j = i + 1; j < field.length - 1; j++) {
                if (field[i] && field[j] && field[i] > field[j]) {
                    inversionCount++;
                }
            }
        }
        return inversionCount % 2 === 0;
    }

    static isEvenSizeFieldIsSolvable(field, size) {
        const indexOfZero = field.indexOf(0);
        const rawOfZero = (indexOfZero - indexOfZero % size) / size + 1;

        const criteria = field.reduce((summ, item, index) => {
            if (index === field.length - 1) {
                return summ;
            }

            const amountOfSmallerItems = field
                .slice(index + 1)
                .filter(nextItem => nextItem !== 0 && nextItem < item)
                .length;

            return summ + amountOfSmallerItems;
        }, rawOfZero);

        return criteria % 2 === 0;
    }

    static generateField(size) {
        let shuffledField;
        let solvable = false;
        do {
            const fieldBlank = FieldFactory.getFieldBlank(size);
            shuffledField = FieldFactory.shuffleField(fieldBlank);
            solvable = FieldFactory.isFieldSolvable(shuffledField, size);
        } while (!solvable);
        return {
            field: shuffledField,
            size,
        };
    }
}

module.exports = FieldFactory;
