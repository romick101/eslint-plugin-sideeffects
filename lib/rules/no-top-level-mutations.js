/**
 * @fileoverview Rule to disallow unnecessary semicolons
 * @author Roman Stylyk
 */
"use strict";

const mutatingMethods = [
    'copyWithin',
    'pop',
    'push',
    'reverse',
    'shift',
    'sort',
    'splice',
    'unshift',
    'unwatch',
    'watch'
];

const mutatingObjectMethods = [
    'defineProperties',
    'defineProperty',
    'setPrototypeOf'
];

const predefinedNodeGlobals = ['process', 'global', 'console'].map(name => ({
    name
}));

const objectAssignMatcher = "CallExpression > MemberExpression[object.type='Identifier'][object.name='Object'][property.type='Identifier'][property.name='assign']"

function getGlobals(scope) {
    return [...scope.variables, ...scope.implicit.variables];
}

function isGlobal(node, globals) {
    return [...globals[0], ...predefinedNodeGlobals]
        .find(el =>
            el.name === (node.object ? node.object.name : node.name));
}

function isMutatingMethod(node) {
    return [...mutatingMethods, ...mutatingObjectMethods]
        .find(el => el === node.name);
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
            Program: node => {
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
                if (isGlobal(node.parent.arguments[0], globals))
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