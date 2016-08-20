'use strict';
import React ,{Component,PropTypes }from 'react'
import ReactDOM from 'react-dom'

import './Notification.stylus'

class Notification extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    static propTypes = {
        type: PropTypes.string.isRequired,
        msg: PropTypes.string.isRequired,
        duration: PropTypes.number.isRequired,
        callBack: PropTypes.func.isRequired
    };

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {

    }

    render() {
        const {msg,type}=this.props;
        return (
            <div className="notification-wrapper">
                <div className="body slideInDown animation">
                    <div className="content">
                        <i className={`icon icon-${type}`}></i>
                        <span>{msg}</span>
                    </div>
                </div>
            </div>
        )
    }
}

Notification.show = (type, msg, cb, duration)=> {
    duration = duration || 1500;
    const props = {type, msg, cb, duration};
    const div = document.createElement('div');
    document.body.appendChild(div);
    ReactDOM.render(<Notification {...props} />, div);

    setTimeout(()=> {

        div.addEventListener('animationend', ()=> {
            div.parentNode.removeChild(div);
            ReactDOM.unmountComponentAtNode(div);
            props.cb && props.cb();
        }, false);

        div.querySelector('.body').classList.add('slideOutDown');

        props.callback && props.callback();
    }, props.duration);

};
export default {
    info(msg, cb, duration){
        return Notification.show("info", msg, cb, duration);
    },
    success(msg, cb, duration){
        return Notification.show("success", msg, cb, duration);
    },
    err(msg, cb, duration){
        return Notification.show("error", msg, cb, duration);
    }
};