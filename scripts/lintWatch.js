/**
 * To prevent linting our entire code base every time
 * we save a file, we'll only lint changed files on save.
 */
const chokidar = require('chokidar');

const lint = require('./lint');
const {
    retrieveExtension
} = require('./utils');

chokidar.watch([
    '*.js',
    '*.scss',
    '*.ts',
    'scripts/*.js',
    'scripts/*.ts',
    'src/**/*.js',
    'src/**/*.scss',
    'src/**/*.ts'
], {
    awaitWriteFinish: {
        pollInterval: 100,
        stabilityThreshold: 500
    },
    ignored: /src\/app\/assets\/.*\.(j|t)s/
}).on('change', (file) => {
    const extensionType = retrieveExtension(file);

    console.log(`linting changed ${extensionType}...`);

    if (extensionType === 'scss') {
        lint.lintSCSS(file, true);
    } else {
        lint.lintJSTS(file, true);
    }
});
