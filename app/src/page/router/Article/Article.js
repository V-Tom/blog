'use strict';

/**
 * @official
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

/**
 * @inject
 */
import { ArticleApi } from '../../../api';
import Footer from '../../Footer';
import { throttle } from '../../../lib/utils/tools';
import Disqus from './Disqus';
import Styles from './Article.M.less';
import defaultBanner from './defaultBanner';

const documentTitleSeparator = ':)=>';

export default class ArticleDetail extends React.Component {
  constructor(props) {
    super(props);

    const scrollLimit = 0;
    const articleDetail = {};

    this.scrollListenerFn = throttle(this.__scrollListener.bind(this), 100);
    this.setAnchorTimer = null;
    this.ready = false;

    this.state = { scrollLimit, articleDetail };

    this.title = document.title;
    document.title = `loading${documentTitleSeparator}${document.title}`;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.articleId !== this.props.params.articleId) {
      this.__fetchArticleDetail(nextProps.params.id);
    }
  }

  componentDidMount() {
    const { params: { articleId } } = this.props;
    if (articleId) {
      this.__fetchArticleDetail(articleId);
    }

    /**
     * scroll
     */
    window.addEventListener('scroll', this.scrollListenerFn, false);
  }

  componentDidUpdate() {
    /**
     * 如果文档渲染完毕,而且当前state尚未ready
     */
    const content = document.querySelector(`.${Styles.content}`);
    if (
      content &&
      Array.from(content.querySelectorAll('[data-level]')).length &&
      !this.ready
    ) {
      this.setState(
        {
          scrollLimit: document.querySelector(`.${Styles.introduction}`)
            .offsetHeight,
        },
        () => {
          const { location: { hash } } = this.props;
          const { articleDetail } = this.state;

          self.setAnchorTimer = setTimeout(() => {
            document.title = articleDetail.title;

            if (hash) {
              const activeHead = document.getElementById(
                hash.substr(1, hash.length),
              );
              if (activeHead && activeHead.nodeType === 1) {
                const a = activeHead.querySelector('a');
                if (a && a.nodeType === 1) a.click();
              }
            }
          }, 150);
        },
      );
    }
  }

  componentDidCatch(error, info) {
    debugger
  }

  componentWillUnmount() {
    clearTimeout(this.setAnchorTimer);

    window.Header.show();
    window.removeEventListener('scroll', this.scrollListenerFn, false);
    document.title = this.title;
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
    window.Spinner.show();

    ArticleApi.getArticleDetail(articleId).then(({ data, views }) => {
      window.Header.hide();
      window.Spinner.hide();
      this.setState(
        { articleDetail: { ...data, ...{ views } } },
        _ => (this.ready = true),
      );
    });
  }

  render() {
    const { articleDetail } = this.state;

    if (Object.keys(articleDetails).length) {
      return [
        <main key={Date.now()} className={Styles.ArticlePage}>
          <section className={Styles.body}>
            <header
              className={Styles.introduction}
              style={{
                backgroundImage: `url("${articleDetail.introWrapper ||
                defaultBanner}")`,
              }}>
              <section className={Styles.mask}/>
              <section className={`${Styles.body} container`}>
                <ul className={Styles.tags}>
                  {articleDetail.tags.map((tag, i) =>
                    <li key={i}>
                      <Link to={`/blog?tag=${tag}`}>
                        {tag}
                      </Link>
                    </li>,
                  )}
                </ul>
                <h1 className={Styles.title}>
                  {articleDetail.title}
                </h1>
                <h2 className={Styles.subTitle}>
                  {articleDetail.subTitle}
                </h2>
                <p className={Styles.meta}>
                  {articleDetail.meta} 访客：{articleDetail.views}
                </p>
              </section>
            </header>
            <article
              className={`markdown container ${Styles.content}`}
              dangerouslySetInnerHTML={{ __html: Marked(articleDetail.content) }}
            />
            <Disqus/>
          </section>
        </main>,
        <Footer key="footer"/>,
      ];
    } else {
      return null;
    }
  }
}
