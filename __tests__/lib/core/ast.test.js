describe('ast module unit tests', () => {
    let Ast;
    beforeAll(() => {
        Ast = require('../../../lib/core/ast');
    });
    it('correct AST is returned for simpleModule', () => {
        const ast = new Ast('__test_src__/simpleModule.js')
        return ast.buildTree()
            .then(tree => {
                expect(tree).toBeInstanceOf(Object);
                expect(tree.type).toEqual('Program');
                expect(tree.end).toEqual(627);
                expect(tree.body.length).toEqual(7);
                expect(tree.body.filter(node => node.type === 'VariableDeclaration').length).toEqual(4);
                expect(tree.body.filter(node => node.type === 'FunctionDeclaration').length).toEqual(2);
                expect(tree.body.filter(node => node.type === 'ExpressionStatement').length).toEqual(1);
            })
    })
})