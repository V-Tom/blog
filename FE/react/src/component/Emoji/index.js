'use strict';
import React ,{Component,PropTypes }from 'react'

import './emoji.stylus'

export default class Emoji extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "贱萌的emoji表情",
            emojiData: ["smile", "grinning", "smiley", "blush", "relaxed", "wink", "heart-eyes", "kissing-heart", "kissing", "grin", "pensive", "unamused", "flushed", "relieved", "cry", "scream", "angry", "mask", "tired-face", "sleeping", "hushed", "hushed", "good", "bad", "two-men-holding-hands", "heart", "broken-heart", "gun"]
        };
    }

    static PropTypes = {
        show: PropTypes.bool.isRequired,
        onSelect: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired
    };

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {

    }

    render() {
        const {show,onSelect,onClose}=this.props;
        const {title,emojiData}=this.state;
        if (show) {
            return (
                <div className="emoji-face-container">
                    <a className="close" href="javascript:void(0)" onClick={ev=>onClose(ev)} title="close"></a>
                    <section className="emoji-face-title">{title}</section>
                    <section className="emoji-face-list clear animation fadeIn" onClick={ev=>onSelect(ev)}>
                        {
                            emojiData.map((item, i)=>
                                <a href="javascript:void (0)" title={item} key={i}>
                                    <i className={`emoji-face emoji-${item}`} title={item}></i>
                                </a>
                            )
                        }
                    </section>
                </div>
            )
        } else {
            return null;
        }
    }
}