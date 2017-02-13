'use strict'
import React, { Component, PropTypes }from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as actions from '../../../actions/action.ArticleDetail'
import Disqus from './Disqus'
import prism from '../../../libs/markdown/prism'

import './articleDetail.stylus'
import '../../../stylus/markdown/markdown.stylus'
import '../../../stylus/markdown/prism.stylus'


import ScrollSpy from '../../../component/ScrollSpy'
// import Discuss from './Discuss'

const mapStateToProps = state=> {
  return state.Article.toJS()
}

const mapDispatchToProps = dispatch=> {
  return {
    reducerActions: bindActionCreators(Object.assign({}, actions), dispatch)
  }
}

@connect(mapStateToProps, mapDispatchToProps)

export default class ArticleDetail extends Component {
  constructor(props) {
    super(props)


    let articleDetailReady = false
    let scrollLimit = 0
    const openArticleSideBar = false
    const documentTitleSeparator = ':)=>'
    let scrollListener = ()=> {
    }
    this.state = { articleDetailReady, scrollListener, scrollLimit, openArticleSideBar }
    this.state.scrollListener = this.__scrollListener()
    this.documentTitleSeparator = documentTitleSeparator
    document.title = `loading${documentTitleSeparator}${document.title}`
  }

  static propTypes = {
    articleDetail: PropTypes.object.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.articleId !== this.props.params.articleId) {
      this.__fetchArticleDetail(nextProps.params.id)
    }
  }

  componentDidMount() {
    const { reducerActions, params: { articleId } } = this.props
    if (articleId) {
      this.__fetchArticleDetail(articleId)
    }
    reducerActions.hideHeader()
    window.addEventListener('scroll', this.state.scrollListener, false)
  }

  componentWillUnmount() {
    this.props.reducerActions.clearArticleDetailState()
    this.props.reducerActions.showHeader()
    window.removeEventListener('scroll', this.state.scrollListener, false)
    document.title = document.title.split(this.documentTitleSeparator)[1]
  }

  componentDidUpdate() {
    //如果文档渲染完毕,而且当前state尚未ready
    if (Array.from(document.querySelector('.article-content').querySelectorAll('[data-level]')).length && !this.state.articleDetailReady) {
      Prism && Prism.highlightAll(false)
      this.__setScrollLimit()
      this.setState({
        articleDetailReady: true
      }, ()=> {
        const { articleDetail } = this.props
        document.title = `${articleDetail.title}${this.documentTitleSeparator}${document.title.split(this.documentTitleSeparator)[1]}`
      })
    }

  }

  __setScrollLimit() {
    const { reducerActions }=this.props
    let scrollLimit = document.querySelector('.article-content-wrapper>header').offsetHeight
    this.state.scrollLimit = scrollLimit
    reducerActions.setHeaderScrollLimit(scrollLimit)
  }

  /**
   * window scroll 事件监听
   * @returns {function(this:ArticleDetail)}
   * @private
   */
  __scrollListener() {
    return function () {
      const { reducerActions }=this.props
      let { scrollLimit }=this.state
      setTimeout(()=> {
        let currentOffset = Math.max(window.pageYOffset || 0, document.documentElement.scrollTop || document.body.scrollTop)
        let isHideHeader = Array.from(document.querySelector('.App_header').classList).indexOf('active') !== -1
        if (scrollLimit >= currentOffset + 55) {
          !isHideHeader && reducerActions.hideHeader()
        } else {
          isHideHeader && reducerActions.showHeader()
        }
      }, 50)
    }.bind(this)
  }

  /**
   * 获取文章详情
   * @param articleId
   * @returns {*}
   * @private
   */
  __fetchArticleDetail(articleId) {
    const { reducerActions } = this.props
    return reducerActions.getArticleDetail(articleId)
  }

  /**
   * 设置按钮
   * @param isOpen
   * @private
   */
  __toggleArticleSideBar(isOpen) {
    if (this.state.openArticleSideBar) {
      !isOpen && this.setState({ openArticleSideBar: false })
    } else {
      isOpen && this.setState({ openArticleSideBar: true })
    }
  }

  render() {
    const { articleDetail, params: { articleId } }=this.props
    const { articleDetailReady, openArticleSideBar } = this.state
    let articleDetailSectionClass = openArticleSideBar ? "blog-detail-page active" : "blog-detail-page"
    let activeButtonClass = articleDetailReady ? "article-side-btn active" : "article-side-btn"
    if (articleDetailReady) {
      articleDetailSectionClass += " ready"
    }
    return (
      <section className={articleDetailSectionClass}>
        <div className={activeButtonClass}>
          <button type="button" className="article-menu" title="article menu"
                  onClick={()=>this.__toggleArticleSideBar(true)}></button>
        </div>

        <div className="article-sidebar">
          <section className="article-sidebar-inner">
            <ScrollSpy ready={articleDetailReady} container={".article-content"}
                       query={"[data-level]"}></ScrollSpy>
          </section>
        </div>
        <div className="article-content-wrapper" onClick={()=>this.__toggleArticleSideBar(false)}>
          <header className="article-intro-container"
                  style={{ backgroundImage: `url("${articleDetail.introWrapper}")` }}>
            <section
              className="article-intro-mask">
            </section>
            <section className="article-intro-body container">
              <ul className="tags">
                {
                  articleDetail.tags.map((item, i)=>
                    <li key={i}><Link to={`/blog?tag=${item}`}>{item}</Link></li>
                  )
                }
              </ul>
              <h1 className="article-title">{articleDetail.title}</h1>
              <h2 className="article-subTitle">{articleDetail.subTitle}</h2>
              <p className="article-meta">{articleDetail.meta}</p>
            </section>
          </header>
          <div className="markdown-wrapper">
            <article
              className="markdown container article-content"
              dangerouslySetInnerHTML={{ __html: articleDetail.content }}>
            </article>
          </div>
          {
            /**
             * articleDetailReady && <Discuss articleId={articleId} articleDbId={articleDetail._id}/>
             */
          }
          {articleDetailReady && <Disqus/>}
        </div>
      </section>
    )
  }
}
