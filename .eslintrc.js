module.exports = {
  extends: ['airbnb-base'],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    'no-underscore-dangle': ['error', { allow: ['_id', '_uid', '__v'] }],
    // Line length
    'max-len': ['error', 100, 2],
    // Functions
    'func-names': ['error', 'never'],
    'arrow-parens': ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'no-param-reassign': ['error', { props: false }],
    'no-prototype-builtins': 0,
    'no-param-reassign': 0,
    'no-restricted-syntax': 0,
    'no-return-assign': 0,
    'no-underscore-dangle': 0,
    'no-unused-expressions': 0,
    'guard-for-in': 0,
    'no-plusplus': 0,
    'object-curly-newline': 0
  }
};
