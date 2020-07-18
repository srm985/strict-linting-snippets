const fs = require('fs');

const lint = require('./lint');
const {
    CACHE_LOCATION,
    retrieveExtension
} = require('./utils');

const retrieveCachedFilesList = () => {
    const cachedFilesList = [];

    console.log('Attempting to read from existing changed files cache...');

    try {
        const fileContents = fs.readFileSync(CACHE_LOCATION, 'utf8');

        const fileList = fileContents.replace(/\r/g, '').trim().split('\n');

        cachedFilesList.push(...fileList);
    } catch (error) {
        console.log('No existing changed files cache found...');
    }

    return cachedFilesList;
};

const separateExtensionTypes = (fileList) => {
    const lintingGroups = {
        jsts: [],
        scss: []
    };

    fileList.forEach((file) => {
        const extensionType = retrieveExtension(file);

        if (extensionType === 'scss') {
            lintingGroups.scss.push(file);
        } else {
            lintingGroups.jsts.push(file);
        }
    });

    return lintingGroups;
};

const handleLint = async () => {
    const strictLintingFileList = retrieveCachedFilesList();

    const {
        jsts,
        scss
    } = separateExtensionTypes(strictLintingFileList);

    process.env.LINT_CACHED = true;

    if (jsts.length) {
        lint.lintJSTS(jsts);
    }
    if (scss.length) {
        lint.lintSCSS(scss);
    }
};

handleLint();
