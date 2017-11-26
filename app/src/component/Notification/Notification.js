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
import Styles from './Notification.less';

export default class Notification extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    type: PropTypes.string.isRequired,
    msg: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    callBack: PropTypes.func,
  };

  static defaultProps = {};

  render() {
    const {msg, type} = this.props;
    return (
      <div className={Styles.notification}>
        <div className={`${Styles.body} ${Styles.slideInDown}`}>
          <div className={Styles.content}>
            <i className={`icon icon-${type}`} />
            <span>
              {msg}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
