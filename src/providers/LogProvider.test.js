const fs = require('fs');
const path = require('path');
const config = require('config');
const LogProvider = require('./LogProvider');

describe('LogProvider', () => {

    afterAll(() => {
        const testPath = path.resolve(__dirname, `../../${config.store.logsFolder}`);
        if (fs.existsSync(testPath)) {
            fs.rmdirSync(testPath);
        }
    });

    describe('get logsFolderPath()', () => {
        const folderPath = LogProvider.logsFolderPath;
        const expectedFolderPath = path.resolve(__dirname, `../../${config.store.logsFolder}`);

        it('Should return log folder path', () => {
           expect(folderPath).toBe(expectedFolderPath)
        });
    });

    describe('get logFilePath()', () => {
        const filePath = LogProvider.logFilePath;
        const fileName = filePath.split('/').pop();

        it('Should return log file path and filename shoud be valid ISO date', () => {
           const date = new Date(fileName);
           expect(fileName).toBe(date.toISOString());
        });
    });

    describe('.createFolder()', () => {
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

                LogProvider.createFolder(testFolderPath);
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

                LogProvider.createFolder(testFolderPath);
            });

            it('Should left it as is', () => {
                expect(fs.existsSync(testFolderPath)).toBe(true);
            });
        });
    });
});
