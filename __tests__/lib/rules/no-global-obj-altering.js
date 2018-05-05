"use strict";

const rule = require("../../../lib/rules/no-global-obj-altering"),
    RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester();

ruleTester.run("no-global-obj-altering", rule, {
    valid: [{
        code: "var foo = true",
        options: [{
            allowFoo: true
        }]
    }],

    invalid: [{
            code: "var invalidVariable = true",
            errors: [{
                message: "Unexpected invalid variable."
            }]
        },
        {
            code: "var invalidVariable = true",
            errors: [{
                message: /^Unexpected.+variable/
            }]
        }
    ]
});