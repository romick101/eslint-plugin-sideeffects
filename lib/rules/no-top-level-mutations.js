/**
 * @fileoverview Rule to disallow global variables mutations
 * @author Roman Stylyk
 */
"use strict";

/**
 * Helpers 
 */

const {
    predefinedNodeGlobals,
    objectAssignMatcher,
    isMutatingMethod
} = require('../core/workWithAST')

function getGlobals(scope) {
    return [...scope.variables, ...scope.implicit.variables];
}

function isGlobal(node, globals) {
    return [...globals[0], ...predefinedNodeGlobals]
        .find(el =>
            el.name === (node.object ? node.object.name : node.name));
}

function isMutatingGlobal(node, globals) {
    return isGlobal(node, globals) && isMutatingMethod(node.property);
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
            Program: () => {
                const scope = context.getScope();
                globals.push(getGlobals(scope));
            },
            "AssignmentExpression MemberExpression[object.type='Identifier']": node => {
                if (isGlobal(node.object, globals)) {
                    context.report({
                        node,
                        message: 'Assigning property to global variable {{name}}',
                        data: {
                            name: node.object.name
                        }
                    })
                }
            },
            "AssignmentExpression[left.type='Identifier']": node => {
                if (isGlobal(node.left, globals)) {
                    context.report({
                        node,
                        message: 'Assigning global variable {{name}}',
                        data: {
                            name: node.left.name
                        }
                    })
                }
            },
            'CallExpression > MemberExpression': node => {
                const method = isMutatingGlobal(node, globals);
                if (typeof method === 'string')
                    context.report({
                        node,
                        message: 'Method {{method}} mutating global variable {{name}}',
                        data: {
                            method,
                            name: node.object.name
                        }
                    })
            },
            [objectAssignMatcher]: node => {
                if (node.parent.arguments[0] !== undefined && isGlobal(node.parent.arguments[0], globals))
                    context.report({
                        node,
                        message: 'Object.assign mutating global variable {{name}}',
                        data: {
                            name: node.parent.arguments[0].name
                        }
                    })
            }
        };
    }
};