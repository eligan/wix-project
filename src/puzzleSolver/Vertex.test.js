const Vertex = require('./Vertex');
const Board = require('./../board/Board');
const config = require('config');

describe('Vertex', () => {
    describe('.constructor()', () => {
        describe('When NOT passing params', () => {
            const vertex = new Vertex();

            it('Should have board property which is Board instance', () => {
                expect(vertex).toHaveProperty('board');
                expect(vertex.board instanceof Board).toBe(true);
            });

            it('Should have parentVertex property with default value', () => {
                expect(vertex).toHaveProperty('parentVertex');
                expect(vertex.parentVertex).toBe(null);
            });

            it('Should have steps property with default value', () => {
                expect(vertex).toHaveProperty('steps');
                expect(vertex.steps).toBe(vertex.board.getSteps());
            });

            it('Should have wrongTiles property with value >= 0', () => {
                expect(vertex).toHaveProperty('wrongTiles');
                expect(vertex.wrongTiles >= 0).toBe(true);
            });

            it('Should have manhattan property with value >= 0', () => {
                expect(vertex).toHaveProperty('manhattan');
                expect(vertex.manhattan >= 0).toBe(true);
            });

            it('Should have linearConflicts property with value >= 0', () => {
                expect(vertex).toHaveProperty('linearConflicts');
                expect(vertex.linearConflicts >= 0).toBe(true);
            });

            it('Should have measure property with value >= 0', () => {
                expect(vertex).toHaveProperty('measure');
                expect(vertex.measure >= 0).toBe(true);
                expect(vertex.measure)
                    .toBe(vertex.steps + vertex.wrongTiles + vertex.manhattan + vertex.linearConflicts * 2);
            });
        });

        describe('When passing params', () => {
            const parentVertex = new Vertex();
            const board = new Board();
            const move = config.game.moves.UP;
            const vertex = new Vertex(parentVertex, board, move);

            it('Should have board property which is equal passed board', () => {
                expect(vertex).toHaveProperty('board');
                expect(vertex.board).toEqual(board);
            });

            it('Should have parentVertex property which is equal passed parent vertex', () => {
                expect(vertex).toHaveProperty('parentVertex');
                expect(vertex.parentVertex).toEqual(parentVertex);
            });

            it('Should have steps property wich is equal board steps', () => {
                expect(vertex).toHaveProperty('steps');
                expect(vertex.steps).toBe(board.getSteps());
            });

            it('Should have wrongTiles property with value >= 0', () => {
                expect(vertex).toHaveProperty('wrongTiles');
                expect(vertex.wrongTiles >= 0).toBe(true);
            });

            it('Should have manhattan property with value >= 0', () => {
                expect(vertex).toHaveProperty('manhattan');
                expect(vertex.manhattan >= 0).toBe(true);
            });

            it('Should have linearConflicts property with value >= 0', () => {
                expect(vertex).toHaveProperty('linearConflicts');
                expect(vertex.linearConflicts >= 0).toBe(true);
            });

            it('Should have measure property with value >= 0', () => {
                expect(vertex).toHaveProperty('measure');
                expect(vertex.measure >= 0).toBe(true);
                expect(vertex.measure)
                    .toBe(vertex.steps + vertex.wrongTiles + vertex.manhattan + vertex.linearConflicts * 2);
            });
        });
    });

    describe('.getHash()', () => {
        const board = new Board();
        const vertex = new Vertex(null, board, null);
        const hash = vertex.getHash();

        it('Should be equal board field array joined by hyphen', () => {
            expect(hash).toBe(board.state.field.join('-'));
        });
    });

    describe('.getMeasure()', () => {
        const vertex = new Vertex();
        const measure = vertex.getMeasure();

        it('Should return measure', () => {
            expect(vertex.measure).toBe(measure);
        });
    });

    describe('.getPath()', () => {
        const parentVertex = new Vertex();
        const board = new Board();
        const vertex = new Vertex(parentVertex, board, config.game.moves.UP);
        const path = vertex.getPath();

        it('Should return array', () => {
            expect(Array.isArray(path)).toBe(true);
        });

        it('Should return array which contains moves from parent vertexes chain', () => {
            expect(path.length).toBe(1);
            expect(path[0]).toBe(config.game.moves.UP);
        });
    });

    describe('.getManhattanDistance()', () => {
        /*
        * Manhattan distances - sum of absolute horizontal distance and absolute vertical distance
        *   of every tile to its correct location
        * */
        const field = [
            3, 1, 7,
            8, 5, 4,
            2, 0, 6
        ];
        const size = 3;
        const board = new Board({field, size});
        const vertex = new Vertex(null, board, null);
        const manhattan = vertex.getManhattanDistance();
        const expectedManhattan = 13;

        it('Should return expected number', () => {
            expect(manhattan).toBe(expectedManhattan);
        });
    });

    describe('.getWrongTiles()', () => {
        /*
        * Number of tiles that are not on theirs goal location
        * */
        const field = [
            3, 1, 7,
            8, 5, 4,
            2, 0, 6
        ];
        const size = 3;
        const board = new Board({field, size});
        const vertex = new Vertex(null, board, null);
        const wrongTiles = vertex.getWrongTiles();
        const expectedWrongTiles = 8;

        it('Should return expected number', () => {
            expect(wrongTiles).toBe(expectedWrongTiles);
        });
    });

    describe('.getLinearConflictsCount()', () => {
        /*
        * Two tiles are in a linear conflict if they are in the same row or column,
        *   also their goal positions are in the same row or column
        *   and the goal position of one of the tiles is blocked by the other tile
        *   in that row.
        * */
        const field = [
            3, 1, 7,
            8, 5, 4,
            2, 0, 6
        ];
        const size = 3;
        const board = new Board({field, size});
        const vertex = new Vertex(null, board, null);
        const linearConflicts = vertex.getLinearConflictsCount();
        const expectedLinearConflicts = 1;

        it('Should return expected number', () => {
            expect(linearConflicts).toBe(expectedLinearConflicts);
        });
    });
});