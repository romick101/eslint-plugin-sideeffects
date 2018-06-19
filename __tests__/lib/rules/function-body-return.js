'use strict';

const rule = require('../../../lib/rules/function-body-return'),
    RuleTester = require('eslint').RuleTester;

RuleTester.setDefaultConfig({
    parserOptions: {
        ecmaVersion: 6
    }
});
const ruleTester = new RuleTester();

ruleTester.run('function-body-return', rule, {
    valid: [{
        code: `
        function correct0() {
            return 5;
        }
        function correct1() {
            if (foo() === 5) {
                return 5;
            }
            return 5;
        }
        function correct2() {
            if (foo() === 5) {
                return 5;
            } else {
                return 5;
            }
        }
        class C {
            constructor() {}
        }
        const correctArrow0 = () => {return 5;}
        const correctArrow1 = () => 5
        `
    }],
    invalid: [{
        code: `
        function wrong0 () {
            2+3;
        }    
        function wrong1() {
            if (wrong0()) {
                return 7;
            } 
        }
        function wrong2() {
            if (wrong0()) {
                return 7;
            } else {
                2+3;
            }
        }
        function wrong3() {
            return;
        }
        function wrong4() {
            return undefined;
        }
        const wrongArrow0 = () => {};
        const wrongArrow1 = () => undefined;
        `,
        errors: [{
                message: `Expected to return a value in function 'wrong0'.`
            },
            {
                message: `Expected function 'wrong1' to always return a value.`
            },
            {
                message: `Expected function 'wrong2' to always return a value.`
            },
            {
                message: `Expected to return a value in function 'wrong3'.`
            },
            {
                message: `Expected to return a value in function 'wrong4'.`
            },
            {
                message: 'Expected to return a value in arrow function.'
            },
            {
                message: 'Expected to return a value in arrow function.'
            }
        ]
    }]
});