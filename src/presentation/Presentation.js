const config = require('config');

class Presentation {
	constructor(terminal) {
		this.term = terminal;
		this.terminalSetup();
	}

	terminalSetup() {
		this.term.clear();
		this.term.width = config.terminal.width;
		this.term.height = config.terminal.height;
	}

	renderInfo() {
		this.term.clear();
		this.term.green.bold(config.info.header);
		this.term.brightGreen.italic(config.info.text);
	}

	async mainMenuSelect() {
		const {mainItems: items, mainHeader} = config.menu;
		this.term.green.bold(mainHeader);
		const itemsValues = Object.values(items);
		const { selectedText } = await this.term.singleColumnMenu(itemsValues).promise;
		return selectedText;
	}

	async loadGameMenuSelect(savedGames) {
		this.term.clear();
		if (savedGames.length) {
			this.term.green.bold(config.menu.loadHeader);
			const { selectedText } = await this.term.gridMenu(savedGames).promise;
			return selectedText
		}
		await this.renderPressAnyKey('No saved games.');
	}

	async gameNameInput() {
		this.term.clear();
		this.term.green('Give a name to a game: ');
		return await this.term.inputField().promise;
	}

	renderMemo(){
		this.term.brightGreen.italic(config.info.controls);
	}

	renderBoard(state) {
		this.term.clear();
		this.renderMemo();
		const {field, rows, cols} = state;
		for (let i = 0; i < rows; i++) {
			const row = field.slice(i * cols, (i + 1) * cols);
			this.term.green('-----'.repeat(cols) + '-\n');
			this.term.green('|');

			for(let j = 0; j < row.length; j++) {
				const item = row[j];
				let str;
				if (item === 0) {
					str = '    ';
				} else if (item < 10) {
					str = `  ${item} `;
				} else {
					str = ` ${item} `;
				}
				this.term.white(str).green('|');
			}
			this.term.white('\n');
		}
		this.term.green('-----'.repeat(cols) + '-\n');
	}

	async renderStats(stats) {
		if (stats.finished) {
			this.term.white('\nYOU WON!!!\n');
		} else {
			this.term.red('\nYOU NOT WON YET\n');
		}
		this.term.white('STEPS: ').green(`${stats.steps}\n`);
		const time = Math.floor(stats.duration / 1000); // sec
		this.term.white('TIME: ').green(`${time} sec\n`);
		await this.renderPressAnyKey();
	}


	async renderPressAnyKey(msg) {
		return new Promise(resolve => {
			this.term.green(`${msg ? msg + ' ' : '' }Press any key ..`);
			this.term.grabInput(true);
			this.term.on('key', () => {
				resolve();
			});
		});
	}

	renderComputing() {
		this.term.white('\nComputing ...\n');
	}
}

module.exports = Presentation;
