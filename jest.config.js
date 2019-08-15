const jestConfig = {
    verbose: true,
    bail: 2,
    notify: true,
    notifyMode: 'always',
    testRegex: '\\.test\\.js$',
    testEnvironment: 'node',
    transformIgnorePatterns: ['node_modules'],
    moduleFileExtensions: ['js'],
    moduleDirectories: [
        './node_modules',
        './src',
    ],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js'],
    coverageThreshold: {
        global: {
            lines: 1,
        },
    },
    coverageDirectory: 'reports/coverage',
};

module.exports = jestConfig;
