'use strict';
import React, {Component, PropTypes}from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import * as actions from '../../actions/ArticleDetail.action'
import prism from '../../libs/markdown/prism'

import './articleDetail.stylus'
import '../../style/markdown/markdown.stylus'
import '../../style/markdown/prism.stylus'


import ScrollSpy from '../ScrollSpy'
import Discuss from '../Discuss'

const mapStateToProps = state=> {
    return state.Article.toJS();
};

const mapDispatchToProps = dispatch=> {
    return {
        actions: bindActionCreators(Object.assign(actions), dispatch)
    }
};

@connect(mapStateToProps, mapDispatchToProps)

export default class ArticleDetail extends Component {
    constructor(props) {
        super(props);


        let ready = false;
        let scrollLimit = 0;
        let scrollListener = ()=> {
        };
        this.state = {ready, scrollListener, scrollLimit};
        this.state.scrollListener = this.__scrollListener();
    }

    static PropTypes = {
        articleDetail: PropTypes.object.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.articleId !== this.props.params.articleId) {
            this.__fetchArticleDetail(nextProps.params.id);
        }
    };

    componentDidMount() {
        const {actions, params: {articleId}} = this.props;
        if (articleId) {
            this.__fetchArticleDetail(articleId)
        }
        actions.hideHeader();
        this.__setScrollLimit();
        window.addEventListener('scroll', this.state.scrollListener, false);
    }

    componentWillUnmount() {
        this.props.actions.clearArticleDetailState();
        window.removeEventListener('scroll', this.state.scrollListener, false);
    }

    componentDidUpdate() {
        //如果文档渲染完毕,而且当前state尚未ready
        if (Array.from(document.querySelector('.article-content').querySelectorAll('[data-level]')).length && !this.state.ready) {
            const {actions}=this.props;
            actions.setArticleReady();
            Prism && Prism.highlightAll(false);
            this.__setScrollLimit();
            this.setState({
                ready: true
            });
        }

    }

    __setScrollLimit() {
        const {actions}=this.props;
        let scrollLimit = document.querySelector('.article-content-wrapper>header').offsetHeight;
        this.state.scrollLimit = scrollLimit;
        actions.setHeaderScrollLimit(scrollLimit);
    }

    __scrollListener() {
        return function () {
            const {actions}=this.props;
            let {scrollLimit}=this.state;
            setTimeout(()=> {
                let currentOffset = Math.max(window.pageYOffset || 0, document.documentElement.scrollTop || document.body.scrollTop);
                let isHideHeader = Array.from(document.querySelector('.App_header').classList).indexOf('active') !== -1;
                if (scrollLimit >= currentOffset + 55) {
                    !isHideHeader && actions.hideHeader();
                } else {
                    isHideHeader && actions.showHeader();
                }
            }, 50)
        }.bind(this)
    }

    __fetchArticleDetail(articleId) {
        const {actions} = this.props;
        actions.getArticleDetail(articleId);
    }

    __toggleArticleSideBar(ev, isOpen) {
        const {actions, openArticleSideBar} = this.props;
        if (!openArticleSideBar) {
            isOpen && actions.toggleArticleSideBar();
        } else {
            !isOpen && actions.toggleArticleSideBar();
        }
    }

    render() {
        const {articleDetail, articleDetailReady, openArticleSideBar, params: {articleId}}=this.props;
        let articleDetailSectionClass = openArticleSideBar ? "blog-detail-page active" : "blog-detail-page";
        let activeButtonClass = articleDetailReady ? "article-side-btn active" : "article-side-btn";
        if (articleDetailReady) {
            articleDetailSectionClass += " ready";
        }
        return (
            <section className={articleDetailSectionClass}>
                <div className={activeButtonClass}>
                    <button type="button" className="article-menu" title="article menu"
                            onClick={ev=>this.__toggleArticleSideBar(ev,true)}
                            onTouchEnd={ev=>this.__toggleArticleSideBar(ev,true)}></button>
                </div>

                <div className="article-sidebar">
                    <section className="article-sidebar-inner">
                        <ScrollSpy ready={articleDetailReady} container={".article-content"}
                                   query={"[data-level]"}></ScrollSpy>
                    </section>
                </div>
                <div className="article-content-wrapper" onClick={ev=>this.__toggleArticleSideBar(ev,false)}
                     onTouchEnd={ev=>this.__toggleArticleSideBar(ev,false)}>
                    <header className="article-intro-container"
                            style={{backgroundImage:'url(' + (articleDetail.intro && articleDetail.intro.pic) + ')'}}>
                        <section className="article-intro-mask"></section>
                        <section className="article-intro-body container">
                            <ul className="tags">
                                {
                                    articleDetail.tags.map((item, i)=>
                                        <li key={i}><Link to={`/blog?tag=${item}`}>{item}</Link></li>
                                    )
                                }
                            </ul>
                            <h1 className="article-title">{articleDetail.title}</h1>
                            <h2 className="article-subheading">{articleDetail.subTitle}</h2>
                            <p className="article-meta">{articleDetail.meta}</p>
                        </section>
                    </header>
                    <div className="markdown-wrapper">
                        <article className="markdown container article-content"
                                 dangerouslySetInnerHTML={{__html: articleDetail.content}}></article>
                    </div>
                    <Discuss ready={articleDetailReady} articleId={articleId}></Discuss>
                </div>
            </section>
        )
    }
}