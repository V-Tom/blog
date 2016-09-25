import React, { Component }from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../../actions/action.Me'

import '../../../stylus/markdown/markdown.stylus'
import './Me.stylus'

const mapStateToProps = state=> {
  return state.Me.toJS()
}

const mapDispatchToProps = dispatch=> {
  return {
    reducerActions: bindActionCreators(Object.assign({}, actions), dispatch)
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Me extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.__fetchResume()
  }

  /**
   * get my resume
   * @returns {*}
   * @private
   */
  __fetchResume() {
    const { reducerActions } = this.props
    return reducerActions.getMyResume()
  }

  render() {
    const { resume } = this.props;
    return (
      <section className="blog-me-page container">
        <article
          className="markdown container article-content"
          dangerouslySetInnerHTML={{ __html: resume.data.resume }}>
        </article>
      </section>
    )
  }
}