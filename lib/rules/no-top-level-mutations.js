/**
 * @fileoverview Rule to disallow unnecessary semicolons
 * @author Roman Stylyk
 */
"use strict";


function getGlobals(scope) {
    return [...scope.variables, ...scope.implicit.variables];
}

function isMutatingMethod(node) {
    return node.name === 'sort';
}
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow global variables mutations",
            category: "Side Effects"
        }
    },
    create: function (context) {
        const globals = [];
        return {
            Program: node => {
                const scope = context.getScope();
                globals.push(getGlobals(scope));
            },
            "CallExpression > MemberExpression": node => {
                if (globals[0].find(el => el.name == node.object.name) && isMutatingMethod(node.property))
                    context.report({
                        node,
                        message: 'Mutating global variable {{name}}',
                        data: {
                            name: node.object.name
                        }
                    })
            }
        };
    }
};