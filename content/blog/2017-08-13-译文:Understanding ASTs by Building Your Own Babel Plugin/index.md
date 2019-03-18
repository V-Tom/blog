---
title: "译文:Understanding ASTs by Building Your Own Babel Plugin"
subTitle: "译文:Understanding ASTs by Building Your Own Babel Plugin"
summary: "译文:Understanding ASTs by Building Your Own Babel Plugin"
banner: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=="
tags: ["FrontEnd","AST","Babel"]
date: 2017-08-13T15:29:40+08:00
host: "https://github.com/V-Tom/blog/blob/hugo/content/blog/2017-08-13-%E8%AF%91%E6%96%87%3AUnderstanding%20ASTs%20by%20Building%20Your%20Own%20Babel%20Plugin/index.md"
---

[原文地址](https://www.sitepoint.com/understanding-asts-building-babel-plugin/)

### Language Overview

> We want to design a plugin that will allow us to use regular object and array literals, which will be transformed into persistent data structures using [Mori](https://www.sitepoint.com/immutable-data-functional-javascript-mori/)

我们想要设计一个插件：它将允许我们通过使用常规对象和数值文本，可以使用[Mori](https://www.sitepoint.com/immutable-data-functional-javascript-mori/)转化为持久性的数据结构。

> We want to write code like this:

我们要写这样的代码：

```
var foo = { a: 1 };
var baz = foo.a = 2;
foo.a === 1;
baz.a === 2;
```

> And transform it into code like this:

然后把它转化成这样的代码：

```
var foo = mori.hashMap('a', 1);
var baz = mori.assoc(foo, 'a', 2);
mori.get(foo, 'a') === 1;
mori.get(baz, 'a') === 2;
```

> Let’s get started with `MoriScript`!

让我们开始使用 `MoriScript`。

### Babel Overview

> if we look beneath the surface of `Babel`, we’ll find three important tools that handle the majority of the process.

如果我们来看看 `Babel` 的表面，我们会发现这里有3个重要的工具来处理大部分的流程：

![babel overview](https://oga6csqie.qnssl.com/MTQ1OTk0OTgwOGJhYmVsLnBuZz90eXBlPWltYWdlL3BuZyZ0aW1lPTE0ODc2MDEwMDcwNDcmc2l6ZT0zMDAxMQ==)

#### Parse
> [Babylon](https://github.com/babel/babylon) is the parser and it understands how to take a string of JavaScript code and turn it into a computer friendly representation called an Abstract Syntax Tree (AST).

[Babylon](https://github.com/babel/babylon)是解析器，它知道如何提取一串JavaScript代码，并将其转换为计算机友好的表示方式，称为抽象语法树（AST）。

#### Transform
> The [babel-traverse](https://www.npmjs.com/package/babel-traverse) module allows you to explore, analyse and potentially modify the AST.

[babel-traverse](https://www.npmjs.com/package/babel-traverse) 模块允许你探索、分析、潜在修改 AST。

#### Generate
> Finally, the [babel-generator](https://www.npmjs.com/package/babel-generator) module is used to turn the transformed AST back into regular code.

最后，通过[babel-generator](https://www.npmjs.com/package/babel-generator) 模块被用来将转换后的 AST 恢复成正常的代码。

### What is an AST?

> It’s fundamental that we understand the purpose of an AST before continuing with this tutorial. So let’s dive in to see what they are and why we need them.

在继续本教程之前，我们了解 [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree)是非常重要的事情。 所以让我们来看看它们是什么以及为什么我们需要它们。

> JavaScript programs are generally made up of a sequence of characters, each with some visual meaning for our human brains. This works really well for us, as it allows us to use matching characters ([], {}, ()), pairs of characters ('', "") and indentation to make our programs easier for us to interpret.

JavaScript程序通常由一系列字符组成，每个字符对我们的人类大脑来说都有一些视觉意义。 这对我们真的非常有用，因为它允许我们使用匹配的字符（[]，{}，（）），字符对（''，“”）和缩进，使我们的程序对我们来说更容易解释、抽象。

> However, this isn’t very helpful for computers. For them, each of these characters is just a numeric value in memory and they can’t use them to ask high level questions like “How many variables are there in this declaration?”. Instead we need to compromise and find a way to turn our code into something that we can program and computers can understand.

但是，这对计算机来说不是很有帮助。 对于它们，这些字符中的每一个只是内存中的一个数字值，他们不能使用它们来问高级问题，例如 “这个声明中有多少个变量”？ 相反，我们需要妥协，并找到一种方式将我们的代码转换成我们可以编程并且计算机可以理解的东西。

> Have a look at the following code.

看看下面的代码

```javascript
var a = 3;
a + 5
```

> When we generate an AST for this program, we end up with a structure that looks like this:

当我们为这个程序生成一个 AST 的时候，我们最终得到一个如下所示的结构:

![AST for example code](https://oga6csqie.qnssl.com/MTQ1OTkzNDM3MGFzdC5wbmc/dHlwZT1pbWFnZS9wbmcmdGltZT0xNDg3NjAwOTAwOTE1JnNpemU9NTA2NzI=)

> All ASTs start with a Program node at the root of the tree, which contains all of the top level statements in our program. In this case, we only have two:

所有的 AST 程序都从树结构的根节点开始，它包含我们程序中所有的顶层语句，在这种情况下，我们只有2个：


> A VariableDeclaration with one VariableDeclarator that assigns the Identifier "a" to the NumericLiteral "3".

一个包含变量声明的变量声明符，将标识符'a'分配给数字字面量 '3'。

> An ExpressionStatement which is in turn is made up of a BinaryExpression, which is described as an Identifier "a", an operator "+" and another NumericLiteral "5".

一个表达式语句由二进制表达式组成，在这里被描述为一个标识符“a”、运算符“+”以及另一个数字字面量“5”。

> Despite the fact that they are made up of simple building blocks, the size of ASTs means they are often quite complex, especially for nontrivial programs. Rather than trying to figure out ASTs ourselves, we can use [astexplorer.net](https://astexplorer.net/), which allows us to input JavaScript on the left, then outputs an explorable representation of the AST on the right. We’ll use this tool exclusively to understand and experiment with code as we continue.

事实上它们尽管由一些简单的组件组成，AST的大小意味着它们往往相当复杂，特别是对于非平凡的程序，我们可以使用[astexplorer.net](https://astexplorer.net/)，它允许我们在左边输入JavaScript，然后在右边输出一个可探索的AST视图，而不是试图我们自己来找出AST。 我们将继续使用此工具专门用于理解和实验代码。

> To stay consistent with `Babel`, make sure you choose `babylon6` as a parser.

为了和 `Babel` 转换保持一致，确保你选择了 `babylon6` 作为解析器。


> When writing a `Babel` plugin, it’s our job to take an AST then insert/move/replace/delete some nodes to create a new AST which can be used to generate code.

当开始去写一个 `Babel` 插件的时候,我们的工作便是：提取一个AST，然后插入/移动/替换/删除一些节点创建一个新的AST，这些可用于生成代码。

### Setup

> Make sure you have `Node` and `Npm` installed before you start. Then create a folder for the project, create a `package.json` file and install the following dev dependencies.

在你开始前确认你已经装过 `Node` 和 `Npm`，然后为项目创建一个文件目录、创建 `package.json`文件，然后安装下面的一些开发依赖。


```javascript
mkdir moriscript && cd moriscript
npm init -y
npm install --save-dev babel-core
```

> Then we’ll create a file for our plugin and inside we’ll export a default function.

接下来我们要为我们的插件创建一个文件，然后内部我们将会导出一个默认函数。


```javascript
// moriscript.js
module.exports = function(babel) {
  var t = babel.types;
  return {
    visitor: {

    }
  };
};
```

> This function exposes an interface for the visitor pattern, which we’ll come back to later.

此函数为访问者模式提供了一个接口，稍后我们将返回这里。


> Finally we’ll create an runner that we can use to test our plugin as we go.

最后，我们将创建一个运行器以便我们可以用它来测试我们的插件。

```javascript
// run.js
var fs = require('fs');
var babel = require('babel-core');
var moriscript = require('./moriscript');

// read the filename from the command line arguments
var fileName = process.argv[2];

// read the code from this file
fs.readFile(fileName, function(err, data) {
  if(err) throw err;

  // convert from a buffer to a string
  var src = data.toString();

  // use our plugin to transform the source
  var out = babel.transform(src, {
    plugins: [moriscript]
  });

  // print the generated code to screen
  console.log(out.code);
});

```

> We can call this script with the name of an example `MoriScript` file to check that it generates the JavaScript we are expecting. For example, `node run.js example.js`

我们可以使用一个示例 `MoriScript` 文件的名称来调用此脚本，以检查它是否生成我们期望的JavaScript，例如：`node run.js example.js`

### Arrays

> The first and foremost goal for `MoriScript` is to convert `Object` and `Array` literals into their Mori counterparts:`HashMaps` and`Vectors`. We’ll tackle arrays first, as they’re slightly simpler.

`MoriScript`的首要目标是将`Object`和`Array`字面量转换为Mori对应函数：`HashMaps`和`Vectors`。 我们将首先处理数组，因为它们稍微简单一些。

```javascript
var bar = [1, 2, 3];
// should become
var bar = mori.vector(1, 2, 3);
```

> Paste the code from above into [astexplorer](https://astexplorer.net/) and highlight the array literal [1, 2, 3] to see the corresponding AST nodes.

将上面的代码粘贴到[astexplorer](https://astexplorer.net/)中并突出显示数组文本[1，2，3]以查看对应的AST节点。

> For the sake of readability, we’ll omit the metadata fields that we don’t need to worry about.

为了便于阅读，我们将省略我们不需要关心的元数据字段内容。

```javascript
{
  "type": "ArrayExpression",
  "elements": [
    {
      "type": "NumericLiteral",
      "value": 1
    },
    {
      "type": "NumericLiteral",
      "value": 2
    },
    {
      "type": "NumericLiteral",
      "value": 3
    }
  ]
}
```

> Now let’s do the same with the call to `mori.vector(1, 2, 3)`.

现在让我们对调用`mori.vector（1，2，3）`做同样的事情。

```javascript
{
  "type": "CallExpression",
  "callee": {
    "type": "MemberExpression",
    "object": {
      "type": "Identifier",
      "name": "mori"
    },
    "property": {
      "type": "Identifier",
      "name": "vector"
    }
  },
  "arguments": [
    {
      "type": "NumericLiteral",
      "value": 1
    },
    {
      "type": "NumericLiteral",
      "value": 2
    },
    {
      "type": "NumericLiteral",
      "value": 3
    }
  ]
}
```

> If we express this visually, we’ll get a better sense of what needs to change between the two trees.

如果我们通过可视图进行表达，我们将可以更好地了解需要在两棵树之间改变什么。

![visually diff](https://oga6csqie.qnssl.com/MTQ1OTk0NzUzOGFycmF5LnBuZz90eXBlPWltYWdlL3BuZyZ0aW1lPTE0ODc2MDA4NDE1MDEmc2l6ZT02MjMwMQ==)

