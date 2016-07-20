import React ,{Component,PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Link} from 'react-router'

import './header.stylus'

const mapStateToProps = state=> {
    return state.Header.toJS();
};

const mapDispatchToProps = dispatch=> {
    return {
        actions: bindActionCreators(Object.assign({}), dispatch)
    }
};

@connect(mapStateToProps, mapDispatchToProps)

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    static PropTypes = {
        Header: PropTypes.object.isRequired
    };

    componentWillReceiveProps(nextProps) {

    }

    render() {
        const {active}=this.props;
        const headerClassName = active ? 'App_header active' : 'App_header';
        return (
            <header className={headerClassName}>
                <nav className="App_header_container">
                    <div className="App_header_body container">
                        <section className="App_nav_description" data-page="I Am A Full-stack Developer"></section>
                        <section className="App_nav_logo">
                            <i className="icon icon-logo"></i>
                            <Link to={"/"} title="0"></Link>
                            <button type="button" className="App_nav_toggle">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </section>
                        <section className="App_nav_bar">
                            <ul>
                                <li>
                                    <Link to={"/blog"} title="1"><i className="icon icon-blog"></i></Link>
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    <Link to={"/me"} title="2"><i className="icon icon-me"></i></Link>
                                </li>
                            </ul>
                        </section>
                    </div>
                </nav>
            </header>
        )
    }
}
