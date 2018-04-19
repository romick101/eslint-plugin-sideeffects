describe('ast module unit tests', () => {
    let Ast;
    beforeEach(() => {
        Ast = require('../../../lib/core/ast');
    });
    it('correct AST is returned for simpleModule', () => {
        const ast = new Ast('__test_src__/simpleModule.js')
        return ast.buildTree()
            .then(tree => {
                expect(tree).toBeInstanceOf(Object);
            })
    })
})