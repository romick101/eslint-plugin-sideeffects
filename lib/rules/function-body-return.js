/**
 * @fileoverview Enforces functions to always return value.
 * @author Roman Stylyk
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const {
    isIdentifier,
    getFunctionName
} = require("../core/workWithAST");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function isReachable(segment) {
    return segment.reachable;
}

function getId(node) {
    return node.id || node;
}

function hasEmptyBody(node) {
    return node.body &&
        Array.isArray(node.body.body) &&
        node.body.body.length === 0;
}

function evalsToUndefined(node) {
    return !Boolean(node) ||
        isIdentifier(node, "undefined") ||
        node.operator == "void";
}

function isIncorrectReturn(node) {
    const argument = node.argument;
    return !Boolean(argument) || evalsToUndefined(argument);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "force functions to return values",
            category: "Side Effects"
        }
    },

    create(context) {
        let funcInfo = {
            upper: null,
            codePath: null,
            hasReturn: false,
            node: null
        };

        function checkLastSegment(node) {
            if (node.type === 'ArrowFunctionExpression' &&
                !evalsToUndefined(node.body) && !hasEmptyBody(node))
                return;
            if (funcInfo.codePath.currentSegments.some(isReachable)) {
                context.report({
                    node,
                    loc: getId(node).loc.start,
                    message: funcInfo.hasReturn ?
                        "Expected {{name}} to always return a value." : "Expected to return a value in {{name}}.",
                    data: {
                        name: getFunctionName(funcInfo.node)
                    }
                });
            }
        }

        return {
            // Stacks this function's information.
            onCodePathStart(codePath, node) {
                funcInfo = {
                    upper: funcInfo,
                    codePath,
                    hasReturn: false,
                    node
                };
            },
            // Pops this function's information.
            onCodePathEnd() {
                funcInfo = funcInfo.upper;
            },
            // Report incorrect returnStatement.
            ReturnStatement(node) {
                funcInfo.hasReturn = true;
                if (isIncorrectReturn(node)) {
                    context.report({
                        node,
                        message: "Expected to return a value in {{name}}.",
                        data: {
                            name: getFunctionName(funcInfo.node)
                        }
                    });
                }
            },
            "FunctionExpression:exit": checkLastSegment,
            "FunctionDeclaration:exit": checkLastSegment,
            "ArrowFunctionExpression:exit": checkLastSegment
        };
    }
};