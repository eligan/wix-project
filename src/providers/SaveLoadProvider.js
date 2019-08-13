const config = require('config');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

class SaveLoadProvider {
	constructor() {
		this.savedGamesFolderPath = path.resolve(__dirname, `../../${config.store.savedGamesFolder}`);
		this.createFolder(this.savedGamesFolderPath);
	}

	createFolder(folderPath) {
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath)
		}
	}

	async getSavedGames() {
		try {
			return await readdir(this.savedGamesFolderPath);
		} catch (err) {
			// write errors to file
		}
		return [];
	}

	async saveGame(name, state) {
		const data = `${state.rows} ${state.cols} ${state.field.join(' ')}`;
		const filePath = path.resolve(this.savedGamesFolderPath, name);
		await writeFile(filePath, data);
	}

	async getSavedGameState(name) {
		const filePath = path.resolve(this.savedGamesFolderPath, name);
		let data = await readFile(filePath, {encoding: 'utf8'});
		const [rows, cols, ...field] = data
			.split(' ')
			.map(item => parseInt(item));
		return {field, rows, cols};
	}

}

module.exports = SaveLoadProvider;
