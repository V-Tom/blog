---
title: "learn Data Structure"
tags: ["DataStructure"]
description: "Data Structure"
date: 2018-05-23T12:33:21+08:00
---

### List

##### list 定义

- 是**n(n≥0)个相同类型**的**数据元素**构成的**有限**序列。

##### list ADT

```adt
ADT List
{
    Data:
    Operation:
        InitList(&L)
        CreateList(&L)
        ListEmpty(L)
        ListLength(L)
        LocateElem(L,e)
        PriorElem(L,cur_e,&pre_e)
        NextElem(L,cur_e,&pre_e) 
        ListInsert(&L,i,e)
        ListDelete(&L,i,&e)
        GetElem(L,i,&e)
        ListTraverse(L)
        DestroyList(&L)
    }//ADT List
```

##### list 简单实现

```javascript
/**
 * List Structure
 */

class List {

  /**
   * 顺序表初始化操作，申请使用内存
   * @constructor
   */
  InitList() {
    this.list = []
  }

  /**
   * 判断顺序表是否为空
   * @returns {boolean}
   * @constructor
   */
  ListEmpty() {

    return this.list.length === 0
  }

  /**
   * 顺序表求表长操作
   * @returns {number}
   * @constructor
   */
  ListLength() {

    return this.list.length
  }

  /**
   * 顺序表定位元素(返回与e值相等的元素下标)
   * @param item
   * @returns {*}
   * @constructor
   */
  LocateElem(item) {
    return this.list.indexOf(item)
  }

  /**
   * 获取指定元素的上一个元素
   * @param item
   * @returns {*}
   * @constructor
   */
  PriorElem(item) {

    const indexOf = this.list.indexOf(item)

    if (indexOf <= 0) {
      return null
    } else {
      return this.list[indexOf - 1]
    }

  }

  /**
   * 获取指定元素的下一个元素
   * @param item
   * @returns {*}
   * @constructor
   */
  NextElem(item) {

    const indexOf = this.list.indexOf(item)

    if (indexOf >= this.list.length - 1) {
      return null
    } else {
      return this.list[indexOf + 1]
    }

  }

  /**
   * 在顺序表L的第i个元素之前插入新的元素e
   * @param i
   * @param elem
   * @returns {boolean}
   * @constructor
   */
  ListInsertBefore(i, elem) {

    if (i <= 0) {
      return false
    }

    this.list.splice(i - 1, 0, elem)

    return true

  }

  /**
   * 在顺序表L的第i个元素之后插入新的元素e
   * @param i
   * @param elem
   * @returns {boolean}
   * @constructor
   */
  ListInsertAfter(i, elem) {
    if (i <= 0) {
      return false
    }

    this.list.splice(i, 0, elem)

    return true
  }

  /**
   * 在顺序表L的最后一个元素之后插入新的元素e
   * @param elem
   * @returns {boolean}
   * @constructor
   */
  ListInsertBottom(elem) {
    this.list.push(elem)

    return true
  }

  /**
   * 在递增有序顺序表L中查找插入新的元素e
   * 暂时只支持 []int 类型的 list
   * @param elem
   * @returns {boolean}
   * @constructor
   */
  ListInsertByOrder(elem) {
    if (typeof elem !== "number") {
      return false
    }

    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i] <= elem && this.list[i + 1] >= elem) {
        this.ListInsertBefore(i, elem)
        return true
      }
    }

    return false
  }

  /**
   * 在顺序表L中删除第i个元素，并返回其值
   * @param i
   * @returns {*}
   * @constructor
   */
  ListDelete(i) {

    if (i <= 0) return false

    if (!this.list[i]) return false

    return this.list.splice(i - 1, 1)[0]

  }

  /**
   * 取出顺序表L中第i个元素，并返回其值
   * @param i
   * @returns {*}
   * @constructor
   */
  GetElem(i) {

    return this.list[i]
  }

  /**
   * 顺序表遍历输出各元素
   * @constructor
   */
  ListTraverse() {
    this.list.forEach(item => console.log(item))
  }

  /**
   * 删除顺序表
   * @constructor
   */
  DestroyList() {
    this.list = null
  }
}
```

#### 链表

TBD

### Stack

##### stack 定义：

- 是一种特殊的线性表，这种表只能在固定的一端进行插入与删除操作
- 固定插入的一端叫**栈顶(top)**，而另一端称为**栈底(bottom)**。位于栈顶和栈底的元素分别称为**顶元**和**底元**。当表中无元素时，称为空栈
- 栈的修改是按照**后进先出**的原则进行（简称 LIFO）

##### stack ADT

```adt
ADT List
{
    Data:
    Operation:
        InitStack(&S,maxsize,incresize)
        ClearStack(&S)
        StackLength(S)
        Push(&S,e)
        Pop(&S,&e)
        GetTop(S,&e)
        StackTraverse(S)
        StackEmpty(S)
        DestroyStack(&S)
    }//ADT List
```

##### stack 简单实现

```go
package Stack

import (
	"fmt"
)

type Stack struct {
	Stack []int
}

func (S *Stack) InitStack() []int {
	S.Stack = []int{}
	return S.Stack
}

func (S *Stack) StackLength() int {
	return len(S.Stack)
}

func (S *Stack) Push(elem int) {
	S.Stack = append(S.Stack, elem)
}

func (S *Stack) Pop() int {

	len := len(S.Stack) - 1

	elem := S.Stack[len]

	S.Stack = S.Stack[:len]

	return elem
}

func (S *Stack) GetTop() int {
	return S.Stack[len(S.Stack)-1]
}

func (S *Stack) StackEmpty() bool {

	return len(S.Stack) <= 0
}

func (S *Stack) StackTraverse() {
	for _, elem := range S.Stack {
		fmt.Println(elem)
	}
}

func (S *Stack) DestroyStack() {
	S.Stack = []int{}
}
```

##### 数制转换问题

```go
package main

import (
	"DataStructure/Stack"
	"strconv"
)

/**
	简单版本的 十进制转任意进制
 */
func Conversion(input int, radix int) string {

	result := ""

	if input <= 0 || radix <= 0 {
		return result
	}

	S := Stack.Stack{}

	S.InitStack()

	for {

		if input <= 0 {
			break
		}

		S.Push(input % radix)

		input = input / radix

	}

	for {

		if S.StackEmpty() {
			break
		}

		result += strconv.Itoa(S.Pop())
	}

	return result

}
```

##### Valid Parentheses

本题参考自 [leet code](https://leetcode.com/problems/valid-parentheses)，可以通过 栈 的特性完成

```javascript
const isValid = function (s) {

    const stack = []

    const map = {
        "(": -1,
        ")": 1,
        "[": -2,
        "]": 2,
        "{": -3,
        "}": 3
    }

    for (let i = 0; i < s.length; i++) {
        const current = map[s[i]]
        if (current <= 0) {
            stack.push(current)
        } else {
            const last = stack.pop()
            if (last + current !== 0) return false
        }
    }

    return !stack.length > 0
};
```