module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePaths: ['<rootDir>/src'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
}