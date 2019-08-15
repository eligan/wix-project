const PuzzleSolver = require('./PuzzleSolver');
const PriorityQueue = require('./PriorityQueue');
const Board = require('./../board/Board');
const Vertex = require('./Vertex');
const config = require('config');

describe('PuzzleSolver', () => {
    describe('.constructor()', () => {
        const board = new Board();
        const solver = new PuzzleSolver(board);

        it('Should have logger property', () => {
            expect(solver).toHaveProperty('logger');
        });

        it('Should have close property which is empty array', () => {
            expect(solver).toHaveProperty('logger');
            expect(Array.isArray(solver.close)).toBe(true);
            expect(solver.close.length).toBe(0);
        });

        it('Should have open property which is PriorityQueue instance', () => {
            expect(solver).toHaveProperty('open');
            expect(solver.open instanceof PriorityQueue).toBe(true);
        });

        it('Should have open property which contain vertex with passed board', () => {
            const item = solver.open.front();
            expect(item.element instanceof Vertex).toBe(true);
            expect(item.element.board).toEqual(board);
        });
    });

    describe('.getBestOpenVertex()', () => {
        const size = 3;
        const fieldOne = [
            0, 1, 2,
            3, 4, 5,
            6, 7, 8
        ];
        const fieldTwo = [
            1, 2, 3,
            4, 5, 6,
            7, 8, 0
        ];
        const boardOne = new Board({field: Array.from(fieldOne), size});
        const boardTwo = new Board({field: Array.from(fieldTwo), size});
        const vertex = new Vertex( null, boardTwo, null);

        const solver = new PuzzleSolver(boardOne);
        solver.addVertexToOpen(vertex);
        const bestVertex = solver.getBestOpenVertex();

        it('Should return best vertex from open queue', () => {
            expect(bestVertex).toEqual(vertex);
        });

        it('Should dec the open queue size', () => {
            expect(solver.open.size()).toBe(1);
            expect(solver.open.front().element.board).toEqual(boardOne);
        });
    });

    describe('.addVertexToOpen()', () => {
        const size = 3;
        const fieldOne = [
            0, 1, 2,
            3, 4, 5,
            6, 7, 8
        ];
        const fieldTwo = [
            1, 2, 3,
            4, 5, 6,
            7, 8, 0
        ];
        const boardOne = new Board({field: Array.from(fieldOne), size});
        const boardTwo = new Board({field: Array.from(fieldTwo), size});
        const vertex = new Vertex( null, boardTwo, null);

        const solver = new PuzzleSolver(boardOne);
        solver.addVertexToOpen(vertex);

        it('Should push vertex to open queue', () => {
            expect(solver.open.size()).toBe(2);
            expect(solver.open.front().element).toEqual(vertex);
        });
    });

    describe('.addVertexToClose()', () => {
        const size = 3;
        const fieldOne = [
            0, 1, 2,
            3, 4, 5,
            6, 7, 8
        ];
        const fieldTwo = [
            1, 2, 3,
            4, 5, 6,
            7, 8, 0
        ];
        const boardOne = new Board({field: Array.from(fieldOne), size});
        const boardTwo = new Board({field: Array.from(fieldTwo), size});
        const vertex = new Vertex( null, boardTwo, null);

        const solver = new PuzzleSolver(boardOne);
        solver.addVertexToClose(vertex);

        it('Should push vertex hash to close array', () => {
            expect(solver.close.length).toBe(1);
            expect(solver.close[0]).toBe(vertex.getHash());
        });
    });

    describe('.isVertexInClose()', () => {
        const size = 3;
        const fieldOne = [
            0, 1, 2,
            3, 4, 5,
            6, 7, 8
        ];
        const fieldTwo = [
            1, 2, 3,
            4, 5, 6,
            7, 8, 0
        ];
        const boardOne = new Board({field: Array.from(fieldOne), size});
        const boardTwo = new Board({field: Array.from(fieldTwo), size});
        const vertex = new Vertex( null, boardTwo, null);

        const solver = new PuzzleSolver(boardOne);
        solver.addVertexToClose(vertex);
        const result = solver.isVertexInClose(vertex);

        it('Should return true if vertex hash is in close array', () => {
            expect(result).toBe(true);
        });
    });

    describe('.run()', () => {
        const {UP, DOWN, RIGHT, LEFT} = config.game.moves;
        const size = 3;
        const field = [
            2, 1, 3,
            4, 5, 6,
            8, 7, 0
        ];
        const board = new Board({field: Array.from(field), size});
        const solver = new PuzzleSolver(board);
        const result = solver.run();
        const expectedResult = [
            UP, LEFT, DOWN, LEFT, UP,
            UP, RIGHT, RIGHT, DOWN, DOWN,
            LEFT, UP, LEFT, DOWN, RIGHT,
            RIGHT, UP, UP, LEFT, DOWN,
            RIGHT, DOWN
        ];

        it('Should return path from initial to goal board state', () => {
            expect(result).toEqual(expectedResult);
        });
    });
});