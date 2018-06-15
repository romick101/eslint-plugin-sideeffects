'use strict';

const rule = require('../../../lib/rules/no-arg-mutations'),
    RuleTester = require('eslint').RuleTester;

RuleTester.setDefaultConfig({
    parserOptions: {
        ecmaVersion: 6
    }
});
const ruleTester = new RuleTester();

ruleTester.run('no-arg-mutations', rule, {
    valid: [{
        code: ``
    }],
    invalid: [{
        code: ``,
        errors: []
    }]
});