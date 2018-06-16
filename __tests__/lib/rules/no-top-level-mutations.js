'use strict';

const rule = require('../../../lib/rules/no-top-level-mutations'),
  RuleTester = require('eslint').RuleTester;

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6
  }
});
const ruleTester = new RuleTester();

ruleTester.run('no-top-level-mutations', rule, {
  valid: [{
    code: `
          //   function foo() {
          //   var localVariable = {
          //     key: 'DefaultValue'};
          //   localVariable.key = 'AlteredValue';
          //   if (true) {
          //     let ScopedVariable = [1, 2, 3];
          //     ScopedVariable.push(4);
          //   }
          //   const closure = {key: 'EnclosedValue'};
          //   const bar = () => 
          //     Object.assign(closure, {
          //       key: 'AlteredEnclosedValue'});
          // }
          `
  }],
  invalid: [{
    code: `
          const explicitGlobal = {
            key: 'DefaultValue'
          };
          if (true) {
            implicitGlobal = [1, 2, 3];
          }
          function foo() {
            // Object.assign(explicitGlobal, {
            //   key: 'AlteredValue'});
            implicitGlobal.sort();
           // process.env.HEAP_SIZE = null;
          }
          `,
    errors: [{
      message: 'Mutating global variable explicitGlobal'
    }, {
      message: 'Mutating global variable implicitGlobal'
    }, {
      message: 'Mutating global variable process'
    }]
  }]
});