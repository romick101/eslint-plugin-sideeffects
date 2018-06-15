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

/**
 * Checks a given code path segment is reachable.
 *
 * @param {CodePathSegment} segment - A segment to check.
 * @returns {boolean} `true` if the segment is reachable.
 */
function isReachable(segment) {
    return segment.reachable;
}

/**
 * Gets a readable location.
 *
 * - FunctionExpression -> the function name or `function` keyword.
 *
 * @param {ASTNode} node - A function node to get.
 * @returns {ASTNode|Token} The node or the token of a location.
 */
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

        /**
         * Checks whether or not the last code path segment is reachable.
         * Then reports this function if the segment is reachable.
         * If the last code path segment is reachable, there are paths which are not
         * returned or thrown.
         * 
         * Arrow functions with non-undefined impilicit returns and
         * non-empty bodies are skipped
         *
         * @param {ASTNode} node - A node to check.
         * @returns {void}
         */
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