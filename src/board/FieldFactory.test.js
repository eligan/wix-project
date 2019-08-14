const config = require('config');
const FieldFactory = require('./FieldFactory');

describe('FieldFactory', () => {
    describe('.getFieldBlank()', () => {
        const fieldBlank = FieldFactory.getFieldBlank(config.game.fieldSize);

        it('Should return array', () => {
            expect(Array.isArray(fieldBlank)).toBe(true);
        });

        it('Should return array where length is equal size * size', () => {
            expect(fieldBlank.length).toBe(config.game.fieldSize * config.game.fieldSize);
        });

        it('Should return array where indexes is equal values', () => {
            fieldBlank.forEach((value, index) => {
                expect(value).toBe(index);
            })
        });
    });

    describe('.shuffleField()', () => {
        const fieldBlank = FieldFactory.getFieldBlank(config.game.fieldSize);
        const shuffledField = FieldFactory.shuffleField(fieldBlank);

        it('Should return array', () => {
            expect(Array.isArray(shuffledField)).toBe(true);
        });

        it('Should return array with same length as input array has', () => {
            expect(fieldBlank.length).toBe(shuffledField.length);
        });

        it('Should return array which is a copy of input array', () => {
            expect(fieldBlank).not.toBe(shuffledField);
            shuffledField.forEach(item => expect(fieldBlank).toContain(item));
        });

        it('Should return array where items have a different order than input array', () => {
            expect(shuffledField).not.toEqual(fieldBlank);
        });
    });

    describe('.isOddSizeFieldIsSolvable()', () => {
        /*
        * A pair of tiles form an inversion if the the values on tiles are in reverse order of their appearance in goal state.
        * */
        it('Should return false if field contains odd number of tile inversions', () => {
            const testFieldWithOneInversion = [2, 1, 3, 4, 5, 6, 7, 8, 0]; // inversion of 1,2
            const result = FieldFactory.isOddSizeFieldIsSolvable(testFieldWithOneInversion);
            expect(result).toBe(false);
        });

        it('Should return true if field contains even number of tile inversions', () => {
            const testFieldWithTwoInversions = [2, 1, 3, 4, 5, 6, 8, 7, 0]; // inversion of 1,2 and 7,8
            const result = FieldFactory.isOddSizeFieldIsSolvable(testFieldWithTwoInversions);
            expect(result).toBe(true);
        });
    });

    describe('.isEvenSizeFieldIsSolvable()', () => {
        /*
        * i - tile with i number
        * Ki - number of tiles after i-tile that are smaller than i; Ki will be 0 if after i-tile no tiles that are smaller than i
        * e - row of zero tile, starts from 1
        * N = sum( Ki ) + e; where i = 1..15
        * if N is odd then puzzle is not solvable
        * */
        const size = 4;

        it('Should return false if N for this field is odd', () => {
            const testFieldWithOddN = [3, 9, 1, 15, 14, 11, 4, 6, 13, 0, 10, 12, 2, 7, 8, 5];
            const resultForOddN = FieldFactory.isEvenSizeFieldIsSolvable(testFieldWithOddN, size);
            expect(resultForOddN).toBe(false);
        });

        it('Should return true if N for this field is even', () => {
            const testFieldWithEvenN = [6, 13, 7, 10, 8, 9, 11, 0, 15, 2, 12, 5, 14, 3, 1, 4];
            const resultForEvenN = FieldFactory.isEvenSizeFieldIsSolvable(testFieldWithEvenN, size);
            expect(resultForEvenN).toBe(true);
        });
    });

    describe('.generateField()', () => {
        const size = 4;
        const result = FieldFactory.generateField(size);

        it('Should return object with field and size properties', () => {
            expect(result).toHaveProperty('field');
            expect(result).toHaveProperty('size');
        });

        it('Should return object with size property that equal passed size', () => {
            expect(result.size).toBe(size);
        });

        it('Should return object with field property that is an array', () => {
            expect(Array.isArray(result.field)).toBe(true);
        });

        it('Should return object with field property that is an array with length equal size * size', () => {
            expect(result.field.length).toBe(size * size);
        });

        it('Should return object with field that is solvable', () => {
            expect(FieldFactory.isEvenSizeFieldIsSolvable(result.field, result.size)).toBe(true);
        });
    })
});