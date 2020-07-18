const eslintStrictConfigure = () => {
    const {
        env: {
            LINT_CACHED,
            NODE_ENV
        }
    } = process;

    const shouldLintCached = LINT_CACHED === 'true';
    const isProduction = NODE_ENV === 'prod';

    const ruleSet = ({
        extends: 'airbnb-base',
        rules: {
            'array-bracket-newline': [
                'error',
                {
                    minItems: 1
                }
            ],
            'array-element-newline': [
                'error',
                {
                    minItems: 1
                }
            ],
            'arrow-parens': [
                'error',
                'always'
            ],
            'class-methods-use-this': [
                0
            ],
            'comma-dangle': [
                'error',
                'never'
            ],
            curly: [
                'error',
                'all'
            ],
            'import/no-dynamic-require': [
                0
            ],
            'import/no-extraneous-dependencies': [
                'error',
                {
                    devDependencies: [
                        'scripts/*'
                    ]
                }
            ],
            indent: [
                'error',
                4,
                {
                    SwitchCase: 1
                }
            ],
            'linebreak-style': [
                0
            ],
            'lines-between-class-members': [
                'error',
                'always',
                {
                    exceptAfterSingleLine: true
                }
            ],
            'max-len': [
                0
            ],
            'no-empty': [
                'error',
                {
                    allowEmptyCatch: true
                }
            ],
            'no-multiple-empty-lines': [
                'error',
                {
                    max: 1
                }
            ],
            'no-plusplus': [
                'error',
                {
                    allowForLoopAfterthoughts: true
                }
            ],
            'no-underscore-dangle': [
                0
            ],
            'no-unused-vars': [
                'error',
                {
                    args: 'after-used',
                    ignoreRestSiblings: true
                }
            ],
            'object-curly-newline': [
                'error',
                {
                    minProperties: 1
                }
            ],
            'object-property-newline': [
                'error',
                {
                    allowMultiplePropertiesPerLine: false
                }
            ],
            'sort-keys': [
                'error',
                'asc',
                {
                    caseSensitive: true,
                    natural: true
                }
            ]
        }
    });

    return isProduction && !shouldLintCached ? {} : ruleSet;
};

module.exports = eslintStrictConfigure();
