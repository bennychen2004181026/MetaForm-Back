module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },

    extends: ['airbnb', 'plugin:@typescript-eslint/recommended', 'prettier'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        tsconfigRootDir: __dirname,
    },
    parser: '@typescript-eslint/parser',
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: '**/tsconfig.json',
            },
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
            },
        },
    },
    plugins: ['react', '@typescript-eslint', 'prettier', '@typescript-eslint', 'import'],
    rules: {
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-unused-vars': 'off',

        'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
        'no-shadow': 'off',
        'no-console': 'error',
        'prefer-destructuring': ['error', { object: true, array: false }],
        'consistent-return': 'off',
        'prettier/prettier': [
            'error',
            {
                semi: true,
                trailingComma: 'all',
                singleQuote: true,
                printWidth: 100,
                tabWidth: 4,
                endOfLine: 'auto',
            },
        ],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
                'd.ts': 'never',
            },
        ],
        'func-names': ['error', 'never', { generators: 'as-needed' }],
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: true,
            },
        ],
    },
};
