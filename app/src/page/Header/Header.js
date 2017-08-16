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
import './header.stylus';

export default class Header extends React.PureComponent {
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
    const headerClassName = cx('header', {
      active: !active,
    });

    return (
      <header className={headerClassName}>
        <nav className="header-container">
          <div className="header-body container">
            <section
              className="nav-description"
              data-page="I Am A Full-stack Developer"
            />
            <section className="nav-logo">
              <i className="icon icon-logo" />
              <Link to="/" activeClassName="active" title="full stack" />
              <button type="button" className="nav-toggle">
                <span />
                <span />
                <span />
              </button>
            </section>
            <section className="nav-bar">
              <ul>
                <li>
                  <Link to="/blog" activeClassName="active" title="blog">
                    <i className="icon icon-blog" />
                  </Link>
                </li>
              </ul>
              <ul>
                <li>
                  <Link to="/me" activeClassName="active" title="me">
                    <i className="icon icon-me" />
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </nav>
      </header>
    );
  }
}
