'use strict';

const rule = require('../../../lib/rules/no-global-var-references'),
    RuleTester = require('eslint').RuleTester;

RuleTester.setDefaultConfig({
    parserOptions: {
        ecmaVersion: 6
    }
});
const ruleTester = new RuleTester();

ruleTester.run('no-global-obj-altering', rule, {
    valid: [{
        code: `const someGlobalVariable = [1, 2, 3];

            function pureFunction(arg) {
                const localEmptyObject = Object.create(null);
                return Object.assign(localEmptyObject, {
                    value: arg
                });
            }`
    }],
    invalid: [{
        code: `
            const chalk = require('chalk');
            let someUndefinedVariable;
            const someGlobalVariable = [1, 2, 3];

            function impureFunction() {
                const localVar = 5;
                console.log(chalk.yellow('I have side-effects'));
                someGlobalVariable.push(4);
            }`,
        errors: [{
            message: 'References of global variables found: chalk,someGlobalVariable'
        }]
    }]
});