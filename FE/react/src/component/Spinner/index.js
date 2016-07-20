import React ,{Component,PropTypes }from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../actions/blog.action'

import './Spinner.stylus'

const mapStateToProps = state=> {
    return state.Spinner.toJS();
};

const mapDispatchToProps = dispatch=> {
    return {
        actions: bindActionCreators(Object.assign(actions), dispatch)
    }
};

@connect(mapStateToProps, mapDispatchToProps)

export default class Spinner extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        show: PropTypes.bool.isRequired
    };

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        if (this.props.show) {
            return (
                <div className="Spinner">
                    <div className="Spinner-ring-container">
                        <section className="Spinner-ring Spinner-ring-1"></section>
                        <section className="Spinner-ring Spinner-ring-2"></section>
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }
}