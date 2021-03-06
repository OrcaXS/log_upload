module.exports = {
  "extends": ["eslint:recommended", "plugin:node/recommended", "airbnb-base"],
  "rules": {
    "no-use-before-define": [0, {}],
    "strict": 0,
    "node/no-unsupported-features/es-syntax": 0,
  },
  "env": {
    "es6": true,
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 2018,
  },
  settings: {
  },
};
