'use strict';

/**
 * @official
 */
import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router';

/**
 * @inject
 */
import * as actions from '../../../actions/action.blog';
import './Blog.stylus';

const mapStateToProps = state => {
  return state.Blog.toJS();
};

const mapDispatchToProps = dispatch => {
  return {
    reducerActions: bindActionCreators({...actions}, dispatch),
  };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Blog extends React.Component {
  constructor(props) {
    super(props);
    const limit = 6;
    const {location: {query}} = this.props;
    const tag = query.tag || undefined;
    const page = query.page || 1;

    this.state = {page, limit, tag};
  }

  static propTypes = {
    articleList: PropTypes.object.isRequired,
  };

  static defaultProps = {
    articleList: {
      data: [],
    },
  };

  /**
   * blog hash change listener
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    let query = nextProps.location.query;
    let nextTag = query.tag;
    let nextPage = query.page ? Number(query.page) : 1;
    let {tag, page} = this.state;

    //first into
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
    const {reducerActions} = this.props;
    window.Header.show();
    this.__fetchArticleList();
  }

  componentWillUnmount() {
    const {reducerActions} = this.props;
    reducerActions.clearBlogState();
  }

  /**
   * 获取文章列表
   * @private
   */

  __fetchArticleList() {
    const {reducerActions} = this.props;
    const {tag, limit, page} = this.state;
    reducerActions.getBlogList(page, limit, tag);
  }

  render() {
    const {tag, limit, page} = this.state;
    const {articleList} = this.props;

    const nextPageDisabled = page >= Math.ceil(articleList.count / limit);
    const prevPageDisabled = page <= 1;

    let nextPage = nextPageDisabled ? page : page + 1;
    let prevPage = prevPageDisabled ? 1 : page - 1;

    return (
      <section className="blog-list-page container">
        <div className="post">
          {articleList.data &&
            articleList.data.map((item, i) =>
              <article className="post-preview" key={i}>
                <Link to={`/blog/${item.articleId}`}>
                  <h2 className="post-title ellipsis">
                    {item.title}
                  </h2>
                  <p className="post-subtitle ellipsis">
                    {item.subTitle}
                  </p>
                  <section className="post-content-preview">
                    {item.introPreview}
                  </section>
                </Link>
                <p className="post-meta ellipsis">
                  {item.meta}
                </p>
                <hr />
              </article>,
            )}
        </div>
        <div className="pagination">
          {prevPageDisabled
            ? <span className="pagination-item disabled">older</span>
            : <Link
                className="pagination-item"
                to={`/blog?page=${prevPage}${tag ? `&tag=${tag}` : ''}`}>
                older
              </Link>}
          {nextPageDisabled
            ? <span className="pagination-item disabled">next</span>
            : <Link
                className="pagination-item"
                to={`/blog?page=${nextPage}${tag ? `&tag=${tag}` : ''}`}>
                next
              </Link>}
        </div>
      </section>
    );
  }
}
