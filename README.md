# REP.js

This is an extension for generation of code using js code.

## Features

You can just write the code that will generate other code and call Eval and Print command of this extension and it will insder generated code right after the code of generator.

Example:

Write this code in your text editor

```javascript
for (let i = 0; i < 10; i++) {
    writeline(i)
}
```

Select all these lines

Run "Eval and Print" command

Result:
```javascript
for (let i = 0; i < 10; i++) {
    writeline(i)
}
0
1
2
3
4
5
6
7
8
9
```

## Globals

You have to functions: `write` and `writeline`.
`write` will transform it's parameters to string and pushes them
`writeline` will do the same as `write` but will insert new line character after it's output.

You also can use `console.log` and `console.warn` and `console.error` - it will be rendered as multiline comments.
