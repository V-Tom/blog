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
import Styles from './header.M.less';

export default class HeaderComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    const active = true;
    this.state = {active};
  }

  componentDidMount() {
    !this.state.active && this.setState({active: true});

    /**
     * ------------------------------------------------------------------------
     * GLOBAL
     */
    window.Header.show = () => this.setState({active: true});
    window.Header.hide = () => this.setState({active: false});
    window.Header.isActive = () => this.state.active;
    /**
     * GLOBAL
     * ------------------------------------------------------------------------
     */
  }

  render() {
    const {active} = this.state;

    return (
      <header
        className={cx(Styles.banner, {
          [Styles.active]: !active,
        })}>
        <div className={Styles.header}>
          <div className={Styles.logo}>
            <Link to="/">
              <svg viewBox="0 0 400 300">
                <symbol id="s-text">
                  <text textAnchor="middle" x="50%" y="50%" dy=".35em">
                    TOM
                  </text>
                </symbol>
                <use xlinkHref="#s-text" className={Styles.text} />
                <use xlinkHref="#s-text" className={Styles.text} />
                <use xlinkHref="#s-text" className={Styles.text} />
                <use xlinkHref="#s-text" className={Styles.text} />
                <use xlinkHref="#s-text" className={Styles.text} />
              </svg>
            </Link>
          </div>

          <nav className={Styles.nav}>
            <ul>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              {/*<li>*/}
              {/*<Link to="/me">Me</Link>*/}
              {/*</li>*/}
            </ul>
          </nav>
        </div>
      </header>
    );
  }
}
