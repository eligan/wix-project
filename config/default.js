const gameName = '15 PUZZLE';
const directions = {
	UP: 'UP',
	RIGHT: 'RIGHT',
	DOWN: 'DOWN',
	LEFT: 'LEFT',
};

const config = {
	gameName,
	terminal: {
		width: 600,
		height: 400,
	},
	store: {
		savedGamesFolder: 'savedGames',
		logsFolder: 'logs',
	},
	info: {
		header: ('\t').repeat(5) + gameName + '\n',
		text: `The ${gameName} is a sliding puzzle that consists of a frame of numbered square tiles in random order with one tile missing.\n` +
			'The object of the puzzle is to place the tiles in order by making sliding moves that use the empty space.\n\n',
		controls: 'Use the arrow buttons to control tile\n' +
			'Press \'SHIFT\'+\'R\' to run solver for current state\n' +
			'Press \'SHIFT\'+\'S\' to save game and go to menu\n' +
			'Press \'ESC\' to go to menu\n\n'
	},
	menu: {
		mainHeader: 'MENU\n',
		loadHeader: 'SELECT GAME\n',
		mainItems: {
			NEW_GAME: 'NEW GAME',
			LOAD_GAME: 'LOAD GAME',
			EXIT: 'EXIT',
		}
	},
	game: {
		field: {
			rows: 3,
			cols: 3,
		},
		moves: directions
	},
	input: {
		controls: directions
	}
};

module.exports = config;
