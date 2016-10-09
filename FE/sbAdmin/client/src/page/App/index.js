'use strict'
import React, { Component, PropTypes } from 'react'
import '../../less/override-ant.less'
import './App.less'
import { writeEmojiStyle } from '../../libs'


import Header from './Header'
import Sidebar from './Sidebar'
export default class App extends Component {

  constructor(props) {
    super(props)
    writeEmojiStyle()
  }

  static propsType = {}

  static defaultProps = {}

  componentDidMount() {
  }


  render() {
    const classNamePrefix = 'sb-Admin'

    return (
      <div className={classNamePrefix}>
        <div className={`${classNamePrefix}-container`}>
          <Header/>
          <Sidebar/>
          <div className={`${classNamePrefix}-content`}>
            { this.props.children }
          </div>
        </div>
      </div>
    )
  }
}