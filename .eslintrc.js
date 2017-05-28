module.exports = {
  extends: ['airbnb-base'],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true
  },
  ecmaFeatures: {
    blockBindings: true,
    templateStrings: true
  },
  globals: {
    expect: true,
    sinon: true,
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    'no-underscore-dangle': ['error', { allow: ['_id', '_uid', '__v'] }],
    // Line length
    'max-len': ['error', 80, 2, { ignoreComments: true }],
    // Functions
    'func-names': ['error', 'never'],
    'arrow-parens': ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'no-param-reassign': ['error', { props: false }],
    'linebreak-style': 0
  }
};
