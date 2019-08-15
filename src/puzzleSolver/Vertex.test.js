const Vertex = require('./Vertex');
const Board = require('./../board/Board');

describe('Vertex', () => {
    describe('.constructor()', () => {
        describe('When not passing params', () => {
            const vertex = new Vertex();

            it('Should have board property', () => {
                expect(vertex).toHaveProperty('board');
            });
        });
    });
});