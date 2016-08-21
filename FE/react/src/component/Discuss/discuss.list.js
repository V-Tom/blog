'use strict';
import React, { Component, PropTypes }from 'react'

import { emojiDecoding, formatDate } from '../../libs/utils/tools'

import './discuss.list.stylus'

export default class DiscussList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      replyListReady: false
    };
  }

  static propTypes = {
    replyList: PropTypes.array.isRequired,
    ready: PropTypes.bool.isRequired
  };

  componentWillReceiveProps(nextProps) {

  }

  componentDidMount() {

  }


  render() {
    const { replyList, ready }=this.props;
    const { replyListReady }=this.state;
    if (ready) {
      return (
        <div className="reply-list-wrap">
          {
            (()=> {
              if (replyListReady) {
                return <div className="reply-loading">
                  <div className="reply-loading-spinner ani-spinner"></div>
                </div>
              }
            })()
          }
          <ul className="reply-list">
            {replyList.map((item, i)=> {
                let userDetail = item.user && item.user.userDetail
                let replyTime = item.time ? formatDate(new Date(item.time), 'yyyy-MM-dd hh:mm:ss') : ''
                return (
                  <li key={i}>
                    <a href="javascript:void (0)">
                      <img className="reply-user-avatar" src={userDetail.avatar_url}/>
                    </a>
                    <div className="reply-main">
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
        </div>)
    } else {
      return null;
    }
  }
}