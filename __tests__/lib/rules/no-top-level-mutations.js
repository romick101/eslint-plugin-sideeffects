'use strict';

const rule = require('../../../lib/rules/no-top-level-mutations'),
    RuleTester = require('eslint').RuleTester;

RuleTester.setDefaultConfig({
    parserOptions: {
        ecmaVersion: 6
    }
});
const ruleTester = new RuleTester();

ruleTester.run('no-top-level-mutations', rule, {
    valid: [{
        code: ``
    }],
    invalid: [{
        code: ``,
        errors: []
    }]
});