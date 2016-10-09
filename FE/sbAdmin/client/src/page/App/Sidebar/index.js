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
//official
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

//Third-part
import { Menu, Icon } from 'antd'

//mine
import './Sidebar.less'

export default class Sidebar extends Component {
  constructor(props) {
    super(props)
    const current = 'Dashboard'
    this.state = { current }
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  __handleClick(e) {
    this.setState({
      current: e.key,
    });
  }

  render() {
    const classNamePrefix = 'sbAdmin-sidebar'
    return (
      <div className={classNamePrefix}>
        <div className={`${classNamePrefix}-container`}>
          <Menu onClick={(e)=>this.__handleClick(e)}
                defaultOpenKeys={['Dashboard']}
                selectedKeys={[this.state.current]}
                mode="inline"
          >
            <Menu.Item key="Dashboard">
              <span>
                <Icon type="home"/><span>
                <Link to="/Dashboard">Dashboard</Link>
              </span></span>
            </Menu.Item>

            <Menu.Item key="Graphs">
              <span>
                <Icon type="line-chart"/>
                <Link to="/Graphs">Graphs</Link>
              </span>
            </Menu.Item>

            <Menu.SubMenu key="sub1" title={<span><Icon type="book"/><span>Blog</span></span>}>
              <Menu.Item key="Article-Management">
                <span>
                  <Icon type="file-text"/>
                  <Link to="/Article-Management">Article Management</Link>
                </span>
              </Menu.Item>
              <Menu.Item key="Tags-Management">
                <span>
                  <Icon type="tags"/>
                  <Link to="/Tags-Management">Tags Management</Link>
                </span>
              </Menu.Item>
            </Menu.SubMenu>

          </Menu>
        </div>
        { this.props.children }
      </div>
    )
  }
}