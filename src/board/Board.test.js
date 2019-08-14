const config = require('config');
const Board = require('./Board');
const FieldFactory = require('./FieldFactory');

describe('Board', () => {
    describe('.constructor()', () => {
        describe('Without params', () => {
            const board = new Board();

            it('Should have state property', () => {
                expect(board).toHaveProperty('state');
            });

            it('Should have state property which have field and size properties', () => {
                expect(board.state).toHaveProperty('field');
                expect(board.state).toHaveProperty('size');
                expect(board.state.size).toBe(config.game.fieldSize);
            });

            it('Should have steps property with default value', () => {
                expect(board).toHaveProperty('steps');
                expect(board.steps).toBe(0);
            });

            it('Should have startTime property', () => {
                expect(board).toHaveProperty('startTime');
            });

            it('Should have duration property', () => {
                expect(board).toHaveProperty('duration');
            });

            it('Should have finished property with default value', () => {
                expect(board).toHaveProperty('finished');
                const isFinished = board.isFinished();
                expect(board.finished).toBe(isFinished);
            });

            it('Should have blankTileIndex property with index of blank tile', () => {
                expect(board).toHaveProperty('blankTileIndex');
                const blankTileIndex = board.getBlankTileIndex();
                expect(board.blankTileIndex).toBe(blankTileIndex);
            });

            it('Should have possibleMoves property with array of possible moves', () => {
                expect(board).toHaveProperty('possibleMoves');
                const possibleMoves = board.findPossibleMoves();
                expect(board.possibleMoves).toEqual(possibleMoves);
            });
        });

        describe('With params', () => {
            const initialState = FieldFactory.generateField(config.game.fieldSize);
            const steps = 1;
            const startTime = Date.now();
            const board = new Board(initialState, steps, startTime);

            it('Should have state property', () => {
                expect(board).toHaveProperty('state');
            });

            it('Should have state property which have field and size properties with passed values', () => {
                expect(board.state).toHaveProperty('field');
                expect(board.state.field).toEqual(initialState.field);
                expect(board.state).toHaveProperty('size');
                expect(board.state.size).toBe(initialState.size);
            });

            it('Should have steps property with passed value', () => {
                expect(board).toHaveProperty('steps');
                expect(board.steps).toBe(steps);
            });

            it('Should have startTime property with passed value', () => {
                expect(board).toHaveProperty('startTime');
                expect(board.startTime).toBe(startTime);
            });

            it('Should have duration property', () => {
                expect(board).toHaveProperty('duration');
            });

            it('Should have finished property with default value', () => {
                expect(board).toHaveProperty('finished');
                const isFinished = board.isFinished();
                expect(board.finished).toBe(isFinished);
            });

            it('Should have blankTileIndex property with index of blank tile', () => {
                expect(board).toHaveProperty('blankTileIndex');
                const blankTileIndex = board.getBlankTileIndex();
                expect(board.blankTileIndex).toBe(blankTileIndex);
            });

            it('Should have possibleMoves property with array of possible moves', () => {
                expect(board).toHaveProperty('possibleMoves');
                const possibleMoves = board.findPossibleMoves();
                expect(board.possibleMoves).toEqual(possibleMoves);
            });
        });
    });

    describe('.getState()', () => {
        const board = new Board();
        const state = board.getState();

        it('Should return value of state property', () => {
            expect(state).toEqual(board.state);
        });
    });

    describe('.getSteps()', () => {
        const board = new Board();
        const steps = board.getSteps();

        it('Should return value of steps property', () => {
            expect(steps).toBe(board.steps);
        });
    });

    describe('.getStartTime()', () => {
        const board = new Board();
        const time = board.getStartTime();

        it('Should return value of startTime property', () => {
            expect(time).toBe(board.startTime);
        });
    });

    describe('.getBlankTileIndex()', () => {
        const board = new Board();
        const index = board.getBlankTileIndex();

        it('Should return index of blank tile within field array', () => {
            expect(index).toBe(board.state.field.indexOf(0));
        });
    });

    describe('.getTopTileIndex()', () => {
        const board = new Board();
        const index = board.getTopTileIndex();

        it('Should return index of tile above blank tile', () => {
            expect(index).toBe(board.blankTileIndex - board.state.size);
        });
    });

    describe('.getBottomTileIndex()', () => {
        const board = new Board();
        const index = board.getBottomTileIndex();

        it('Should return index of tile under blank tile', () => {
            expect(index).toBe(board.blankTileIndex + board.state.size);
        });
    });

    describe('.getRightTileIndex()', () => {
        const board = new Board();
        const index = board.getRightTileIndex();

        it('Should return index of tile to the right to blank tile', () => {
            expect(index).toBe(board.blankTileIndex + 1);
        });
    });

    describe('.getLeftTileIndex()', () => {
        const board = new Board();
        const index = board.getLeftTileIndex();

        it('Should return index of tile to the left to blank tile', () => {
            expect(index).toBe(board.blankTileIndex - 1);
        });
    });

    describe('.incStepCount()', () => {
        const board = new Board();
        const prevStepsCount = board.steps;
        board.incStepCount();

        it('Should add 1 to steps property', () => {
            expect(board.steps).toBe(prevStepsCount + 1);
        });
    });

    describe('.incStepCount()', () => {
        const board = new Board();
        const prevStepsCount = board.steps;
        board.incStepCount();

        it('Should add 1 to steps property', () => {
            expect(board.steps).toBe(prevStepsCount + 1);
        });
    });

    describe('.findPossibleMoves()', () => {
        describe('When blank tile in center', () => {
            const field = [
                3, 1, 7,
                8, 0, 4,
                2, 5, 6
            ];
            const size = 3;
            const board = new Board({field, size});
            const allPossibleMoves = Object.values(config.game.moves);

            it('Should have all possible moves: ' + allPossibleMoves.join(','), () => {
                expect(board.possibleMoves.length).toBe(allPossibleMoves.length);
                allPossibleMoves.forEach(move => {
                    expect(board.possibleMoves).toContain(move);
                });
            });
        });

        describe('When blank tile in bottom row', () => {
            const field = [
                3, 1, 7,
                8, 5, 4,
                2, 0, 6
            ];
            const size = 3;
            const board = new Board({field, size});
            const {UP, RIGHT, LEFT} = config.game.moves;
            const possibleMoves = [UP, RIGHT, LEFT];

            it('Should have next possible moves: ' + possibleMoves.join(','), () => {
                expect(board.possibleMoves.length).toBe(possibleMoves.length);
                possibleMoves.forEach(move => {
                    expect(board.possibleMoves).toContain(move);
                });
            });
        });

        describe('When blank tile in top row', () => {
            const field = [
                3, 0, 7,
                8, 5, 4,
                2, 1, 6
            ];
            const size = 3;
            const board = new Board({field, size});
            const {DOWN, RIGHT, LEFT} = config.game.moves;
            const possibleMoves = [DOWN, RIGHT, LEFT];

            it('Should have next possible moves: ' + possibleMoves.join(','), () => {
                expect(board.possibleMoves.length).toBe(possibleMoves.length);
                possibleMoves.forEach(move => {
                    expect(board.possibleMoves).toContain(move);
                });
            });
        });

        describe('When blank tile in very right column', () => {
            const field = [
                3, 4, 7,
                8, 5, 0,
                2, 1, 6
            ];
            const size = 3;
            const board = new Board({field, size});
            const {DOWN, UP, LEFT} = config.game.moves;
            const possibleMoves = [DOWN, UP, LEFT];

            it('Should have next possible moves: ' + possibleMoves.join(','), () => {
                expect(board.possibleMoves.length).toBe(possibleMoves.length);
                possibleMoves.forEach(move => {
                    expect(board.possibleMoves).toContain(move);
                });
            });
        });

        describe('When blank tile in very left column', () => {
            const field = [
                3, 4, 7,
                0, 5, 8,
                2, 1, 6
            ];
            const size = 3;
            const board = new Board({field, size});
            const {DOWN, UP, RIGHT} = config.game.moves;
            const possibleMoves = [DOWN, UP, RIGHT];

            it('Should have next possible moves: ' + possibleMoves.join(','), () => {
                expect(board.possibleMoves.length).toBe(possibleMoves.length);
                possibleMoves.forEach(move => {
                    expect(board.possibleMoves).toContain(move);
                });
            });
        });

        describe('When blank tile in bottom left corner', () => {
            const field = [
                3, 4, 7,
                2, 5, 8,
                0, 1, 6
            ];
            const size = 3;
            const board = new Board({field, size});
            const {UP, RIGHT} = config.game.moves;
            const possibleMoves = [UP, RIGHT];

            it('Should have next possible moves: ' + possibleMoves.join(','), () => {
                expect(board.possibleMoves.length).toBe(possibleMoves.length);
                possibleMoves.forEach(move => {
                    expect(board.possibleMoves).toContain(move);
                });
            });
        });

        describe('When blank tile in top left corner', () => {
            const field = [
                0, 4, 7,
                2, 5, 8,
                3, 1, 6
            ];
            const size = 3;
            const board = new Board({field, size});
            const {DOWN, RIGHT} = config.game.moves;
            const possibleMoves = [DOWN, RIGHT];

            it('Should have next possible moves: ' + possibleMoves.join(','), () => {
                expect(board.possibleMoves.length).toBe(possibleMoves.length);
                possibleMoves.forEach(move => {
                    expect(board.possibleMoves).toContain(move);
                });
            });
        });

        describe('When blank tile in top right corner', () => {
            const field = [
                7, 4, 0,
                2, 5, 8,
                3, 1, 6
            ];
            const size = 3;
            const board = new Board({field, size});
            const {DOWN, LEFT} = config.game.moves;
            const possibleMoves = [DOWN, LEFT];

            it('Should have next possible moves: ' + possibleMoves.join(','), () => {
                expect(board.possibleMoves.length).toBe(possibleMoves.length);
                possibleMoves.forEach(move => {
                    expect(board.possibleMoves).toContain(move);
                });
            });
        });

        describe('When blank tile in bottom right corner', () => {
            const field = [
                7, 4, 6,
                2, 5, 8,
                3, 1, 0
            ];
            const size = 3;
            const board = new Board({field, size});
            const {UP, LEFT} = config.game.moves;
            const possibleMoves = [UP, LEFT];

            it('Should have next possible moves: ' + possibleMoves.join(','), () => {
                expect(board.possibleMoves.length).toBe(possibleMoves.length);
                possibleMoves.forEach(move => {
                    expect(board.possibleMoves).toContain(move);
                });
            });
        });
    });

    describe('.swapTiles()', () => {
        describe('When indexes are correct', () => {
            const board = new Board();
            const i = 1;
            const j = 2;
            const iIndex = board.state.field.indexOf(i);
            const jIndex = board.state.field.indexOf(j);
            const prevFieldState = Array.from(board.state.field);
            board.swapTiles(iIndex, jIndex);

            it('Should swap two tiles and left other as is', () => {
                expect(board.state.field[iIndex]).toBe(j);
                expect(board.state.field[jIndex]).toBe(i);
                board.state.field.forEach((item, index) => {
                    if (index !== iIndex && index !== jIndex) {
                        expect(item).toBe(prevFieldState[index]);
                    }
                });
            });
        });

        describe('When indexes are equal', () => {
            const board = new Board();
            const i = 1;
            const iIndex = board.state.field.indexOf(i);
            const prevFieldState = Array.from(board.state.field);
            board.swapTiles(iIndex, iIndex);

            it('Should left field as it was', () => {
                expect(board.state.field).toEqual(prevFieldState);
            });
        });

        describe('When one of indexes are lower then zero', () => {
            const board = new Board();
            const prevFieldState = Array.from(board.state.field);
            board.swapTiles(-1, 1);
            board.swapTiles(1, -3);

            it('Should left field as it was', () => {
                expect(board.state.field).toEqual(prevFieldState);
            });
        });

        describe('When one of indexes are bigger or equal field length', () => {
            const board = new Board();
            const prevFieldState = Array.from(board.state.field);
            board.swapTiles(board.state.field.length, 1);
            board.swapTiles(1, board.state.field.length + 1);

            it('Should left field as it was', () => {
                expect(board.state.field).toEqual(prevFieldState);
            });
        });
    });

    describe('.isFinished()', () => {
        describe('When field are in solved state', () => {
            const field = [
                1, 2, 3,
                4, 5, 6,
                7, 8, 0
            ];
            const size = 3;
            const board = new Board({field, size});
            const isFinished = board.isFinished();

            it('Should return true', () => {
                expect(isFinished).toBe(true);
            });
        });

        describe('When field are not in solved state', () => {
            const field = [
                0, 1, 2,
                3, 4, 5,
                6, 7, 8
            ];
            const size = 3;
            const board = new Board({field, size});
            const isFinished = board.isFinished();

            it('Should return false', () => {
                expect(isFinished).toBe(false);
            });
        });
    });

    describe('.getStats()', () => {
        const board = new Board();
        const stats = board.getStats();

        it('Should return object with finished property', () => {
            expect(stats).toHaveProperty('finished');
            expect(stats.finished).toBe(board.finished);
        });

        it('Should return object with steps property', () => {
            expect(stats).toHaveProperty('steps');
            expect(stats.steps).toBe(board.steps);
        });

        it('Should return object with duration property', () => {
            expect(stats).toHaveProperty('duration');
            expect(stats.duration).toBe(board.duration);
        });
    });

    describe('.makeMove()', () => {
        describe('When try to make possible move', () => {
            const size = 3;
            const field = [
                0, 1, 2,
                3, 4, 5,
                6, 7, 8
            ];
            const expectedNextFieldState = [
                3, 1, 2,
                0, 4, 5,
                6, 7, 8
            ];
            const {DOWN, RIGHT, UP} = config.game.moves;
            const expectedNextPossibleMoves = [DOWN, RIGHT, UP];
            const board = new Board({field, size});
            board.makeMove(DOWN);

            it('Should change field array by making passed move', () => {
                expect(board.state.field).toEqual(expectedNextFieldState);
            });

            it('Should inc steps property', () => {
                expect(board.steps).toEqual(1);
            });

            it('Should update blankTileIndex property', () => {
                expect(board.blankTileIndex).toBe(3);
            });

            it('Should update possibleMoves property', () => {
                expect(board.possibleMoves.length).toBe(3);
                expectedNextPossibleMoves.forEach(move => {
                    expect(board.possibleMoves).toContain(move);
                });
            });
        });

        describe('When try to make NOT possible move', () => {
            const size = 3;
            const field = [
                0, 1, 2,
                3, 4, 5,
                6, 7, 8
            ];
            const board = new Board({field: Array.from(field), size});
            const possibleMoves = Array.from(board.possibleMoves);
            board.makeMove(config.game.moves.UP);

            it('Should NOT change field', () => {
                expect(board.state.field).toEqual(field);
            });

            it('Should NOT inc steps property', () => {
                expect(board.steps).toEqual(0);
            });

            it('Should NOT update blankTileIndex property', () => {
                expect(board.blankTileIndex).toBe(0);
            });

            it('Should NOT update possibleMoves property', () => {
                possibleMoves.forEach(move => {
                    expect(board.possibleMoves).toContain(move);
                });
            });
        });

        describe('When try to make move but finished is true', () => {
            const size = 3;
            const field = [
                1, 2, 3,
                4, 5, 6,
                7, 8, 0
            ];
            const board = new Board({field: Array.from(field), size});
            const possibleMoves = Array.from(board.possibleMoves);
            board.makeMove(config.game.moves.UP);

            it('Should be finished', () => {
                expect(board.finished).toEqual(true);
            });

            it('Should NOT change field', () => {
                expect(board.state.field).toEqual(field);
            });

            it('Should NOT inc steps property', () => {
                expect(board.steps).toEqual(0);
            });

            it('Should NOT update blankTileIndex property', () => {
                expect(board.blankTileIndex).toBe(8);
            });

            it('Should NOT update possibleMoves property', () => {
                possibleMoves.forEach(move => {
                    expect(board.possibleMoves).toContain(move);
                });
            });
        });
    });

    describe('.getChildes()', () => {
        const size = 3;
        const field = [
            0, 1, 2,
            3, 4, 5,
            6, 7, 8
        ];
        const {DOWN, RIGHT} = config.game.moves;
        const expectedChildrenFields = {
            [DOWN]: [
                3, 1, 2,
                0, 4, 5,
                6, 7, 8
            ],
            [RIGHT]: [
                1, 0, 2,
                3, 4, 5,
                6, 7, 8
            ]
        };
        const board = new Board({field, size});
        const childrens = board.getChildes();

        it('Should return array with length equal possible moves count', () => {
            expect(Array.isArray(childrens)).toBe(true);
            expect(childrens.length).toBe(board.possibleMoves.length);
        });

        it('Should return array where each item has childBoard and move properties', () => {
            childrens.forEach(item => {
                expect(item).toHaveProperty('childBoard');
                expect(item.childBoard instanceof Board).toBe(true);
                expect(item).toHaveProperty('move');
                expect(board.possibleMoves).toContain(item.move);
            });
        });

        it('Should return array where each item has childBoard which make specified move', () => {
            childrens.forEach(item => {
                expect(item.childBoard.state.field).toEqual(expectedChildrenFields[item.move]);
                expect(item.childBoard.steps).toBe(board.steps + 1);
            });
        });
    });
});