'use strict'
import React, { Component, PropTypes }from 'react'
import Update from 'react-addons-update'

import './discuss.box.stylus'

import { ToolsApi, ReplyApi } from '../../../api'
import Emoji from '../../Emoji'
import { escapeHtml, formatDate, emojiDecoding } from '../../../libs/utils/tools'
import Notification from '../../Notification'

export default class DiscussBox extends Component {
  constructor(props) {
    super(props)

    let isUserLogin = false, platformUser = window.sessionStorage.getItem("platformUser")

    if (platformUser) {
      try {
        platformUser = JSON.parse(platformUser)
        isUserLogin = true
        this.platformUser = platformUser
      } catch ( e ) {
        isUserLogin = false
      }
    }
    this.state = {
      "discussBoxReady": false,
      isUserLogin,
      platformUser,
      "articleId": null,
      "isShowEmoji": false,
      "verifyCode": {
        "code": '',
        "base64": null,
        "timeShown": null
      },
      "discuss": {
        "articleDbId": null,
        "user": null,
        "articleId": null,
        "content": "",
        "replyTo": null
      }
    }
  }

  static propTypes = {
    newReplyAdded: PropTypes.func.isRequired,
    articleId: PropTypes.string.isRequired,
    ready: PropTypes.bool.isRequired
  }

  componentWillReceiveProps(nextProps) {
    const { articleId, ready, articleDbId }=nextProps
    const { discussBoxReady }=this.state
    if (!discussBoxReady && ready && articleId) {
      let newState = Update(this.state, {
        "discussBoxReady": { "$set": true },
        "articleId": { "$set": articleId },
        "discuss": { "articleId": { "$set": articleId }, "articleDbId": { '$set': articleDbId } }
      })
      this.setState(newState)
    }
  }

  componentDidMount() {

  }

  /**
   * 提交评论
   * @param ev
   * @returns {boolean}
   * @private
   */
  __submit(ev) {
    const { verifyCode:{ code } }=this.state
    if (!code) {
      ev.preventDefault()
      ev.stopPropagation()
      Notification.info("请输入验证码~", ()=> {
        this.__getVerifyCode()
      })
      return false
    }
    let { replyContent, ReplyVerifyCode } = this.refs
    if (ReplyVerifyCode.value.toLowerCase() !== code.toLowerCase()) {
      let discuss = Object.assign({}, this.state.discuss, { content: replyContent.value })

      const { newReplyAdded }=this.props
      ReplyApi.addReply(discuss)
        .then(()=> {
          Notification.success('添加评论成功', ()=> {
            ReplyVerifyCode.value = ''
            replyContent.value = ''
            newReplyAdded()
          })
        }).catch(e=> {
        Notification.err('添加评论失败')
      })
    } else {
      ev.preventDefault()
      ev.stopPropagation()
      Notification.err("请输入正确的验证码", ()=> {
        codeUserInput.value = ""
      })
      return false
    }
  }

  __login() {
    let clientId = "2c5d30e472a317b5c328"
    window.open(`https://github.com/login/oauth/authorize?client_id=2c5d30e472a317b5c328&state=GitHub`, '登录~', "height=500, width=500, top=0, left=0,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=n o, status=no")
  }

  __emojiToggle(ev) {
    const { isShowEmoji }=this.state
    this.setState({
      "isShowEmoji": !isShowEmoji
    })
  }

  /**
   * 获取验证码
   * @param ev
   * @returns {boolean}
   * @private
   */
  __getVerifyCode(ev) {
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

      if (timeShown && (new Date().getTime() - timeShown <= 10000)) {
        Notification.info("获取验证码10s一次哦~")
        return false
      }
    }
    ToolsApi.getVerifyCode()
      .then(code=> {
        if (code && code.data) {
          let data = code.data
          let newState = Update(this.state, {
            verifyCode: {
              code: { "$set": data.code },
              base64: { "$set": data.base64 },
              timeShown: { "$set": new Date().getTime() }
            }
          })
          this.setState(newState)
        }
      }).catch(e=> {
      e.interceptor && Notification.err(`${e.msg}:你需要重新登录`)
    })
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
          currentPos = startPos, content = textarea.value || ""
        currentPos += emojiTitle.length

        //set state and update SelectionRange
        textarea.selectionStart = textarea.selectionEnd = currentPos
        let newState = Update(this.state, {
          isShowEmoji: {
            "$set": false
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
              alert("WTF?你使用的什么破浏览器，赶紧换掉")
            }
          }
        })
      }
    }
  }

  __emojiOnClose(ev) {
    this.setState({
      "isShowEmoji": false
    })
  }


  render() {
    const { verifyCode, isUserLogin, platformUser, isShowEmoji }=this.state
    let emojiButtonClass = isShowEmoji ? 'active' : ""
    return (
      <form className="discuss-form" action="javascript:void(0)" method="post" onSubmit={ev=>this.__submit(ev)}>
        <section className="discuss-content">
          <a className="avatar" href="javascript:void(0)">
            <img
              src={isUserLogin ? platformUser.user.avatar_url : 'https://o42cskze7.qnssl.com/static/images/userAvatar/avatar-1.jpg'}
              title={isUserLogin ? platformUser.user.name : '游客'}/>
          </a>
          <div className="discuss-content-body">
            {
              !isUserLogin &&
              <div className="discuss-login-mask">
                <p>请登录后发表评论~</p>
                <a href="https://github.com/login/oauth/authorize?client_id=2c5d30e472a317b5c328&state=GitHub"
                   target="_blank">
                  <i className="icon icon-github"></i>
                </a>
              </div>
            }
            <textarea name="message" placeholder={"欢迎指出问题~\n请不要发送无用的评论,谢谢\n暂不支持回复他人评论orz"}
                      ref="replyContent" required></textarea>

            <div className="discuss-content-toolbar">
              <a href="javascript:void(0)" className={emojiButtonClass}
                 onClick={ev=>this.__emojiToggle(ev)} title="插入表情">
                <i className="icon icon-smile-face"></i>
              </a>
            </div>
          </div>
          <Emoji show={isShowEmoji} onClose={this.__emojiOnClose.bind(this)}
                 onSelect={this.__emojiOnSelected.bind(this)}></Emoji>
        </section>
        <section className="discuss-submit">
          <div className="verify-code animation fadeIn" title="重新获取验证码"
               onClick={ev=>this.__getVerifyCode(ev)}>
            <img src={verifyCode.code ? verifyCode.base64 : ''}/>
          </div>
          <input type="text" name="verifyCode" ref="ReplyVerifyCode" autoComplete="off"
                 onFocus={ev=>this.__getVerifyCode(ev)}
                 placeholder={verifyCode.code ? '请输入正确的验证码~':'点击获取验证码~'}/>
          <button type="submit">发布</button>
        </section>
      </form>
    )
  }
}