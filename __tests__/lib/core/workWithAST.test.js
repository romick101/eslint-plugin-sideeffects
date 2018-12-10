describe('workWithAST module unit tests', () => {
    let workWithAST;
    beforeAll(() => 
        workWithAST = require('../../../lib/core/workWithAST')
    )
    it('predicates return correct results', () => {
        const {
            isIdentifier, 
            isArrowToken,
            isES5Constructor
        } = workWithAST
        expect(isIdentifier({type: 'Identifier', name: 'name1'}, 'name1')).toEqual(true)
        expect(isIdentifier({type: 'Identifier', name: 'name1'}, 'name2')).toEqual(false)
        expect(isIdentifier({type: 'NotIdentifier', name: 'name1'}, 'name1')).toEqual(false)
    
        expect(isArrowToken({type: 'Punctuator', value: '=>'})).toEqual(true)
        expect(isArrowToken({type: 'Punctuator', value: '->'})).toEqual(false)
        expect(isArrowToken({type: 'NotPunctuator', value: '=>'})).toEqual(false)
   
        expect(isES5Constructor({id: {name: ['Abc']}})).toEqual(true)
        expect(isES5Constructor({id: {name: ['abc']}})).toEqual(false)
        expect(isES5Constructor({id: {name: []}})).toEqual(false)
        expect(isES5Constructor({id: {}})).toEqual(false)
        expect(isES5Constructor({})).toEqual(false)
    })
})