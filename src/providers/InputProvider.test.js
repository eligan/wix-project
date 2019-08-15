const InputProvider = require('./InputProvider');
const config = require('config');
const EventEmitter = require('events');
const sinon = require('sinon');

describe('InputProvider', () => {
    let sandbox = sinon.createSandbox();
    let terminalMock = {
        grabInput: sandbox.spy(),
        on: sandbox.spy(),
    };

    describe('.constructor()', () => {
        const provider = new InputProvider(terminalMock);

        it('Should have term property which is equal passed param', () => {
            expect(provider).toHaveProperty('term');
            expect(provider.term).toEqual(terminalMock);
        });

        it('Should have ee property which is an EventEmitter instance', () => {
            expect(provider).toHaveProperty('ee');
            expect(provider.ee instanceof EventEmitter).toBe(true);
        });
    });

    describe('.startCaptureInput()', () => {
        let provider;

        beforeAll(() => {
            provider = new InputProvider(terminalMock);
            provider.startCaptureInput();
        });

        afterAll(() => {
            sandbox.resetHistory();
        });

        it('Should call term.grabInput', () => {
            expect(terminalMock.grabInput.callCount).toBe(1);
        });

        it('Should call term.on', () => {
            expect(terminalMock.on.callCount).toBe(1);
        });

        it('Should call term.grabInput before term.on', () => {
            expect(terminalMock.grabInput.calledBefore(terminalMock.on)).toBe(true);
        });

        it('Should call term.grabInput with expected params', () => {
            const expectedParams = {mouse: 'button'};
            const calledWithParams = terminalMock.grabInput.getCall(0).args[0];
            expect(calledWithParams).toEqual(expectedParams);
        });
    });

    describe('.startCaptureInput() key handler', () => {
        let provider;

        beforeAll(() => {
            provider = new InputProvider(terminalMock);
            sandbox.spy(provider.ee, 'emit');
            provider.startCaptureInput();
            const keyHandler = terminalMock.on.getCall(0).args[1];
            Object.values(config.input.controls).forEach(key => keyHandler(key))
        });

        afterAll(() => {
            sandbox.resetHistory();
        });

        it('Should call ee.emit for move event and param DOWN', () => {
            expect(provider.ee.emit.calledWith('move', config.input.controls.DOWN)).toBe(true);
        });

        it('Should call ee.emit for move event and param UP', () => {
            expect(provider.ee.emit.calledWith('move', config.input.controls.UP)).toBe(true);
        });

        it('Should call ee.emit for move event and param LEFT', () => {
            expect(provider.ee.emit.calledWith('move', config.input.controls.LEFT)).toBe(true);
        });

        it('Should call ee.emit for move event and param RIGHT', () => {
            expect(provider.ee.emit.calledWith('move', config.input.controls.RIGHT)).toBe(true);
        });

        it('Should call ee.emit for escape event', () => {
            expect(provider.ee.emit.calledWith('escape')).toBe(true);
        });

        it('Should call ee.emit for solve event', () => {
            expect(provider.ee.emit.calledWith('solve')).toBe(true);
        });

        it('Should call ee.emit for save event', () => {
            expect(provider.ee.emit.calledWith('save')).toBe(true);
        });
    });

    describe('.stopCaptureInput()', () => {
        let provider;

        beforeAll(() => {
            provider = new InputProvider(terminalMock);
            sandbox.spy(provider.ee, 'removeAllListeners');
            provider.stopCaptureInput();
        });

        afterAll(() => {
            sandbox.resetHistory();
        });

        it('Should call term.grabInput', () => {
            expect(terminalMock.grabInput.callCount).toBe(1);
        });

        it('Should call term.grabInput with expected params', () => {
            const expectedParams = false;
            const calledWithParams = terminalMock.grabInput.getCall(0).args[0];
            expect(calledWithParams).toEqual(expectedParams);
        });

        it('Should call ee.removeAllListeners fou move event', () => {
            const params = provider.ee.removeAllListeners.getCall(0).args[0];
            expect(params).toEqual('move');
        });

        it('Should call ee.removeAllListeners fou escape event', () => {
            const params = provider.ee.removeAllListeners.getCall(1).args[0];
            expect(params).toEqual('escape');
        });

        it('Should call ee.removeAllListeners fou solve event', () => {
            const params = provider.ee.removeAllListeners.getCall(2).args[0];
            expect(params).toEqual('solve');
        });

        it('Should call ee.removeAllListeners fou save event', () => {
            const params = provider.ee.removeAllListeners.getCall(3).args[0];
            expect(params).toEqual('save');
        });
    });
});