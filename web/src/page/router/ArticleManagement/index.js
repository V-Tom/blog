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
import { bindActionCreators } from 'redux'
import Update from 'react-addons-update'
import { connect } from 'react-redux'
//Third-part
import { Table, Icon, Modal, Spin, Input, Switch, message } from 'antd'
//mine
import './ArticleManagement.less'
import '../../../less/markdown/markdown.stylus'
import '../../../less/markdown/prism.stylus'

import marked from '../../../libs/markdown'
import prism from '../../../libs/markdown/prism'
import { articleApi, authApi, toolsApi } from '../../../api'
import UiRouterContentBox from '../../../component/UiRouterContentBox'
import * as actions from '../../../action/action.ArticleManagement'
const mapStateToProps = state=> {
  return state.ArticleManagement.toJS()
}

const mapDispatchToProps = dispatch=> {
  return {
    reducerActions: bindActionCreators(Object.assign({}, actions), dispatch)
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ArticleManagement extends Component {
  constructor(props) {
    super(props)
    const page = 1
    const limit = 15
    const pageDataTotal = 15
    const search = undefined

    const tableLoading = true

    const columns = [
      { title: 'article title', dataIndex: 'articleTitle', key: 'articleTitle' },
      { title: 'id', dataIndex: 'articleId', key: 'articleId' },
      { title: 'sub title', dataIndex: 'subTitle', key: 'subTitle' },
      {
        title: '操作',
        dataIndex: '',
        key: 'control',
        render: (text, record, index) => {
          return (
            <span>
               <a href=' javascript:; ' onClick={()=>this.__onEditArticleClick(text)} title="edit"><Icon
                 type="edit"/></a>
               <span className="ant-divider"/>
              <a href=' javascript:; '><Icon type="delete"/></a>
            </span>
          )
        }
      }
    ]

    const modalVisible = false
    const togglePreview = false
    const articleData = {
      content: '#loading'
    }
    this.state = {
      page,
      limit,
      search,
      pageDataTotal,
      columns,
      tableLoading,
      modalVisible,
      articleData,
      togglePreview
    }

  }

  componentWillMount() {

  }

  componentDidMount() {
    this.__fetchArticleList()
  }

  componentWillUnmount() {

  }

  /**
   *
   * @private
   */
  __onEditArticleClick(text) {
    let { articleId } = text
    articleApi.getArticleDetail(articleId).then(data=> {
      this.setState({
        modalVisible: true,
        articleData: data.data
      }, ()=> {
        setTimeout(function () {
          prism && prism.highlightAll(false)
        }, 300)
      })
    })
  }

  __onModalOkClick() {
    const { articleData } = this.state
    articleApi.updateArticleDetail(articleData.articleId, articleData)
  }

  __onModalCancelClick() {
    this.setState({ modalVisible: false })
  }


  /**
   * 获取 数据
   * @returns {Promise.<TResult>}
   * @private
   */
  __fetchArticleList() {
    const { reducerActions } = this.props
    const { page, limit, search } = this.state
    return reducerActions.getArticleList(page, limit, search).then((data)=> {
      this.setState({
        tableLoading: false,
        pageDataTotal: data.count
      })
    })
  }

  __convertToTable(articleList) {

    let data = []
    articleList && articleList.forEach(item=> {
      data.push({
        articleTitle: item.title,
        articleId: item.articleId,
        subTitle: item.subTitle
      })
    })
    return data
  }

  /**
   * 正式上传图片
   * @param e
   * @private
   */
  __doUpload(file, token, cdn) {
    return new Promise((resolve, reject)=> {
      let xhr = new XMLHttpRequest(),
        form = new FormData()
      xhr.onload = function () {
        resolve(JSON.parse(xhr.responseText))
      }

      xhr.onerror = function () {
        reject()
      }
      form.append('token', token)
      form.append('file', file)
      form.append('key', this.__b64EncodeUnicode(`${file.name}?type=${file.type}&time=${new Date().getTime()}&size=${file.size}`))
      xhr.open('POST', cdn)
      xhr.send(form)
    })
  }

  /**
   * base 64 deunicode
   * @param str
   * @returns {*}
   * @private
   */
  __b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
  }

  /**
   * base 64
   * @param str
   * @returns {*|string}
   * @private
   */
  __b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode('0x' + p1)
    }))
  }

  /**
   * 上传 图片
   * @param ev
   * @private
   */
  __onChangeIntroPic(ev) {
    let target = ev.target
    let file = target.files[0]

    authApi.getAdminToken().then(()=> {

      toolsApi.getCdnUploadToken().then(({ token, url })=> {
        this.__doUpload(file, token, url).then(data=> {
          let url = `https://oga6csqie.qnssl.com/${data.key}`

          target.files = null
          if (window.confirm(`当前地址为${url},是否保存为文章pic?`)) {
            let newState = Update(this.state.articleData, {
              introWrapper: {
                '$set': url
              }
            })
            this.setState({ articleData: newState })
          }
          target.files = null
          console.info(url)
        }).catch(e=> {
          console.error(e)
          message.error(`文件上传失败`)
        })
      }).catch(e=> {
        console.error(e)
        message.error(`获取 cnd upload token 失败`)
      })

    }).catch(e=> {
      console.error(e)
      message.error(`获取admin token 失败`)
    })
  }

  __onTablePaginationChange(current) {
    this.setState({
      tableLoading: true,
      page: current
    }, ()=> {
      this.__fetchArticleList()
    })
  }

  render() {
    const classNamePrefix = 'sb-admin-ArticleManagement'
    const { Article } = this.props
    const { page, limit, search, columns, tableLoading, pageDataTotal, modalVisible, articleData, togglePreview } = this.state
    const pagination = {
      pageSize: limit,
      total: pageDataTotal,
      onChange: (current)=> {
        this.__onTablePaginationChange(current - 1)
      }
    }
    const data = this.__convertToTable(Article.data)

    return (
      <UiRouterContentBox title="Article Management">
        <div className={classNamePrefix}>
          <Table columns={columns}
                 dataSource={data}
                 bordered={true}
                 loading={tableLoading}
                 locale={{ emptyText: '暂无数据' }}
                 pagination={pagination}
                 className="table"
          />
          <Modal
            wrapClassName={`${classNamePrefix}-article-modal${togglePreview ? ' togglePreview' : ''}`}
            closeable={false}
            title={(
              <div>
                {articleData.title}
                <Switch defaultChecked={togglePreview} onChange={(togglePreview)=>this.setState({ togglePreview })}/>
                上传图片:
                <input type="file" onChange={(ev)=>this.__onChangeIntroPic(ev)}/>
              </div>
            )}
            width="100%"
            style={{ height: '100%', top: 0 }}
            maskClosable={false}
            onCancel={()=>this.__onModalCancelClick()}
            onOk={()=>this.__onModalOkClick()}
            visible={modalVisible}
          >
            <div className={`${classNamePrefix}-markdown ${classNamePrefix}-markdown-view`}>
              <Input type="textarea" value={articleData.content}
                     onChange={e=> {
                       let newState = Update(this.state.articleData, {
                         content: { '$set': e.target.value }
                       })
                       this.setState({ articleData: newState }, ()=> {
                         prism && prism.highlightAll(false)
                       })
                     }}
                     autosize={{ minRows: 5 }}/>
            </div>
            <section className={`${classNamePrefix}-markdown ${classNamePrefix}-markdown-detail markdown`}>
              <div dangerouslySetInnerHTML={{ __html: marked(articleData.content) }}></div>
            </section>
          </Modal>
        </div>

      </UiRouterContentBox>
    )
  }
}
