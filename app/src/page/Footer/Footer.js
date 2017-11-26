'use strict';
/**
 * @official
 */
import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

/**
 * @inject
 */
import Styles from './Footer.M.less';

export default class Footer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <footer className={Styles.footer}>
        <p> Licensed under CC BY-NC-SA 4.0 International.</p>
        <p> Copyright © 2016-2017 TOM's. </p>
      </footer>
    );
  }
}
