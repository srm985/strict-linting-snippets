const CACHE_LOCATION = '.lint-cache';

const FILE_EXTENSIONS = [
    'js',
    'scss',
    'ts'
];

const retrieveExtension = (filePath) => {
    const extensionLocation = filePath.lastIndexOf('.') + 1;

    return filePath.slice(extensionLocation).trim().toLowerCase();
};

module.exports = {
    CACHE_LOCATION,
    FILE_EXTENSIONS,
    retrieveExtension
};
