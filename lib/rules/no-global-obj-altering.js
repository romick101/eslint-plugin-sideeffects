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
        return {
            'FunctionDeclaration > body': node => {
                return node.type;
            }
            // callback functions
        };
    }
};