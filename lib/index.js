/**
 * @author Roman
 */
"use strict";

// import all rules in lib/rules
module.exports.rules = {
    'no-top-level-mutations': require('./rules/no-top-level-mutations'),
    'no-arg-mutations': require('./rules/no-arg-mutations'),
    'function-body-return': require('./rules/function-body-return')
};