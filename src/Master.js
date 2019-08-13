const Presentation = require('./presentation/Presentation');
const SaveLoadProvider = require('./providers/SaveLoadProvider');
const LogProvider = require('./providers/LogProvider');
const InputController = require('./inputControllers/InputController');
const Board = require('./board/Board');
const PuzzleSolver = require('./puzzleSolver/PuzzleSolver');
const config = require('config');
const terminal = require('terminal-kit').terminal ;

async function sleep(time) {
	return new Promise(resolve => setTimeout(resolve, time))
}

class Master {
	constructor() {
		this.SLP = new SaveLoadProvider();
		this.logger = new LogProvider();
		this.presentation = new Presentation(terminal);
	}

	async run() {
		this.presentation.renderInfo();
		const selectedMenuItem = await this.presentation.mainMenuSelect();
		const mainMenuItems = config.menu.mainItems;
		switch (selectedMenuItem) {
			case mainMenuItems.NEW_GAME:
				await this.startGame();
				break;
			case mainMenuItems.LOAD_GAME:
				await this.loadGame();
				break;
			case mainMenuItems.EXIT:
				this.exitGame();
		}
	}

	async startGame(initialState) {
		const board = new Board(initialState);
		const input = new InputController(terminal);
		const state = board.getState();
		this.presentation.renderBoard(state);
		input.startCaptureInput();

		return new Promise((resolve) => {
			input.on('move', async (direction) => {
				board.makeMove(direction);

				const state = board.getState();
				this.presentation.renderBoard(state);

				if (board.isFinished()) {
					input.stopCaptureInput();
					await this.presentation.renderStats(board.getStats());
					resolve();
				}
			});

			input.on('solve', async () => {
				input.stopCaptureInput();
				this.presentation.renderComputing();
				const solver = new PuzzleSolver(board);
				const path = solver.run();
				await this.presentation.renderPressAnyKey('Computed!');
				for (let i = 0; i < path.length; i++) {
					await sleep(1000);
					const direction = path[i];
					board.makeMove(direction);
					const state = board.getState();
					this.presentation.renderBoard(state);

					if (board.isFinished()) {
						input.stopCaptureInput();
						await this.presentation.renderStats(board.getStats());
						resolve();
					}
				}
			});

			input.on('save', async () => {
				input.stopCaptureInput();
				const name = await this.presentation.gameNameInput();
				const state = board.getState();
				await this.SLP.saveGame(name, state);
				resolve();
			});

			input.on('escape', async () => {
				input.stopCaptureInput();
				await this.presentation.renderStats(board.getStats());
				resolve();
			});
		});
	}

	async loadGame() {
		const savedGames = await this.SLP.getSavedGames();
		const gameName = await this.presentation.loadGameMenuSelect(savedGames);
		if (!gameName) {
			return;
		}
		const loadedSate = await this.SLP.getSavedGameState(gameName);
		await this.startGame(loadedSate);
	}

	exitGame() {
		process.exit();
	}
}

(async () => {
	const master = new Master();
	while(true) {
		await master.run();
	}
})();
