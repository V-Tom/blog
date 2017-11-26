/**
 * @official
 */
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * @inject
 */
import '../../less/common/reset.less';
import '../../less/common/common.less';
import Header from '../Header';

/**
 * INJECT GLOBAL
 */
import './injectGlobal';
import './laboratory';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main id="portal">
        <Header />
        {this.props.children}
      </main>
    );
  }
}
