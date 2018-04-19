const espree = require('espree');
const fs = require('fs');

class Ast {
    constructor(sourcePath) {
        this._sourcePath = sourcePath;
        this._tree === null;
    }
    get tree() {
        return this._tree;
    }
    buildTree() {
        return new Promise((resolve, reject) =>
            fs.readFile(this._sourcePath, (err, data) => {
                if (err !== null) reject(err);
                else resolve(data);
            })
        ).then(code => {
            return new Promise((resolve, reject) => {
                const ast = espree.parse(code.toString(), {
                    ecmaVersion: 6
                });
                this._tree = ast;
                resolve(ast);
            })
        })
    }

}

module.exports = Ast;