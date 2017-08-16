/**
 * @official
 */
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * @inject
 */
export default class NotFound extends React.PureComponent {
  constructor() {
    super();
  }

  render() {
    const {} = this.props;
    return <h1>404</h1>;
  }
}
