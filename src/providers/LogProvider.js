const config = require('config');
const fs = require('fs');
const path = require('path');

class LogProvider {
	constructor() {
		this.logsFolderPath = path.resolve(__dirname, `../../${config.store.logsFolder}`);
		this.createFolder(this.logsFolderPath);
	}

	createFolder(folderPath) {
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath)
		}
	}

}

module.exports = LogProvider;
