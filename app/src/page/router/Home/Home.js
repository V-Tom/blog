'use strict';

/**
 * @official
 */
import React from 'react';
import ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';

/**
 * @inject
 */
import Styles from './Home.M.less';

export default class Index extends React.PureComponent {
  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.Header.show();
  }

  render() {
    return <main className={Styles.Home}>This page is on the way</main>;
  }
}
