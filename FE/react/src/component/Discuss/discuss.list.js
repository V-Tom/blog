'use strict';
import React ,{Component,PropTypes }from 'react'

import {emojiDecoding} from '../../libs/utils/tools'

import './discuss.list.stylus'

export default class DiscussList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            replyListReady: false
        };
    }

    static PropTypes = {
        replyList: PropTypes.object.isRequired,
        ready:PropTypes.bool.isRequired
    };

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {

    }


    render() {
        const {replyList,ready}=this.props;
        const {replyListReady}=this.state;
        if(ready){
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
                    {replyList.map((item, i)=>
                        <li key={i}>
                            <a href="javascript:void (0)">
                                <img className="reply-user-avatar" src={item.replyUser.avatar}/>
                            </a>
                            <div className="reply-main">
                                <header>
                                    <b>{item.replyUser.name}</b>
                                    评论于
                                    <time datetime={item.replyUser.time.UTCTime}
                                          title={item.replyUser.time.localTime}>
                                        {item.replyUser.time.localTime}
                                    </time>
                                </header>
                                <section dangerouslySetInnerHTML={{__html: emojiDecoding(item.replyUser.content)}}></section>
                            </div>
                        </li>
                    )}
                </ul>
            </div>)
    }else {
        return null;
        }
    }
}