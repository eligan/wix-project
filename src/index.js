const Master = require('./master/Master');
const LogProvider = require('./providers/LogProvider');

(async () => {
    const master = new Master();
    while(true) {
        try {
            await master.run();
        } catch (error) {
            LogProvider.logger.error(error);
            process.exit(1);
        }
    }
})();
