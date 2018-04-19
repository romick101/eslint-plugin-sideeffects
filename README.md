# eslint-plugin-sideeffects

todo later

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-sideeffects`:

```
$ npm install eslint-plugin-sideeffects --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-sideeffects` globally.

## Usage

Add `sideeffects` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "sideeffects"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "sideeffects/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





