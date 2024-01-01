const { ESLint } = require('eslint');

const removeIgnoredFiles = async files => {
    const eslint = new ESLint();
    const isIgnored = await Promise.all(files.map(file => eslint.isPathIgnored(file)));
    const filteredFiles = files.filter((_, i) => !isIgnored[i]);
    return filteredFiles.join(' ');
};

module.exports = {
    '*.{ts}': ['prettier --write', 'git add .'],
    '*.{ts,d.ts}': async files => {
        const filesToLint = await removeIgnoredFiles(files);
        return [`eslint --fix --max-warnings=0 ${filesToLint}`];
    },
};
