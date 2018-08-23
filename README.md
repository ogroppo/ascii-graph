# Ascii Tree

Plot a tree graph with ascii characters.

```js
var jsonGraph = require('./fixtures/nested');
var asciiTree = require('ascii-tree');

let tree = asciiTree(jsonGraph);

console.log(tree)
```


Feel free to copy and paste the output but remember that monospaces fonts must be used!

```
                                                ╭› ziooo
                                  ╭has─› ssdfsc ┤
          paren [p] ╮             │             ╰› naltro
s [!] ╮             │             │                       ╭› ciic
    c ┼› dd [ladro] ┼› the roeots ┼› figlioccio ─› pastoo ┤
    x ╯             │             │                       ╰› ytf
      serpe [x] ─had╯             ╰was─› pane

```
