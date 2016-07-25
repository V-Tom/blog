import React ,{Component} from 'react'
import Header from '../../component/Header'
import Spinner from '../../component/Spinner'

import {writeEmojiStyle,copyListener} from '../../libs/utils/funny'


import '../../style/common/reset.stylus'
import '../../style/common/common.stylus'
import '../../style/common/icon.stylus'
import '../../style/common/animation.stylus'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.__init();
    }

    __init() {
        writeEmojiStyle();
    }

    render() {
        const {}=this.props;
        return (<div>
            <Header/>
            {this.props.children}
            <Spinner></Spinner>
        </div>)
    }
}