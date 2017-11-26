'use strict';

/**
 * @official
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

/**
 * @inject
 */
import Styles from './Spinner.M.less';

export default class Spinner extends React.PureComponent {
  static instance = null;

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main className={Styles.Spinner}>
        <div className={Styles.loader} />
      </main>
    );
  }
}
