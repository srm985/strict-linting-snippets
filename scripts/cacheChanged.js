const fs = require('fs');
const simpleGit = require('simple-git/promise');

const {
    CACHE_LOCATION,
    FILE_EXTENSIONS,
    retrieveExtension
} = require('./utils');

const git = simpleGit();

const retrieveCachedFilesList = () => {
    const cachedFilesList = [];

    console.log('Attempting to read from existing changed files cache...');

    try {
        const fileContents = fs.readFileSync(CACHE_LOCATION, 'utf8');

        const fileList = fileContents.trim().replace(/\r/g, '').split('\n');

        cachedFilesList.push(...fileList);
    } catch (error) {
        console.log('No existing changed files cache found...');
    }

    return cachedFilesList;
};

const writeChanged = (fileList) => {
    console.log('Attempting to write changed files to cache...');

    // Add a final newline before writing.
    const fileListString = `${fileList.join('\n')}\n`;

    fs.appendFile(CACHE_LOCATION, fileListString, (writeError) => {
        if (writeError) {
            throw new Error(writeError);
        }
    });
};

const commitCacheLog = async (currentBranch) => {
    const commitMessage = `[${currentBranch}] Automatic Commit: Committing changed files cache.`;

    console.log('Committing changed files cache...');

    await git.add(CACHE_LOCATION);
    await git.commit(commitMessage, [
        '--no-verify'
    ]);
};

const recordChangedFiles = async () => {
    try {
        // Grab the branch name of our branch.
        const {
            current: currentBranch = ''
        } = await git.branchLocal();

        await git.fetch();

        // Let's try to compare our push against the remote instance of develop.
        const {
            files: changedFileDetails = []
        } = await git.diffSummary([
            `origin/${currentBranch}`
        ]);

        // TODO: Compare diff to develop and filter out any matching files.

        // Generate our list of files we want to track.
        const changedFileList = changedFileDetails.map((fileDetails) => {
            const {
                file: filePath
            } = fileDetails;

            return filePath;
        }).filter((filePath) => {
            const extensionType = retrieveExtension(filePath);

            return FILE_EXTENSIONS.includes(extensionType);
        });

        if (changedFileList.length) {
            const existingFilesList = retrieveCachedFilesList();

            // Drop any duplicate files.
            const finalizedFilesList = changedFileList.filter((file) => !existingFilesList.includes(file));

            if (finalizedFilesList.length) {
                writeChanged(finalizedFilesList);

                await commitCacheLog(currentBranch);
            } else {
                console.log('All changed files already exist in cache...');
            }
        } else {
            console.log('No relevant files have changed...');
        }
    } catch (error) {
        console.log(error);
    }
};

recordChangedFiles();
