const config = require('config');
const EventEmitter = require('events');

class InputProvider {
	constructor(terminal) {
		this.term = terminal;
		this.ee = new EventEmitter();
	}

	startCaptureInput() {
		const {UP, DOWN, RIGHT, LEFT, ESCAPE, SHIFT_R, SHIFT_S} = config.input.controls;
		this.term.grabInput({ mouse: 'button' });
		this.term.on('key', (name) => {
			switch (name) {
				case UP:
					this.ee.emit('move', DOWN);
					break;
				case DOWN:
					this.ee.emit('move', UP);
					break;
				case RIGHT:
					this.ee.emit('move', LEFT);
					break;
				case LEFT:
					this.ee.emit('move', RIGHT);
					break;
				case ESCAPE:
					this.ee.emit('escape');
					break;
				case SHIFT_R:
					this.ee.emit('solve');
					break;
				case SHIFT_S:
					this.ee.emit('save');
					break;
			}
		});
	}

	stopCaptureInput() {
		this.term.grabInput(false);
		this.ee.removeAllListeners('move');
		this.ee.removeAllListeners('escape');
		this.ee.removeAllListeners('solve');
		this.ee.removeAllListeners('save');
	}

	on(eventName, handler) {
		this.ee.on(eventName, handler);
	}
}

module.exports = InputProvider;
