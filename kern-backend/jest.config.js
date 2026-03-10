module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": ["ts-jest", { tsconfig: "./tsconfig.spec.json" }],
  },
  transformIgnorePatterns: ["node_modules/(?!uuid)"],
  collectCoverageFrom: [
    "src/**/*.(t|j)s",
    "!src/**/*.interface.ts",
    "!src/**/*.enum.ts",
    "!src/**/*.dto.ts",
    "!src/**/*.schema.ts",
    "!src/main.ts",
  ],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  roots: ["<rootDir>/src/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@modules/(.*)$": "<rootDir>/src/modules/$1",
    "^@common/(.*)$": "<rootDir>/src/common/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@database/(.*)$": "<rootDir>/src/database/$1",
  },
};
