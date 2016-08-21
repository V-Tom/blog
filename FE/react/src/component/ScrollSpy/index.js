'use strict'
import React, { Component, PropTypes }from 'react'

import './ScollSpy.stylus'

export default class ScrollSpy extends Component {
  constructor(props) {
    super(props)
    let navigation = []
    let ScrollSpyReady = false

    this.state = { navigation, ScrollSpyReady }
  }

  static propTypes = {
    ready: PropTypes.bool.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.ready) {
      return
    }
    if (nextProps.ready && !this.state.ScrollSpyReady) {
      this.__getScrollSpyData()
    }
  }

  componentDidMount() {

  }

  __getScrollSpyData() {
    const { container, query }=this.props
    let ScrollSpyReady = true
    let navigation = []
    Array.from(document.querySelector(container).querySelectorAll(query)).forEach(item=> {
      let id = item.getAttribute('id'), level = item.getAttribute('data-level')
      if (id && level) {
        navigation.push({
          target: id.replace(/^#/, ''),
          level: level,
          offset: item.offsetTop || item.getBoundingClientRect().top
        })
      }
    })
    this.setState({ navigation, ScrollSpyReady })
  }


  __ScrollSpy(ev, i) {
    ev.preventDefault()
    const { navigation }=this.state
    window.scrollTo(0, Number(navigation[i].offset) - 100)
  }


  render() {
    const { ready }=this.props
    const { navigation }=this.state
    if (ready) {
      return (
        <div className="article-scrollSpy">
          <ul>
            {navigation.map((item, i)=>
              <li key={i} className={`level-${item.level}`} onClick={ev=>this.__ScrollSpy(ev,i)}>
                <a href="javascript:void (0)" title={item.target}
                   data-offset={item.offset}>{item.target}</a>
              </li>
            )}
          </ul>
        </div>
      )
    } else {
      return null
    }
  }
}