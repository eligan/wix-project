const Presentation = require('../presentation/Presentation');
const SaveLoadProvider = require('../providers/SaveLoadProvider');
const LogProvider = require('../providers/LogProvider');
const InputProvider = require('../providers/InputProvider');
const Board = require('../board/Board');
const PuzzleSolver = require('../puzzleSolver/PuzzleSolver');
const config = require('config');
const terminal = require('terminal-kit').terminal ;

async function sleep(time) {
	return new Promise(resolve => setTimeout(resolve, time))
}

class Master {
	constructor() {
        this.logger = LogProvider.logger.child({class: 'Master'});
        this.SLP = new SaveLoadProvider();
		this.presentation = new Presentation(terminal);
	}

	async run() {
		this.presentation.renderInfo();
		const selectedMenuItem = await this.presentation.mainMenuSelect();
        this.logger.info('Selected menu item:', selectedMenuItem);
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

	async startGame(initialState, steps, startTime) {
        this.logger.info('New game started');
        const board = new Board(initialState, steps, startTime);
        const input = new InputProvider(terminal);
		this.presentation.renderBoard(board.getState());
        input.startCaptureInput();

		return new Promise((resolve) => {
			input.on('move', async (direction) => {
				board.makeMove(direction);

				this.presentation.renderBoard(board.getState());

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
                this.presentation.renderBoard(board.getState());

				for (let i = 0; i < path.length; i++) {
					await sleep(500);
					const direction = path[i];
					board.makeMove(direction);
					this.presentation.renderBoard(board.getState());

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
				const startTime = board.getStartTime();
				const steps = board.getSteps();
				await this.SLP.saveGame(name, {state, startTime, steps});
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
        this.logger.info('Loading game');
        const savedGames = await this.SLP.getSavedGames();
		const gameName = await this.presentation.loadGameMenuSelect(savedGames);
        this.logger.info('Selected game name:', gameName);
        if (!gameName) {
			return;
		}
        const savedGame = await this.SLP.getSavedGame(gameName);
		await this.startGame(savedGame.state, savedGame.steps, savedGame.startTime);
	}

	exitGame() {
        this.logger.info('Exit game');
        process.exit();
	}
}

module.exports = Master;
