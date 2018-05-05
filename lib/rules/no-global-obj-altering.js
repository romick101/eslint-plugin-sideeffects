/**
 * @fileoverview Rule to disallow altering objects from outter scope
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow altering global scope objcts",
            category: "Side Effects"
        },
        schema: [] // no options
    },
    create: function (context) {
        const statementList = [];
        return {
            Statement: node => {
                console.log(node);
                debugger;
                statementList.push(node);
            },
            VariableDeclaration: node => {
                if (node.declarations[0] &&
                    node.declarations[0].init.type === "ArrowFunctionExpression" &&
                    node.declarations[0].id.name.includes('impure'))
                    context.report({
                        message: 'Impure function found: {{ name }}',
                        node,
                        data: {
                            name: node.declarations[0].id.name
                        }
                    });
            },
            FunctionDeclaration: node => {
                if (node.id.name.includes('impure'))
                    context.report({
                        message: 'Impure function found: {{ name }}',
                        node,
                        data: {
                            name: node.id.name
                        }
                    });
            }
        };
    }
};