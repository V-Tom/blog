import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as actions from '../../actions/action.Header'
import './header.stylus'

const mapStateToProps = state=> {
  return state.Header.toJS();
};

const mapDispatchToProps = dispatch=> {
  return {
    actions: bindActionCreators(Object.assign({}, actions), dispatch)
  }
};

@connect(mapStateToProps, mapDispatchToProps)

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { active }=this.props;
    const headerClassName = active ? 'App_header active' : 'App_header';
    return (
      <header className={headerClassName}>
        <nav className="App_header_container">
          <div className="App_header_body container">
            <section className="App_nav_description" data-page="I Am A Full-stack Developer"></section>
            <section className="App_nav_logo">
              <i className="icon icon-logo"></i>
              <Link activeClassName='active' to={"/"} title="full stack"></Link>
              <button type="button" className="App_nav_toggle">
                <span></span>
                <span></span>
                <span></span>
              </button>
            </section>
            <section className="App_nav_bar">
              <ul>
                <li>
                  <Link activeClassName='active' to={"/blog"} title="blog"><i className="icon icon-blog"></i></Link>
                </li>
              </ul>
              <ul>
                <li>
                  <Link activeClassName='active' to={"/me"} title="me"><i className="icon icon-me"></i></Link>
                </li>
              </ul>
            </section>
          </div>
        </nav>
      </header>
    )
  }
}
