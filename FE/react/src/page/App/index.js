import React, { Component } from 'react'
import Header from '../Header'
import Spinner from '../../component/Spinner'

import { writeEmojiStyle, copyListener } from '../../libs/utils/funny'


import '../../stylus/common/reset.stylus'
import '../../stylus/common/common.stylus'
import '../../stylus/common/icon.stylus'
import '../../stylus/common/animation.stylus'

export default class App extends Component {
  constructor(props) {
    super(props);
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