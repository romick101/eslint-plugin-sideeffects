"use strict";
/**
 * no-outter-scope-references
 * existing similar rules: 
 * block-scoped-var, no-shadow
 */

var baz0;
let baz1;
const baz2 = 6;

function foo0() {
    baz0;
    const foo01 = () => {
        baz1;
        const foo02 = function () {
            baz2;
        }
    };
}

/**
 * no-arg-mutations
 * existing similar rules: 
 * no-param-reassign
 */
function foo1(arg) {
    arg.push(1); // and other mutating methods from Array and Object protos
    Object.assign(arg.field, 12);
    Object.assign(arg, 12);
    Object.defineProperty(arg, key);

}

/**
 * function-body-return
 * existing similar rules: 
 * array-callback-return
 * must-return from eslint-plugin-fp
 */

function foo2() {
  //  expr1;
  //  expr2;
}

console.log(foo2());