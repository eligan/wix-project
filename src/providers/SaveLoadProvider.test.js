const fs = require('fs');
const path = require('path');
const config = require('config');
const SaveLoadProvider = require('./SaveLoadProvider');
const {promisify} = require('util');
const readFile = promisify(fs.readFile);

describe('SaveLoadProvider', () => {

    afterAll(() => {
        const testPath = path.resolve(__dirname, `../../${config.store.savedGamesFolder}`);
        if (fs.existsSync(testPath)) {
            fs.rmdirSync(testPath);
        }
    });

    describe('.constructor()', () => {
        const provider = new SaveLoadProvider();

        it('Should have savedGamesFolderPath property which is path to saved games folder', () => {
            expect(provider).toHaveProperty('savedGamesFolderPath');
            const expectedPath = path.resolve(__dirname, `../../${config.store.savedGamesFolder}`);
            expect(provider.savedGamesFolderPath).toBe(expectedPath);
        });

        it('Should have logger property', () => {
            expect(provider).toHaveProperty('logger');

        });

        it('Should create a folder', () => {
            expect(fs.existsSync(provider.savedGamesFolderPath)).toBe(true);
        });
    });

    describe('.createFolder()', () => {
        const provider = new SaveLoadProvider();
        const testFoled = 'test';
        const testFolderPath = path.resolve(__dirname, testFoled);

        afterAll(() => {
            if (fs.existsSync(testFolderPath)) {
                fs.rmdirSync(testFolderPath);
            }
        });

        describe('When folder not exists', () => {
            beforeAll(() => {
                if (fs.existsSync(testFolderPath)) {
                    fs.rmdirSync(testFolderPath);
                }

                provider.createFolder(testFolderPath);
            });

            it('Should create a folder', () => {
                expect(fs.existsSync(testFolderPath)).toBe(true);
            });
        });

        describe('When folder not exists', () => {
            beforeAll(() => {
                if (!fs.existsSync(testFolderPath)) {
                    fs.mkdirSync(testFolderPath);
                }

                provider.createFolder(testFolderPath);
            });

            it('Should left it as is', () => {
                expect(fs.existsSync(testFolderPath)).toBe(true);
            });
        });
    });

    describe('.saveGame()', () => {
        const provider = new SaveLoadProvider();
        const testBoardData = {
            state: {
                size: 3,
                field: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            },
            startTime: 0,
            steps: 0,
        };
        const name = 'test';
        const expectedPath = path.resolve(provider.savedGamesFolderPath, name);

        beforeAll(async () => {
            await provider.saveGame(name, testBoardData);
        });

        afterAll(() => {
            if (fs.existsSync(expectedPath)) {
                fs.unlinkSync(expectedPath);
            }
        });

        it('Should create a file inside saved games folder', () => {
            expect(fs.existsSync(expectedPath)).toBe(true);
        });

        it('Should serialize and save passed data to file', async () => {
            const {state: {size, field}, startTime, steps} = testBoardData;
            const expectedFileData = `${startTime} ${steps} ${size} ${field.join(' ')}`;
            const fileData = await readFile(expectedPath, {encoding: 'utf8'});
            expect(fileData).toBe(expectedFileData);
        });
    });

    describe('.getSavedGames()', () => {
        const provider = new SaveLoadProvider();
        const testBoardData = {
            state: {
                size: 3,
                field: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            },
            startTime: 0,
            steps: 0,
        };
        const name = 'test';
        const expectedPath = path.resolve(provider.savedGamesFolderPath, name);

        beforeAll(async () => {
            await provider.saveGame(name, testBoardData);
        });

        afterEach(() => {
            if (fs.existsSync(expectedPath)) {
                fs.unlinkSync(expectedPath);
            }
        });

        it('Should return array of names of saved games', async () => {
            const expectedArray = [name];
            const result = await provider.getSavedGames();
            expect(result).toEqual(expectedArray);
        });

        it('Should return empty array if there is no saved games', async () => {
            const expectedArray = [];
            const result = await provider.getSavedGames();
            expect(result).toEqual(expectedArray);
        });
    });

    describe('.getSavedGame()', () => {
        const provider = new SaveLoadProvider();
        const testBoardData = {
            state: {
                size: 3,
                field: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            },
            startTime: 0,
            steps: 0,
        };
        const name = 'test';
        const expectedPath = path.resolve(provider.savedGamesFolderPath, name);

        beforeAll(async () => {
            await provider.saveGame(name, testBoardData);
        });

        afterAll(() => {
            if (fs.existsSync(expectedPath)) {
                fs.unlinkSync(expectedPath);
            }
        });

        it('Should return object that was passed on save', async () => {
            const result = await provider.getSavedGame(name);
            expect(result).toEqual(testBoardData);
        });
    });
});