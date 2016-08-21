'use strict'
import React, { Component, PropTypes }from 'react'
import Update from 'react-addons-update'

import './discuss.box.stylus'

import { ToolsApi, ReplyApi } from '../../api'
import Emoji from '../Emoji'
import { closest } from '../../libs/utils/dom'
import { escapeHtml, formatDate, emojiDecoding } from '../../libs/utils/tools'
import Notification from '../Notification'

export default class DiscussBox extends Component {
  constructor(props) {
    super(props)

    let userAvatarUrl = "https://o42cskze7.qnssl.com/static/images/userAvatar/avatar-1.jpg"
    let userName = "游客"
    let isUserLogin = false
    if (window.sessionStorage.getItem("NomandWebsiteLogin")) {
      userAvatarUrl = window.sessionStorage.getItem("userAvatarUrl")
      userName = window.sessionStorage.getItem("userName")
      isUserLogin = true
    }

    this.state = {
      "discussBoxReady": false,
      "articleId": null,
      "isUserLogin": isUserLogin,
      "contentPlaceholder": "欢迎指出问题~\n请不要发送无用的评论,谢谢\n暂不支持回复他人评论orz",
      "verifyCodePlaceholder": "点击获取验证码~",
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
    let codeUserInput = ev.target.querySelector('input[name="verifyCode"]')
    if (codeUserInput.value.toLowerCase() !== code.toLowerCase()) {

      let discuss = Object.assign({}, this.state.discuss)

      const { newReplyAdded }=this.props
      ReplyApi.addReply(discuss)
        .then(()=> {
          newReplyAdded()
        }).catch(e=> {

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
    window.open(`https://github.com/login/oauth/authorize?client_id=${clientId}&state=GitHub`, '登录~', "height=500, width=500, top=0, left=0,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=n o, status=no")
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
    const self = this
    let { verifyCode:{ timeShown, code, base64 } }=self.state
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
          let newState = Update(self.state, {
            verifyCode: {
              code: { "$set": data.code },
              base64: { "$set": data.base64 },
              timeShown: { "$set": new Date().getTime() }
            }
          })
          self.setState(newState)
        }
      }).catch(e=> {

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
      let textarea = closest(ev.target, '.emoji-face-container')

      if (textarea) {
        textarea = textarea.previousElementSibling.querySelector('textarea')
        let startPos = textarea.selectionStart, endPos = textarea.selectionEnd,
          currentPos = startPos, content = textarea.value || ""
        currentPos += emojiTitle.length

        //set state and update SelectionRange
        setTimeout(function () {
          textarea.selectionStart = textarea.selectionEnd = currentPos
          let newState = Update(this.state, {
            isShowEmoji: {
              "$set": false
            },
            discuss: {
              content: {
                "$set": content.substring(0, startPos) + emojiTitle + content.substring(endPos, content.length)
              }
            }
          })

          this.setState(newState)
          startPos += emojiTitle.length

          if (textarea.createTextRange) {
            let range = textarea.createTextRange
            range.move('character', startPos)
            range.select()
          } else {
            if (textarea.selectionStart) {
              textarea.focus()
              textarea.setSelectionRange(startPos, startPos)
            } else {
              textarea.focus()
              alert("WTF?你使用的什么破浏览器，赶紧换掉")
            }
          }

        }.bind(this), 0)

      }
    } else {
      alert("找不到当前title")
    }
  }

  __emojiOnClose(ev) {
    this.setState({
      "isShowEmoji": false
    })
  }

  __textAreaKeyUp(ev) {
    let newState = Update(this.state, {
      discuss: {
        content: {
          "$set": ev.target.value
        }
      }
    })
    this.setState(newState)
  }

  render() {
    const { discuss, verifyCode, isUserLogin, isShowEmoji, contentPlaceholder, discuss:{ content } }=this.state
    let emojiButtonClass = isShowEmoji ? 'active' : ""
    return (
      <form className="discuss-form" action="javascript:void(0)" method="post" onSubmit={ev=>this.__submit(ev)}>
        <section className="discuss-content">
          <a className="avatar" href="javascript:void(0)">
            <img src='https://o42cskze7.qnssl.com/static/images/userAvatar/avatar-1.jpg'/>
          </a>
          <div className="discuss-content-body">
            {
              isUserLogin &&
              <div className="discuss-login-mask">
                <p>请登录后发表评论~</p>
                <a href="javascript:void (0)" onClick={ev=>this.__login(ev)}>
                  <i className="icon icon-github"></i>
                </a>
              </div>
            }
        <textarea name="message" value={content} onChange={ev=>this.__textAreaKeyUp(ev)}
                  placeholder={contentPlaceholder} required></textarea>

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
            <img src={verifyCode.base64}/>
          </div>
          <input type="text" name="verifyCode" autoComplete="off"
                 onFocus={ev=>this.__getVerifyCode(ev)}
                 placeholder="请输入正确的验证码~"/>
          <button type="submit">发布</button>
        </section>
      </form>
    )
  }
}