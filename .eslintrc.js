module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    parserOptions: {
        parser: '@babel/eslint-parser'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        "vue/multi-word-component-names": "off",
        indent: [2, 4],
        'no-unused-vars': 'off',
        'vue/no-unused-vars': "off",
        "no-mixed-spaces-and-tabs": [0, false]
    }
}
