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
        code: `
        function foo(arg1, arg2) {
            return arg1 + arg2;
        }
        function bar() {
            const smth = arguments.someGetter();
            smth.arguments.sort();
            return typeof arguments[0].value;
        }
        const baz = arg => arg.map(x => x);
        `
    }],
    invalid: [{
        code: `function foo(arg1, arg2) {
            Object.assign(arg1, {a: 'b'});
            arguments.sort();
            Object.assign(arguments[0], {a: 'c'});
            arg2.defineProperty();
            return arguments[0].push(5);
        }
        class C {
            constructor(arg) {
                Object.assign(arg, {});
            }
            method(arg) {
                arg.sort();
            }
        }
        const baz1 = arg => arg.sort();
        const baz2 = () => arguments[0].push(5);
        const baz3 = arg => Object.assign(arg, {key: 'value'});
        `,
        errors: [{
            message: 'Object.assign mutating function argument arg1'
        }, {
            message: 'Method sort mutating function arguments'
        }, {
            message: 'Object.assign mutating function arguments'
        }, {
            message: 'Method defineProperty mutating function argument arg2'
        }, {
            message: 'Method push mutating function arguments'
        }, {
            message: 'Object.assign mutating function argument arg'
        }, {
            message: 'Method sort mutating function argument arg'
        }, {
            message: 'Method sort mutating function argument arg'
        }, {
            message: 'Method push mutating function arguments'
        }, {
            message: 'Object.assign mutating function argument arg'
        }]
    }]
});