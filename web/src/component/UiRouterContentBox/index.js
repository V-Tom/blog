//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
//
//
'use strict'
import React, { Component, PropTypes } from 'react'

import './UiRouterContentBox.less'

export default class UiRouterContentBox extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    headerRight: PropTypes.element,
    searchContainer: PropTypes.element
  }

  static defaultProps = {
    title: 'unknown ui router content title'
  }

  render() {
    const classNamePrefix = 'UiRouterContentBox'

    const { title, children, headerRight, searchContainer, breadcrumb } = this.props

    return (
      <section className={classNamePrefix}>
        <section className={`${classNamePrefix}-header`}>
          <h3 className={`${classNamePrefix}-title`}>{title}</h3>
          {headerRight && <div className={`${classNamePrefix}-header-control`}> {headerRight}</div>}
        </section>
        <section className={`${classNamePrefix}-body`}>
          <div className={`${classNamePrefix}-search-container`}>
            {searchContainer && <section>{searchContainer}</section>}
          </div>
          {children}
        </section>
      </section>
    )
  }
}