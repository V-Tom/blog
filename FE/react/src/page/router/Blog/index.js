import React, { Component, PropTypes }from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as actions from '../../../actions/action.Blog'

import './blog.stylus'

const mapStateToProps = state=> {
  return state.Blog.toJS();
};

const mapDispatchToProps = dispatch=> {
  return {
    actions: bindActionCreators(Object.assign(actions), dispatch)
  }
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Blog extends Component {
  constructor(props) {
    super(props);
    const page = 1
    const size = 5
    const tag = props.location && Object.keys(props.location.query).length && props.location.query.tag
    this.state = { page, size, tag };
  }

  static propTypes = {
    articleList: PropTypes.array.isRequired
  };

  componentWillReceiveProps(nextProps) {
    const { location:{ nextSearch, query:{ tag } } }=nextProps;
    const { location:{ prevSearch } } = this.props;
    if (nextSearch !== prevSearch) {
      this.state.tag = tag;
      this.__fetchArticleList()
    }
  };

  componentWillMount() {
    let self = this;
    this.hashChangeListener = this.__reRenderComponent(self);
    window.addEventListener('hashchange', this.hashChangeListener, false)
  }

  componentDidMount() {
    const { actions } =this.props;
    actions.showHeader();
    this.__fetchArticleList();
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.hashChangeListener, false)
  }

  __reRenderComponent() {
    const self = this;
    return function () {
      let hash = window.location.hash;
      if (hash.indexOf('tag') == -1) {
        self.state.tag = undefined;
      } else {
        self.state.tag = hash.split("tag=")[1].split("&_k")[0];
      }
      self.__fetchArticleList()
    };

  }

  __fetchArticleList(page = this.state.page, size = this.state.size, tag = this.state.tag) {
    const { actions } = this.props;
    actions.getBlogList(page, size, tag);
  }

  render() {
    const { articleList }=this.props;
    return (<section className="blog-list-page container">
      {articleList.map((item, i)=>
        <article className="post-preview" key={i}>
          <Link to={`/blog/${item.articleId}`}>
            <h2 className="post-title ellipsis">{item.title}</h2>
            <p className="post-subtitle ellipsis">{item.subtitle}</p>
            <section className="post-content-preview">{item.preview}</section>
          </Link>
          <p className="post-meta ellipsis">{item.meta}</p>
          <hr/>
        </article>
      )}
    </section>)
  }


}