import type {Config} from 'jest';

const config: Config = {

  clearMocks: true,


  collectCoverage: true,


  coverageDirectory: "coverage",


  coverageProvider: "v8",
 
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'], // Only test files inside `tests/` folder

  // preset: 'ts-jest/presets/default-esm',
  // testEnvironment: 'node',
  // extensionsToTreatAsEsm: ['.ts'],
  // globals: {
  //   'ts-jest': {
  //     useESM: true,
  //   },
  // },
  // moduleNameMapper: {
  //   '^(\\.{1,2}/.*)\\.js$': '$1',
  // },

};

export default config;


