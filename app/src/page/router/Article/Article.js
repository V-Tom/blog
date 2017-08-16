'use strict';

/**
 * @official
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

/**
 * @inject
 */
import * as actions from '../../../actions/action.Article';
import { debounce } from '../../../lib/utils/tools';
import Disqus from './Disqus';
import ScrollSpy from '../../../component/ScrollSpy';
import './Article.stylus';

const mapStateToProps = state => {
  return state.Article.toJS();
};

const mapDispatchToProps = dispatch => {
  return {
    reducerActions: bindActionCreators({ ...actions }, dispatch),
  };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ArticleDetail extends React.Component {
  constructor(props) {
    super(props);
    const articleDetailReady = false;
    const scrollLimit = 0;
    const openArticleSideBar = false;
    const documentTitleSeparator = ':)=>';

    this.$container = undefined;
    this.state = { articleDetailReady, scrollLimit, openArticleSideBar };

    this.scrollListenerFn = debounce(this.__scrollListener.bind(this), 100);
    this.documentTitleSeparator = documentTitleSeparator;
    this.titleScrollerTimer = null
    document.title = `loading${documentTitleSeparator}${document.title}`;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.articleId !== this.props.params.articleId) {
      this.__fetchArticleDetail(nextProps.params.id);
    }
  }

  componentDidMount() {
    const { reducerActions, params: { articleId } } = this.props;
    if (articleId) {
      this.__fetchArticleDetail(articleId);
    }
    window.Header.hide();
    window.addEventListener('scroll', this.scrollListenerFn, false);
  }

  componentDidUpdate() {
    //如果文档渲染完毕,而且当前state尚未ready
    if (
      Array.from(
        document
          .querySelector('.article-content')
          .querySelectorAll('[data-level]'),
      ).length &&
      !this.state.articleDetailReady
    ) {
      Prism && Prism.highlightAll(false);
      this.__setScrollLimit();
      this.setState(
        {
          articleDetailReady: true,
        },
        () => {

          const { articleDetail } = this.props;
          document.title = `${articleDetail.title}${this
            .documentTitleSeparator}${document.title.split(
            this.documentTitleSeparator,
          )[1]}`

          this.titleScrollerTimer = setInterval(() => {
            document.title = document.title.substr(1) + document.title.substr(0, 1)
          }, 500)

        },
      );
    }
  }

  componentWillUnmount() {
    this.props.reducerActions.clearArticleDetailState();
    window.Header.show();
    window.removeEventListener('scroll', this.scrollListenerFn, false);
    clearInterval(this.titleScrollerTimer)
    document.title = document.title.split(this.documentTitleSeparator)[1];
  }

  __setScrollLimit() {
    const { reducerActions } = this.props;
    this.state.scrollLimit = document.querySelector(
      '.article-content-wrapper>header',
    ).offsetHeight;
  }

  /**
   * window scroll 事件监听
   * @returns {function(this:ArticleDetail)}
   * @private
   */
  __scrollListener() {
    const { scrollLimit } = this.state;

    let currentOffset = Math.max(
      window.pageYOffset || 0,
      document.documentElement.scrollTop || document.body.scrollTop,
    );
    let isHeaderActive = window.Header.isActive();

    if (scrollLimit >= currentOffset + 55) {
      isHeaderActive && window.Header.hide();
    } else {
      !isHeaderActive && window.Header.show();
    }
  }

  /**
   * 获取文章详情
   * @param articleId
   * @returns {*}
   * @private
   */
  __fetchArticleDetail(articleId) {
    const { reducerActions } = this.props;
    return reducerActions.getArticleDetail(articleId);
  }

  /**
   * 设置按钮
   * @param isOpen
   * @private
   */
  __toggleArticleSideBar(isOpen) {
    if (this.state.openArticleSideBar) {
      !isOpen && this.setState({ openArticleSideBar: false });
    } else {
      isOpen && this.setState({ openArticleSideBar: true });
    }
  }

  render() {
    const { articleDetail, params: { articleId } } = this.props;
    const { articleDetailReady, openArticleSideBar } = this.state;

    const articleDetailSectionClass = cx('blog-detail', {
      active: openArticleSideBar,
      ready: articleDetailSectionClass,
    });

    const activeButtonClass = cx('article-side-btn', {
      active: articleDetailReady,
    });

    return (
      <main
        className={articleDetailSectionClass}
        ref={$dom => (this.$container = $dom)}>
        <div className={activeButtonClass}>
          <button
            type="button"
            className="article-menu"
            title="article menu"
            onClick={() => this.__toggleArticleSideBar(true)}
          />
        </div>

        <div className="article-sidebar">
          <section className="article-sidebar-inner">
            <ScrollSpy
              ready={articleDetailReady}
              $container={this.$container}
            />
          </section>
        </div>
        <div
          className="article-content-wrapper"
          onClick={() => this.__toggleArticleSideBar(false)}>
          <header
            className="article-intro-container"
            style={{ backgroundImage: `url("${articleDetail.introWrapper}")` }}>
            <section className="article-intro-mask"/>
            <section className="article-intro-body container">
              <ul className="tags">
                {articleDetail.tags.map((tag, i) =>
                  <li key={i}>
                    <Link to={`/blog?tag=${tag}`}>
                      {tag}
                    </Link>
                  </li>,
                )}
              </ul>
              <h1 className="article-title">
                {articleDetail.title}
              </h1>
              <h2 className="article-subTitle">
                {articleDetail.subTitle}
              </h2>
              <p className="article-meta">
                {articleDetail.meta}
              </p>
            </section>
          </header>
          <div className="markdown-wrapper">
            <article
              className="markdown container article-content"
              dangerouslySetInnerHTML={{ __html: articleDetail.content }}
            />
          </div>
          {articleDetailReady && <Disqus/>}
        </div>
      </main>
    );
  }
}
