/**
 * @official
 */
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * @inject
 */
import Style from './NotFound.M.less';

export default class NotFound extends React.PureComponent {
  constructor() {
    super();
  }

  render() {
    return (
      <main className={Style.NotFound}>
        <h2>
          Nothing Found by this route
          <br />
          but you can also <a href="/">click me</a> to Index
        </h2>
      </main>
    );
  }
}
