/**
 * @fileoverview Rule to disallow referring global scope variables
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @param {Node} node - FunctionDeclarationNode 
 * @param {String} type - type of node
 */

function getNodesByType(node, type) {
    return node.body && node.body.body.filter(node => node.type === type);
}

function filterUserDefinedVariables(variables) {
    return variables.filter(v => v.defs.length !== 0);
}

function getReferredGlobalVariables(globalVariables, node, context) {
    return globalVariables.filter(v => v.references.find(({
        from
    }) => from === context.getScope(node)) !== undefined)
}

module.exports = {
    meta: {
        docs: {
            description: "disallow referring global scope variables",
            category: "Side Effects"
        },
        schema: [] // no options
    },
    create: function (context) {
        return {
            FunctionDeclaration: node => {
                const localVariables = context.getScope(node).variables;
                const globalVariables = filterUserDefinedVariables(context.getScope(node).upper.variables);
                const referredGlobals = getReferredGlobalVariables(globalVariables, node, context)
                if (referredGlobals.length !== 0)
                    context.report({
                        message: 'References of global variables found: {{ globals }}',
                        node,
                        data: {
                            globals: referredGlobals.map(x => x.name)
                        }
                    });
            }
        };
    }
};