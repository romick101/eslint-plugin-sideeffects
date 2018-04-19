const chalk = require('chalk');

const someGlobalVariable = [1, 2, 3];

function pureFunction(arg) {
    const localEmptyObject = Object.create(null);
    return Object.assign(localEmptyObject, {
        value: arg
    });
}

const pureArrowFunction = arg => Object.assign(Object.create(null), {
    value: arg
});

function impureFunction() {
    console.log(chalk.yellow('I have side-effects'));
    someGlobalVariable.push(4);
}

const impureArrowFunction = () => {
    console.log(chalk.yellow('I have side-effects'));
    someGlobalVariable.push(5);
}

module.exports = {
    pureFunction,
    pureArrowFunction,
    impureFunction,
    impureArrowFunction
}