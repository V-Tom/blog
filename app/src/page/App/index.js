/**
 * @official
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

/**
 * @inject
 */
import Header from '../Header';
import {writeEmojiStyle, copyListener} from '../../lib/utils/funny';

import '../../stylus/common/reset.stylus';
import '../../stylus/common/common.stylus';
import '../../stylus/common/icon.stylus';
import '../../stylus/common/animation.stylus';

/**
 * --------------------------------------------------------------------------------------
 * GLOBAL
 * do not use redux API middleware
 */

import * as API from '../../api';
import * as ACTIONS from '../../actions/typs';
import Notification from '../../component/Notification';
import Spinner from '../../component/Spinner';

const noop = () => {};
window.API = API;
window.ACTIONS = ACTIONS;
window.Header = ['show', 'hide', 'isActive'].reduce(
  (a, b) => ({...a, ...{[b]: noop}}),
  Object.create(null),
);
window.Notification = Notification;
window.Spinner = Spinner;

/**
 * GLOBAL
 * do not use redux API middleware
 * --------------------------------------------------------------------------------------
 */

const mapStateToProps = state => {
  return state.Common.toJS();
};

const mapDispatchToProps = dispatch => {
  return {
    reducerActions: bindActionCreators(Object.assign({}), dispatch),
  };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    writeEmojiStyle();
    copyListener();
  }

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
        <footer />
      </div>
    );
  }
}
