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
    code: `     function foo() {
                var localVariable = {
                  key: 'DefaultValue'
                };
                localVariable.key = 'AlteredValue';
                if (true) {
                  let ScopedVariable = [1, 2, 3];
                  ScopedVariable.push(4);
                }
                const closure = {
                  key: 'EnclosedValue'
                };
                const bar = () =>
                  Object.assign(closure, {
                    key: 'AlteredEnclosedValue'
                  });
                const response = JSON.stringify(bar());
              }
              class Class extends AnotherClass {
                former ([{response}]) {
                 response.res = JSON.stringify(response.Usage);
                }
              }
              module.exports = Class;
            `
  }],
  invalid: [{
    code: `
          const when = require('when');
          const explicitGlobal = {
            key: 'DefaultValue'
          };
          if (true) {
            implicitGlobal = [1, 2, 3];
          }
          function foo() {
            Object.assign(explicitGlobal, {
              key: 'AlteredValue'
            });
            implicitGlobal.sort();
            process.env.HEAP_SIZE = null;
            console.log = jest.fn();
            console = {
              log: jest.fn()
            };
          }
          class C {
            method() {
              implicitGlobal.push(5);
            }
          }
          module.exports = C;
          `,
    errors: [{
      message: 'Assigning global variable implicitGlobal'
    }, {
      message: 'Object.assign mutating global variable explicitGlobal'
    }, {
      message: 'Method sort mutating global variable implicitGlobal'
    }, {
      message: 'Assigning property to global variable process'
    }, {
      message: 'Assigning property to global variable console'
    }, {
      message: 'Assigning global variable console'
    }, {
      message: 'Method push mutating global variable implicitGlobal'
    }]
  }]
});