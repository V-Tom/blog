//
//                       _oo0oo_
//                      o8888888o
//                      88' . '88
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
//          .'' '<  `.___\_<|>_/___.' >' ''.
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
import { connect } from 'react-redux'
import * as actions from '../../../../actions/action.Discuss'
import Update from 'react-addons-update'
//Third-part

//mine
import './Discuss.stylus'
import Emoji from '../../../../component/Emoji'
import Notification from '../../../../component/Notification'
import { escapeHtml, formatDate, emojiDecoding } from '../../../../libs/utils/tools'
import Fetch from '../../../../api/fetch'
import { restfulAPI } from '../../../../config'
const { API_ROOT, API_VERSION } = restfulAPI
const mapStateToProps = state=> {
  return state.Discuss.toJS()
}

const mapDispatchToProps = dispatch=> {
  return {
    reducerActions: bindActionCreators(Object.assign({}, actions), dispatch)
  }
}

@connect(mapStateToProps, mapDispatchToProps)

export default class Discuss extends Component {
  constructor(props) {
    super(props)
    const isUserLogin = false
    const isShowEmoji = false
    const discuss = {
      'articleDbId': null,
      'user': null,
      'articleId': null,
      'content': '',
      'replyTo': null
    }
    const verifyCode = {
      'code': '',
      'base64': null,
      'timeShown': null
    }
    const platformUser = {}
    this.state = { isUserLogin, discuss, verifyCode, isShowEmoji, platformUser }
    this.storageKey = 'platformUser'

    Fetch.jsonp(`${API_ROOT}${API_VERSION}/blog/user/sign`, 'say').then(data=> {
      let { result, status }=data
      if (status === 0) {
        result = result.data
        if (result.token) {
          Fetch.setHeader('token', result.token)
        }
      }
    })
  }

  componentWillMount() {

  }

  componentWillReceiveProps(props) {

  }

  componentDidMount() {
    let isUserLogin = false, platformUser = window.sessionStorage.getItem(this.storageKey)
    if (platformUser) {
      try {
        platformUser = JSON.parse(platformUser)
        isUserLogin = true
      } catch ( e ) {
        isUserLogin = false
      }
    }


    if (!isUserLogin) {
      window.localStorage.setItem(this.storageKey, "UNKNOWN PLATFORMUSER ")
      this.__listenLocalStorage()
    }

    this.__fetchArticleReply().then(()=> {
      this.setState({ isUserLogin, platformUser: platformUser })
    })

  }

  componentWillUnmount() {
    this.storageListener && window.removeEventListener('storage', this.storageListener, false)
  }


  __listenLocalStorage() {
    let listener = (ev)=> {
      if (ev.key === this.storageKey) {
        window.sessionStorage.setItem(this.storageKey, ev.newValue)
        window.location.reload()
      }
    }
    this.storageListener = listener
    window.addEventListener('storage', listener, false)
  }

  /**
   * emoji selected
   * @param ev
   * @private
   */
  __emojiOnSelected(ev) {
    let emojiTitle = ev.target.getAttribute('title')

    if (emojiTitle) {
      emojiTitle = '[' + emojiTitle + ']'
      let textarea = this.refs.replyContent

      if (textarea) {
        let startPos = textarea.selectionStart, endPos = textarea.selectionEnd,
          currentPos = startPos, content = textarea.value || ''
        currentPos += emojiTitle.length

        //set state and update SelectionRange
        textarea.selectionStart = textarea.selectionEnd = currentPos
        let newState = Update(this.state, {
          isShowEmoji: {
            '$set': false
          }
        })
        this.setState(newState, ()=> {
          textarea.value = content.substring(0, startPos) + emojiTitle + content.substring(endPos, content.length)
          startPos += emojiTitle.length
          if (textarea.createTextRange) {
            let range = textarea.createTextRange
            range.move('character', startPos)
            range.select()
          } else {
            if (typeof textarea.selectionStart !== undefined) {
              textarea.focus()
              textarea.setSelectionRange(startPos, startPos)
            } else {
              textarea.focus()
              alert('WTF?你使用的什么破浏览器，赶紧换掉')
            }
          }
        })
      }
    }
  }

  /**
   * eomji toogle
   * @param ev
   * @private
   */
  __emojiToggle(ev) {
    const { isShowEmoji }=this.state
    this.setState({
      'isShowEmoji': !isShowEmoji
    })
  }

  __fetchArticleReply() {
    const { articleId, reducerActions }=this.props
    return reducerActions.getArticleReply(articleId)
  }

  __getReplyVerifyCode(ev) {
    let { isUserLogin } = this.state
    if (!isUserLogin) {
      Notification.err('~请先登录')
      return false
    }
    let { verifyCode:{ timeShown, code, base64 } }=this.state
    if (code && base64) {
      if (ev.target.tagName === 'INPUT') {
        return false
      }

      if (timeShown && (new Date().getTime() - timeShown <= 5000)) {
        Notification.info("获取验证码5s一次哦~")
        return false
      }
    }
    const { reducerActions }=this.props
    reducerActions.getVerifyCode().then(verifyCode=> {
      let data = verifyCode.data
      this.setState({
        verifyCode: {
          'code': data.code,
          'base64': data.base64,
          'timeShown': new Date().getTime()
        }
      })
    })
  }

  /**
   * 提交评论
   * @param ev
   * @returns {boolean}
   * @private
   */
  __onAddReplyFormSubmit(ev) {
    let { replyContent, ReplyVerifyCode } = this.refs

    if (!ReplyVerifyCode.value) {
      ev.preventDefault()
      ev.stopPropagation()
      Notification.info('请输入验证码~', ()=> {
        this.__getReplyVerifyCode()
      })
      return false
    }

    let { discuss, verifyCode } = this.state
    if (ReplyVerifyCode.value.toLowerCase() === verifyCode.code.toLowerCase()) {
      const { reducerActions, articleDbId, articleId }=this.props
      let discuss = Object.assign({}, discuss, { content: replyContent.value }, { articleId }, { articleDbId })
      discuss.content = escapeHtml(discuss.content)

      reducerActions.addArticleReply(discuss)
        .then(()=> {
          Notification.success('添加评论成功')
          replyContent.value = ''
          ReplyVerifyCode.value = ''
          this.__fetchArticleReply()
        }).catch(e=> {
        Notification.err('添加评论失败')
      })
    } else {
      ev.preventDefault()
      ev.stopPropagation()
      ReplyVerifyCode.value = ''
      Notification.err('请输入正确的验证码')
      return false
    }
  }

  render() {
    const { platformUser, isUserLogin, verifyCode, isShowEmoji }=this.state
    const { articleReply } = this.props
    return (
      <section className='discuss-wrap'>
        <div className='discuss'>
          <form className='discuss-form' action='javascript:void(0)' method='post'
                onSubmit={ev=>this.__onAddReplyFormSubmit(ev)}>
            <section className='discuss-content'>
              <a className='avatar' href='javascript:void(0)'>
                <img
                  src={isUserLogin ? platformUser.userDetail.avatar_url : 'https://o42cskze7.qnssl.com/static/images/userAvatar/avatar-1.jpg'}
                  title={isUserLogin ? platformUser.userDetail.name : '游客'}/>
              </a>
              <div className='discuss-content-body'>
                {
                  !isUserLogin &&
                  <div className='discuss-login-mask'>
                    <p>请登录后发表评论~</p>
                    <a href='https://github.com/login/oauth/authorize?client_id=2c5d30e472a317b5c328&state=GitHub'
                       target='_blank'>
                      <i className='icon icon-github'></i>
                    </a>
                  </div>
                }
            <textarea name='message' placeholder={'欢迎指出问题~\n请不要发送无用的评论,谢谢\n暂不支持回复他人评论orz'}
                      ref='replyContent' required></textarea>

                <div className='discuss-content-toolbar'>
                  <a href='javascript:void(0)' className={isShowEmoji ? 'active' : ''}
                     onClick={ev=>this.__emojiToggle(ev)} title='插入表情'>
                    <i className='icon icon-smile-face'></i>
                  </a>
                </div>
              </div>
              <Emoji show={isShowEmoji} onClose={()=>this.__emojiOnClose()}
                     onSelect={this.__emojiOnSelected.bind(this)}></Emoji>
            </section>
            <section className='discuss-submit'>
              <div className='verify-code animation fadeIn' title='重新获取验证码'
                   onClick={ev=>this.__getReplyVerifyCode(ev)}>
                <img src={verifyCode.code ? verifyCode.base64 : ''}/>
              </div>
              <input type='text' name='verifyCode' ref='ReplyVerifyCode' autoComplete='off'
                     onFocus={ev=>this.__getReplyVerifyCode(ev)}
                     placeholder={verifyCode.code ? '请输入正确的验证码~':'点击获取验证码~'}/>
              <button type='submit'>发布</button>
            </section>
          </form>

          <div className='reply-list-wrap'>
            <ul className='reply-list'>
              {articleReply.data && articleReply.data.map((item, i)=> {
                  let userDetail = item.user && item.user.userDetail
                  let replyTime = item.time ? formatDate(new Date(item.time), 'yyyy-MM-dd hh:mm:ss') : ''
                  return (
                    <li key={i}>
                      <a href='javascript:void (0)'>
                        <img className='reply-user-avatar' src={userDetail.avatar_url}/>
                      </a>
                      <div className='reply-main'>
                        <header>
                          <b>{userDetail.name}</b>
                          评论于
                          <time dateTime={replyTime}
                                title={replyTime}>
                            {replyTime}
                          </time>
                        </header>
                        <section dangerouslySetInnerHTML={{__html: emojiDecoding(item.content)}}></section>
                      </div>
                    </li>
                  )
                }
              )}
            </ul>
          </div>
        </div>
      </section>
    )
  }
}