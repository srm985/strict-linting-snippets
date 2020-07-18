const colors = require('colors/safe');
const columnify = require('columnify');
const {
    CLIEngine
} = require('eslint');
const stylelint = require('stylelint');

const eslint = new CLIEngine();

const SEVERITY_ERROR = 'error';
const SEVERITY_WARNING = 'warning';

const formatMessage = (messageInfo) => {
    const {
        column,
        line,
        message,
        rule,
        severity
    } = messageInfo;

    const coloredSeverity = severity === SEVERITY_ERROR ? colors.red('error') : colors.yellow('warning');

    return ({
        location: `${line}:${column}`,
        message,
        rule,
        severity: coloredSeverity
    });
};

const printMessages = (messageList, filePath) => {
    const formattedMessageOutput = columnify(messageList, {
        columns: [
            'location',
            'severity',
            'message',
            'rule'
        ],
        config: {
            location: {
                minWidth: 8
            },
            message: {
                minWidth: 40
            },
            severity: {
                minWidth: 8
            }
        },
        showHeaders: false
    });

    console.log(`\n${filePath}`);
    console.log(formattedMessageOutput);
};

const lint = {
    lintJSTS: (filePaths, isWatching) => {
        const {
            errorCount,
            results = []
        } = eslint.executeOnFiles(filePaths);

        results.forEach((lintedFileResults) => {
            const {
                filePath,
                messages = []
            } = lintedFileResults;

            const messageList = messages.map((messageInfo) => {
                const {
                    column,
                    line,
                    message,
                    ruleId,
                    severity
                } = messageInfo;

                return ({
                    column,
                    line,
                    message,
                    rule: ruleId,
                    severity: severity === 2 ? SEVERITY_ERROR : SEVERITY_WARNING
                });
            }).map(formatMessage) || [];

            if (messageList.length) {
                printMessages(messageList, filePath);
            }
        });

        if (errorCount && !isWatching) {
            process.exit(-1);
        }
    },

    lintSCSS: (filePaths, isWatching) => {
        let fileList;

        if (typeof filePaths === 'string') {
            fileList = filePaths.replace(/\\/g, '/');
        } else {
            fileList = filePaths.map((file) => file.replace(/\\/g, '/'));
        }

        stylelint.lint({
            files: fileList
        }).then((response) => {
            const {
                errored,
                results = []
            } = response;

            results.forEach((lintedFileResults) => {
                const {
                    source,
                    warnings = []
                } = lintedFileResults;

                const messageList = warnings.map((messageInfo) => {
                    const {
                        column,
                        line,
                        rule,
                        severity,
                        text
                    } = messageInfo;

                    return ({
                        column,
                        line,
                        message: text.replace(`(${rule})`, ''),
                        rule,
                        severity
                    });
                }).map(formatMessage) || [];

                if (messageList.length) {
                    printMessages(messageList, source);
                }
            });

            if (errored && !isWatching) {
                process.exit(-1);
            }
        }).catch((error) => {
            const {
                stack
            } = error;

            console.log(colors.red(stack));

            process.exit(-1);
        });
    }
};

module.exports = lint;
