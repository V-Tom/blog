'use strict';
/**
 * @official
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Link} from 'react-router';

/**
 * @inject
 */
import './Footer.stylus';

export default class Header extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return <footer />;
  }
}
