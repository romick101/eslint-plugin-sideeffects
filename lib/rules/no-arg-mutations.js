/**
 * @fileoverview Rule to disallow function arguments mutations
 * @author Roman Stylyk
 */
"use strict";

const {
    objectAssignMatcher,
    isMutatingMethod
} = require('../core/workWithAST')

function getMutatedArgument(node, args) {
    if (node.type === 'MemberExpression') {
        return getMutatedArgument(node.object, args)
    }
    if (node.type === 'CallExpression') {
        if (node.callee.type === 'MemberExpression' &&
            !isMutatingMethod(node.callee.property))
            return null;
        return getMutatedArgument(node.callee, args)
    }
    if (node.type === 'Identifier') {
        if (node.name === undefined)
            return null;
        return args.find(el => el.name === node.name)
    }
}

function isMutatingArgument(node, args) {
    const possibleTarget = getMutatedArgument(node, args);
    const mutatingMethod = isMutatingMethod(node.property);
    return Boolean(possibleTarget) && mutatingMethod;
}

function argumentsOrNamedIdentifier(name) {
    return name === undefined || name === 'arguments' ? 'arguments' : name
}

function getMethodReportMessage(name) {
    return argumentsOrNamedIdentifier(name) === 'arguments' ?
        'Method {{method}} mutating function arguments' :
        'Method {{method}} mutating function argument {{name}}'
}

function getObjectReportMessage(name) {
    return argumentsOrNamedIdentifier(name) === 'arguments' ?
        'Object.assign mutating function arguments' :
        'Object.assign mutating function argument {{name}}'
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
        let args = [];
        return {
            "FunctionDeclaration Identifier[name='arguments']": node => {
                args.push(node);
            },
            "ArrowFunctionExpression Identifier[name='arguments']": node => {
                args.push(node);
            },
            'FunctionDeclaration[params]': node => {
                args = args.concat(node.params);
            },
            'FunctionExpression[params]': node => {
                args = args.concat(node.params);
            },
            'ArrowFunctionExpression[params]': node => {
                args = args.concat(node.params);
            },
            'CallExpression > MemberExpression:exit': node => {
                const method = isMutatingArgument(node, args);
                if (typeof method === 'string')
                    context.report({
                        node,
                        message: getMethodReportMessage(node.object.name),
                        data: {
                            method,
                            name: argumentsOrNamedIdentifier(node.object.name)
                        }
                    })
            },
            [objectAssignMatcher]: node => {
                if (node.parent.arguments[0] !== undefined &&
                    getMutatedArgument(node.parent.arguments[0], args))
                    context.report({
                        node,
                        message: getObjectReportMessage(node.parent.arguments[0].name),
                        data: {
                            name: argumentsOrNamedIdentifier(node.parent.arguments[0].name)
                        }
                    })
            }
        };
    }
};