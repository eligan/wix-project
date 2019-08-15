const config = require('config');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

const loggerKey = Symbol();
const initTime = new Date();

class LogProvider {
    static get logsFolderPath() {
        return path.resolve(__dirname, `../../${config.store.logsFolder}`);
    }

    static get logFilePath()  {
        return path.resolve(LogProvider.logsFolderPath, initTime.toISOString());
    }

	static get logger() {
		LogProvider.createFolder(LogProvider.logsFolderPath);
		if (!this[loggerKey]) {
		    this[loggerKey] = pino({base: null}, pino.destination(LogProvider.logFilePath));
        }
		return this[loggerKey];
	}

	static createFolder(folderPath) {
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath)
		}
	}
}

module.exports = LogProvider;
