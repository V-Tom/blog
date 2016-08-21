'use strict'
import React, { Component, PropTypes }from 'react'
import Update from 'react-addons-update'
import Notification from '../Notification'
import './discuss.stylus'
import { ReplyApi } from '../../api'
import DiscussList from './discuss.list'
import DiscussBox from './discuss.box'

export default class Discuss extends Component {
  constructor(props) {
    super(props)

    let discussBoxReady = false
    let articleId = undefined
    let articleDbId = undefined
    let replyList = []
    let page = 1
    let limit = 10
    this.state = { discussBoxReady, articleId, replyList, page, limit, articleDbId }
  }

  static propTypes = {
    ready: PropTypes.bool.isRequired,
    articleId: PropTypes.string.isRequired,
    articleDbId: PropTypes.string.isRequired
  }

  componentWillReceiveProps(nextProps) {
    const { articleId, ready, articleDbId }=nextProps
    const { discussBoxReady }=this.state
    if (!discussBoxReady && ready && articleId) {
      this.setState({
        articleId,
        articleDbId
      }, ()=> {
        this.__fetchReplyList()
      })
    }
  }

  componentDidMount() {

  }

  __fetchReplyList() {
    const { articleId, page, limit }=this.state
    return ReplyApi.getReply(articleId, page, limit)
      .then(replyList=> {
        let newState = Update(this.state, {
          "replyList": { "$set": replyList.data },
          "discussBoxReady": { "$set": true }
        })
        this.setState(newState)
      }).catch(e=> {
        e.interceptor && Notification.err("啊偶~读取用户评论失败~")

      })
  }

  __onNewReplyAdded() {
    this.__fetchReplyList()
  }

  render() {
    const { ready }=this.props
    const { replyList, articleId, articleDbId } =this.state
    if (ready) {
      return (
        <section className="discuss-wrap">
          <div className="discuss">
            <DiscussBox articleId={articleId} articleDbId={articleDbId} ready={ready}
                        newReplyAdded={()=>this.__onNewReplyAdded()}></DiscussBox>
            <DiscussList ready={ready} replyList={replyList}></DiscussList>
          </div>
        </section>
      )
    } else {
      return false
    }

  }
}