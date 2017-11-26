'use strict';

/**
 * @official
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';

/**
 * @inject
 */
import Styles from './Blog.M.less';
import {BlogApi} from '../../../api';
import Footer from '../../Footer';

export default class Blog extends React.PureComponent {
  constructor(props) {
    super(props);

    const limit = 6;
    const {location: {query}} = this.props;

    const tag = query.tag || undefined;
    const page = query.page || 1;
    const articleList = [];

    this.state = {page, limit, tag, articleList};
  }

  /**
   * blog hash change listener
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    const query = nextProps.location.query;
    const nextTag = query.tag;
    const nextPage = query.page ? Number(query.page) : 1;
    let {tag, page} = this.state;

    /**
     * first into
     * @type {number}
     */
    page = Number(page);
    isNaN(page) && (page = 0);

    if (
      !isNaN(nextPage) &&
      (nextTag || nextPage) &&
      (nextTag !== tag || nextPage !== page)
    ) {
      this.setState(
        {
          tag: nextTag ? (nextTag && nextTag !== tag ? nextTag : tag) : nextTag,
          page: nextPage && nextPage !== page ? nextPage : page,
        },
        () => {
          this.__fetchArticleList();
        },
      );
    }
  }

  componentWillMount() {}

  componentDidMount() {
    window.Header.show();
    this.__fetchArticleList();
  }

  componentWillUnmount() {}

  /**
   * 获取文章列表
   * @private
   */

  __fetchArticleList() {
    const {tag, limit, page} = this.state;

    window.Spinner.show();
    window.Header.show();

    BlogApi.getBlogList(page, limit, tag).then(({data}) => {
      window.Spinner.hide();
      this.setState({articleList: data});
    });
  }

  render() {
    const {tag, limit, page, articleList} = this.state;

    const nextPageDisabled = page >= Math.ceil(articleList.count / limit);
    const prevPageDisabled = page <= 1;

    let nextPage = nextPageDisabled ? page : page + 1;
    let prevPage = prevPageDisabled ? 1 : page - 1;

    if (articleList.length > 0) {
      return [
        <main key={Date.now()} className={Styles.BlogPage}>
          <div className={`${Styles.post} container`}>
            {articleList &&
              articleList.map((item, i) =>
                <article className={Styles.body} key={i}>
                  <Link to={`/blog/${item.articleId}`}>
                    <h2 className={Styles.title}>
                      {item.title}
                    </h2>
                    <p className={Styles.subtitle}>
                      {item.subTitle}
                    </p>
                    <section className={Styles.preview}>
                      {item.introPreview}
                    </section>
                  </Link>
                  <p className={Styles.meta}>
                    {item.meta}
                  </p>
                  <hr />
                </article>,
              )}
          </div>
          <div className={Styles.pagination}>
            {prevPageDisabled
              ? <span className={`${Styles.item} ${Styles.disabled}`}>
                  older
                </span>
              : <Link
                  className={Styles.item}
                  to={`/blog?page=${prevPage}${tag ? `&tag=${tag}` : ''}`}>
                  older
                </Link>}
            {nextPageDisabled
              ? <span className={`${Styles.item} ${Styles.disabled}`}>
                  {' '}next{' '}
                </span>
              : <Link
                  className={Styles.item}
                  to={`/blog?page=${nextPage}${tag ? `&tag=${tag}` : ''}`}>
                  next
                </Link>}
          </div>
        </main>,
        <Footer key="footer" />,
      ];
    } else {
      return null;
    }
  }
}
