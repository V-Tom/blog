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
import './Spinner.stylus';

export default class Spinner extends React.PureComponent {
  static instance = null;

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div className="Spinner">
        <div className="Spinner-ring-container">
          <section className="Spinner-ring Spinner-ring-1" />
          <section className="Spinner-ring Spinner-ring-2" />
        </div>
      </div>
    );
  }
}
