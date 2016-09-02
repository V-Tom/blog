import React, { Component, PropTypes }from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as actions from '../../../actions/action.blog'

import './blog.stylus'

const mapStateToProps = state=> {
  return state.Blog.toJS()
}

const mapDispatchToProps = dispatch=> {
  return {
    reducerActions: bindActionCreators(Object.assign(actions), dispatch)
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Blog extends Component {
  constructor(props) {
    super(props)
    const page = 1
    const size = 15
    const tag = this.props.location.query.tag || undefined
    this.state = { page, size, tag }
  }

  static propTypes = {
    articleList: PropTypes.object.isRequired
  }

  /**
   * blog hashchange listener
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    let nextSearch = nextProps.location.query.tag
    let prevSearch = this.state.tag
    if (nextSearch !== prevSearch) {
      this.setState({
        tag: nextProps.location.query.tag
      }, ()=> {
        this.__fetchArticleList()
      })
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    const { reducerActions } =this.props
    reducerActions.showHeader()
    this.__fetchArticleList()
  }

  componentWillUnmount() {
    const { reducerActions } = this.props
    reducerActions.clearBlogState()
  }

  __fetchArticleList() {
    const { reducerActions } = this.props
    const { tag } = this.state
    reducerActions.getBlogList(1, 30, tag)
  }

  render() {
    const { articleList }=this.props
    return (<section className="blog-list-page container">
      {articleList.data && articleList.data.map((item, i)=>
        <article className="post-preview" key={i}>
          <Link to={`/blog/${item.articleId}`}>
            <h2 className="post-title ellipsis">{item.title}</h2>
            <p className="post-subtitle ellipsis">{item.subTitle}</p>
            <section className="post-content-preview">{item.preview}</section>
          </Link>
          <p className="post-meta ellipsis">{item.meta}</p>
          <hr/>
        </article>
      )}
    </section>)
  }


}