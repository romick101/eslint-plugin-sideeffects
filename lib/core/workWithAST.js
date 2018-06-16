module.exports = {
    isIdentifier: (node, name) => node.type === "Identifier" && node.name === name,
    isArrowToken: token => token.value === "=>" && token.type === "Punctuator",
    isES5Constructor: node => node.id && node.id.name[0] !== node.id.name[0].toLocaleLowerCase(),
    getStaticPropertyName: node => {
        let prop;
        switch (node && node.type) {
            case "Property":
            case "MethodDefinition":
                prop = node.key;
                break;
            case "MemberExpression":
                prop = node.property;
                break;
        }

        switch (prop && prop.type) {
            case "Literal":
                return String(prop.value);
            case "TemplateLiteral":
                if (prop.expressions.length === 0 && prop.quasis.length === 1) {
                    return prop.quasis[0].value.cooked;
                }
                break;
            case "Identifier":
                if (!node.computed) {
                    return prop.name;
                }
                break;
        }

        return null;
    },
    getFunctionName: node => {
        const parent = node.parent;
        const tokens = [];
        if (parent.type === "MethodDefinition" && parent.static) {
            tokens.push("static");
        }
        if (node.async) {
            tokens.push("async");
        }
        if (node.generator) {
            tokens.push("generator");
        }
        if (node.type === "ArrowFunctionExpression") {
            tokens.push("arrow", "function");
        } else if (parent.type === "Property" || parent.type === "MethodDefinition") {
            if (parent.kind === "constructor") {
                return "constructor";
            }
            if (parent.kind === "get") {
                tokens.push("getter");
            } else if (parent.kind === "set") {
                tokens.push("setter");
            } else {
                tokens.push("method");
            }
        } else {
            tokens.push("function");
        }
        if (node.id) {
            tokens.push(`'${node.id.name}'`);
        } else {
            const name = module.exports.getStaticPropertyName(parent);

            if (name) {
                tokens.push(`'${name}'`);
            }
        }
        return tokens.join(" ");
    },
    processASTNode: (node) => {},
    getAllChildren: (node, predicate) => {},
    getArgMutations: (argList, context) => {},
    findClosestParent: (node, predicate) => {},
}