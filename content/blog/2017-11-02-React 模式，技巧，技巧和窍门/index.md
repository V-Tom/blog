---
title: "React 模式，技巧，技巧和窍门"
subTitle: "React 模式，技巧，技巧和窍门"
banner: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=="
tags: ["React","FrontEnd"]
date: 2017-11-02T15:29:40+08:00
host: "https://github.com/V-Tom/blog/blob/hugo/content/blog/2017-11-02-React%20%E6%A8%A1%E5%BC%8F%EF%BC%8C%E6%8A%80%E5%B7%A7%EF%BC%8C%E6%8A%80%E5%B7%A7%E5%92%8C%E7%AA%8D%E9%97%A8/index.md"
---

这篇文章整理了学习 `React` 过程中以及实际开发应用当中一些模式，技巧，技巧和窍门。

大部门内容是基于 `React` 框架下面产生的一些内容，有很大的局限性，但是确实带来了新的理念和开发方式，仁者见仁智者见智，多学习一点内容总归对职业生涯有好处。

> 本篇文章还在持续更新中，如果有错误烦请指正。

### Normally React

一些常见的关于React需要了解的内容，就简单列举如下。下面只会列到本人认为比较值得重视的部分进行详细陈述。

> 语法层面——基础入门

- JSX语法、React基本内容等
- Derocator 或者 async await 等常见ES6、ES7的内容
- React Lists and Keys

> 常用层面——日常开发必备

- `smart component and dumb component`
- `container component and presentation component`
- `stateless component`
- Events handler bind this：bind this 或者 Derocator 或者 [proposal-class-public-fields-declarations](https://github.com/tc39/proposal-class-fields)
- `Conditionals render in JSX` 或者 `IIFE render in JSX` 或者 `methods render in JSX`
- `Dynamic router` 以及 `Dynamic component`，甚至于 `Dynamic redux injection`
- `HOC`
- [Render props](https://reactjs.org/docs/render-props.html)
- [16.6版本中添加 Lazy, Suspense, memo](https://reactjs.org/docs/code-splitting.html)
- [17版本中添加 hooks](https://reactjs.org/docs/hooks-intro.html)

> 进阶层面——性能优化和业务解耦必备

- `PureRenderMixin` 以及 `Pure Component` 以及 `shouldComponentUpdate check`
- `unstable_rendersubtreeintocontainer` 以及 portal
- React `fiber` 更新机制
- `React call return`

> 一些周边拓展（含有本人观念

- styled components
- Redux saga
- Recompose

> 最后强烈建议推荐这个：[List of top 301 ReactJS Interview Questions & Answers](https://github.com/semlinker/reactjs-interview-questions)

### Pure Render Checks

```Jsx
// 坏的例子
class Table extends PureComponent {
  
  update(e) {
    this.props.update(e.target.value);
  }
  
  render() {
    return (
      <div>
        {this.props.items.map(i =>
          <Cell 
            data={i} 
            options={this.props.options || []}
            onChange={this.update.bind(this)}
            onClick={e => this.props.update(e.target.value)}/>;
           />
        )}
      </div>
    );
  }
}

```

这种写法的问题在于`{this.props.options || []}` 这种写法会导致所有的Cell都被重新渲染即使只有一个cell发生改变。

原因是：每次传入的`[]`都相当于创建了新的Array实例。在JavaScript里面，不同的实例是有不同的实体的，所以浅比较在这种情况下总是会返回false，然后组件就会被重新渲染。

对于`onChange`，`onClick`也是一样的问题，也会导致重新渲染。

```jsx
// 好的例子
const defaultval = [];  // <---  也可以使用defaultProps
class Table extends PureComponent {
  
  update(e) {
    this.props.update(e.target.value);
  }
  
  render() {
    return (
      <div>
        {this.props.items.map(i =>
          <Cell 
            data={i} 
            options={this.props.options || defaultval}
            onChange={this.update}
            onClick={this.update}
          />
        )}
      </div>
    );
  }
}
```

总结就是： **props上的任何prop值尽量只创建一次, 只绑定一次**

Reference:

- <https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f>
- <https://github.com/nfour/js-structures/blob/master/guides/react-anti-patterns.md#pure-render-immutability>
- [Optimizing React Rendering](https://flexport.engineering/optimizing-react-rendering-part-1-9634469dca02)

### Synthetic events in React

React 在处理事件(event时), 事实上使用了 `SyntheticEvent` 对象包裹了原生的 event 对象.

这些React自己维护的对象是相互联系的, 意味着如果对于某一个事件, 我们给出了对应的响应函数(handler), 其他的 `SyntheticEvent` 对象也是可以重用的.这也是React提升性能的秘诀之一. 但是这也意味着, 如果想要通过异步的方式访问事件对象是不可能的, 因为出于reuse的原因, 事件对象里面的值都被重置了.

下面这段代码会在控制台里面打出 null, 因为事件在 `SyntheticEvent` 池中被重用了.

```Jsx
function handleClick(event) {
  setTimeout(function () {
    console.log(event.target.name);
  }, 1000);
}
```

为了避免这种情况, 你需要去保存你关心的事件的属性.

```Jsx
function handleClick(event) {
  let name = event.target.name;
  setTimeout(function () {
    console.log(name);
  }, 1000);
}
```

Reference:

- [React/Redux: Best practices & gotchas](https://medium.com/nick-parsons/react-redux-best-practices-gotchas-56cf61c1c415)
- [React events in depth w/ Kent C. Dodds, Ben Alpert, & Dan Abramov](https://www.youtube.com/watch?v=dRo_egw7tBc)



### async-nature-of-setState

在某些情况下，React框架出于性能优化考虑，可能会将多次 state 更新合并成一次更新。正因为如此，setState 实际上是一个异步的函数。 但是，有一些行为也会阻止React框架本身对于多次 state 更新的合并，从而让 state 的更新变得同步化。 比如: eventListeners, Ajax, setTimeout 等等。

##### 详解

当setState() 函数执行的时候，函数会创建一个暂态的 state 作为过渡 state，而不是立即修改 `this.state`。 如果在调用 setState() 函数之后尝试去访问 this.state，你得到的可能还是 setState() 函数执行之前的结果。 在使用 setState() 的情况下，看起来同步执行的代码其实执行顺序是得不到保证的。原因上面也提到过，React可能会将多次state更新合并成一次更新来优化性能。

运行下面这段代码，你会发现当和 `addEventListener` , `setTimeout` 函数或者发出 AJAX call 的时候，调用 setState , state 会发生改变。并且 render 函数会在 setState() 函数被触发之后马上被调用。那么到底发生了什么呢？事实上，类似  setTimeout() 函数或者发出 ajax call 的 fetch 函数属于调用浏览器层面的API，这些函数的执行并不存在与 React 的上下文中，所以 React 并不能够像控制其他存在与其上下文中的函数一样，将多次 state 更新合并成一次。

在上面这些例子中，React 框架之所以在选择在调用 setState 函数之后立即更新state而不是采用框架默认的方式，即合并多次 state 更新为一次更新，是因为这些函数调用(fetch,setTimeout等浏览器层面的API调用)并不处于 React 框架的上下文中，React 没有办法对其进行控制。React 在此时采用的策略就是及时更新，确保在这些函数执行之后的其他代码能拿到正确的数据（即更新过的state)。

```Jsx
class TestComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dollars: 10
    }
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
    this.onTimeoutHandler = this.onTimeoutHandler.bind(this);
    this.onAjaxCallback = this.onAjaxCallback.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  componentDidMount() {
    // Add custom event via `addEventListener`
    //
    // The list of supported React events does include `mouseleave`
    // via `onMouseLeave` prop
    //
    // However, we are not adding the event the `React way` - this will have
    // effects on how state mutates
    //
    // Check the list here - https://facebook.github.io/react/docs/events.html
    document.getElementById('testButton').addEventListener('mouseleave', this.onMouseLeaveHandler);

    // Add JS timeout
    //
    // Again,outside React `world` - this will also have effects on how state
    // mutates
    setTimeout(this.onTimeoutHandler, 10000);

    // Make AJAX request
    fetch('https://api.github.com/users')
      .then(this.onAjaxCallback);
  }

  onClickHandler = () => {
    console.log('State before (_onClickHandler): ' + JSON.stringify(this.state));
    this.setState({
      dollars: this.state.dollars + 10
    });
    console.log('State after (_onClickHandler): ' + JSON.stringify(this.state));
  }

  onMouseLeaveHandler = () => {
    console.log('State before (mouseleave): ' + JSON.stringify(this.state));
    this.setState({
      dollars: this.state.dollars + 20
    });
    console.log('State after (mouseleave): ' + JSON.stringify(this.state));
  }

  onTimeoutHandler = () => {
    console.log('State before (timeout): ' + JSON.stringify(this.state));
    this.setState({
      dollars: this.state.dollars + 30
    });
    console.log('State after (timeout): ' + JSON.stringify(this.state));
  }

  onAjaxCallback = (err, res) => {
    if (err) {
      console.log('Error in AJAX call: ' + JSON.stringify(err));
      return;
    }

    console.log('State before (AJAX call): ' + JSON.stringify(this.state));
    this.setState({
      dollars: this.state.dollars + 40
    });
    console.log('State after (AJAX call): ' + JSON.stringify(this.state));
  }

  render() {
    console.log('State in render: ' + JSON.stringify(this.state));

    return (
       <button
         id="testButton"
         onClick={this.onClickHandler}>
         'Click me'
      </button>
    );
  }
}

ReactDOM.render(
  <TestComponent />,
  document.getElementById('app')
);
```

> React fiber 会对 async nature of setState 带来什么样的影响呢？

##### 解决setState函数异步的办法?

根据 React 官方文档，setState 函数实际上接收两个参数，其中第二个参数类型是一个函数，作为 setState 函数执行后的回调。通过传入回调函数的方式，React 可以保证传入的回调函数一定是在 setState 成功更新 this.state 之后再执行

```Jsx
_onClickHandler: function _onClickHandler() {
   console.log('State before (_onClickHandler): ' + JSON.stringify(this.state));
   this.setState({
   dollars: this.state.dollars + 10
   }, () => {
   console.log('Here state will always be updated to latest version!');
   console.log('State after (_onClickHandler): ' + JSON.stringify(this.state));
   });
}
```

##### 更多关于setState的小知识

其实 setState 作为一个函数，本身是同步的。只是因为在 setState 的内部实现中，使用了 React updater的enqueueState 或者 enqueueCallback 方法，才造成了异步。

下面这段是React源码中setState的实现:

```Jsx
ReactComponent.prototype.setState = function(partialState, callback) {
  invariant(
    typeof partialState === 'object' ||
    typeof partialState === 'function' ||
    partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
    'function which returns an object of state variables.'
  );
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};
```

而 updater 的这两个方法，又和 React 底层的 Virtual Dom (虚拟DOM树)的diff算法有紧密的关系，所以真正决定同步还是异步的其实是 Virtual DOM 的 diff 算法。

Reference:

- <https://medium.com/@wereHamster/beware-react-setstate-is-asynchronous-ce87ef1a9cf3#.jhdhncws3>
- <https://www.bennadel.com/blog/2893-setstate-state-mutation-operation-may-be-synchronous-in-reactjs.htm>

### Passing a function to setState

我们已经提到过,  setState 其实是异步的. 因为出于性能优化考虑, React 会将多次setState 做一次批处理. 于是 setState 并不会在被调用之后立即改变我们的state. 这就意味着你并不能依赖于在调用 setState 方法之后 state , 因为此时你并不能确认该state更新与否. 

当然针对这个问题我们也有解决办法:用前一个 state(previous state) 作为需要传入函数的参数,将一个函数作为第二个参数传递给 setState ，这样做能保证你传入的函数需要取到的 state 一定会是被传入的 setState 执行之后的 state 。

##### 问题：

```Jsx
// assuming this.state.count === 0
this.setState({count: this.state.count + 1});
this.setState({count: this.state.count + 1});
this.setState({count: this.state.count + 1});
// this.state.count === 1, not 3
```

##### 解决办法：

```Jsx
this.setState((prevState, props) => ({
  count: prevState.count + props.increment
}));
```

##### and More：

```Jsx
// Passing object
this.setState({ expanded: !this.state.expanded });

// Passing function
this.setState(prevState => ({ expanded: !prevState.expanded }));
```

Reference：

- [setState() Gate](https://medium.com/javascript-scene/setstate-gate-abc10a9b2d82)
- [Do I need to use setState(function) overload in this case?](http://stackoverflow.com/questions/43428456/do-i-need-to-use-setstatefunction-overload-in-this-case/43440790#43440790)
- [Functional setState is the future of React](https://medium.freecodecamp.com/functional-setstate-is-the-future-of-react-374f30401b6b)

### Redux Reselect

在React-Redux的 connect(mapState)中使用Reselect, 这能避免频繁的重新渲染的发生。

Reslect会记录下上一次函数调用的结果并且当再次以相同方式调用时返回相同的结果(而不是创建一个一模一样的新结果). 只有当传入的参数不同时，才会产生新的结果。

Reference:

- [React](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f#.cz2ypc2ob)
- [Computing Derived Data: Docs](http://redux.js.org/docs/recipes/ComputingDerivedData.html)

### Dependency Injection

在React中，想做依赖注入(Dependency Injection)其实相当简单，具体有以下方法：

- HOC——高阶组件(high-order component)
- Context传递（在最新的React官方文档中，Context已经不太被官方推荐使用了：[Why Not To Use Context](https://reactjs.org/docs/context.html#why-not-to-use-context)

Reference:

- [What is Dependency Injection?](https://www.youtube.com/watch?v=IKD2-MAkXyQ)
- [The Basics of Dependency Injection](https://www.youtube.com/watch?v=jXhdOTw1q5Q)
- [Dependency injection in JavaScript](http://krasimirtsonev.com/blog/article/Dependency-injection-in-JavaScript)
- [DI In React](https://github.com/krasimir/react-in-patterns/tree/master/patterns/dependency-injection)

### React Lazy

`React Lazy` 是 16.6 之后添加的功能。需要配合 `react.Suspense` 使用。

类似社区实现的 [react-loadable](https://github.com/jamiebuilds/react-loadable) ，在之前我们是通过 webpack 的 `require.ensure` 或者自己封装 `import()` 来实现，本质上都是 `code splitting`。

### React hooks

`Hooks` 是 16.7 之后新添加的功能。

React Team 收了 [recompose](https://github.com/acdlite/recompose) 演化成了 `Hooks`

简单理解`Hooks` 是一种函数，该函数允许你“勾住（hook into）”React 状态和来自函数组件的生命周期功能。

Hook 在类内部不起作用，它们允许你无需类就使用 React。

> 可以通过取巧的方式实现：hook 里面返回 class component，传入相应的 props

##### hooks 种类

React 内置了一些 hook，如 `useState` 当然也可以创建自定义的 `Hooks` 以在不同的组件当中复用状态。

根据 React 官方给出的文档，Hooks 主要分为以下几种：

- State Hooks（可以实现 local state 或者 global state
- Effect Hooks（可以实现 class 当中的一些 lifecycle
- 自定义 Hooks（主要用来复用组件逻辑和状态

##### 注意事项

官方定义了一些 rules of hooks，也就是使用 hooks 时候需要注意的内容：

- 只能在顶层调用 Hook，不要在循环、条件或嵌套函数中调用 Hook。
- 仅从 React 功能组件调用 Hook。不要从常规 JavaScript 函数调用 Hook。（还有另一个有效的地方来调用 Hook，即你的自定义 Hook。）

官方还提供了 [linter plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) 来检查并自动执行这些规则

##### 引入的背景

为什么要引入 `Hooks` ，大概有以下原因（摘自[官方文档](https://reactjs.org/docs/hooks-intro.html#motivation)

- 难以在组件之间重用有状态逻辑（组件树🌲过于臃肿
- 复杂的组件变得难以理解（状态逻辑和抽象过多
-  类让人和机器感到困惑（万恶的 this 和数据流的理解
-  逐步采用策略（感觉是提供新的 idea，并不是抛弃 class component 的写法

> 截止本文更新时间（2018年10月29日15:21:47），社区已经出现了很多关于 hooks 的库和 idea，印象较深的是这个 [react-use](https://github.com/streamich/react-use) ，看了一下源码对 hooks 的理解更多了一层

##### Reference:

- [offical intro hooks](https://reactjs.org/docs/hooks-intro.html)
- [github react-use](https://github.com/streamich/react-use)
- [github rehooks](https://github.com/rehooks)
- [github awesome react hoos list](https://github.com/rehooks/awesome-react-hooks)
- [github react hooks todo app](https://github.com/f/react-hooks-todo-app)
- [List of top 301 ReactJS Interview Questions & Answers](https://github.com/semlinker/reactjs-interview-questions)