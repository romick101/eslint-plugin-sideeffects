'use strict';

const rule = require('../../../lib/rules/no-global-obj-altering'),
    RuleTester = require('eslint').RuleTester;

RuleTester.setDefaultConfig({
    parserOptions: {
        ecmaVersion: 6
    }
});
const ruleTester = new RuleTester();

ruleTester.run('no-global-obj-altering', rule, {
    valid: [{
            code: 'function foo () {}'
        },
        {
            code: 'let a = 10;'
        }
    ],

    invalid: [{
            code: 'function impureFoo () {}',
            errors: [{
                message: 'Impure function found: impureFoo'
            }]
        },
        {
            code: 'let impureFoo = () => {};',
            errors: [{
                message: 'Impure function found: impureFoo'
            }]
        }
    ]
});