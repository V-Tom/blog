'use strict';

/**
 * @official
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Style from './Image.M.less';

/**
 * @inject
 */
export default class Image extends React.PureComponent {
  constructor(props) {
    super(props);
    const ready = false;
    const isError = false;
    this.state = {ready, isError};
  }

  static propTypes = {
    src: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const {src} = this.props;
  }

  render() {
    const {ready, isError} = this.state;

    /**
     * isError
     */

    if (isError) {
      return <main className={Style.Image} />;
    }

    /**
     * ready
     */

    if (ready) {
      return <main className={Style.Image} />;
    }

    /**
     * loading
     */

    return <main className={Style.Image} />;
  }
}
