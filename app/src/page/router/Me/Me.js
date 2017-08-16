'use strict';

/**
 * @official
 */
import React from 'react';
import * as actions from '../../../actions/action.Me';
// import CssModules from '../../../lib/decorator/decorator.react.css.modules'
// import AutoBind from '../../../lib/decorator/decorator.auto.bind'

/**
 * @inject
 */
import './Me.stylus';

export default class Me extends React.PureComponent {
  constructor(props) {
    super(props);
    const resume = null;
    this.state = {resume};
  }

  componentDidMount() {
    this.__fetchResume().then(resume => {
      this.setState({resume});
    });
  }

  /**
   * get my resume
   * @returns {*}
   * @private
   */
  __fetchResume() {
    return actions.getMyResume();
  }

  render() {
    const {resume} = this.state;

    return (
      <section className="blog-me-page container">
        {resume &&
          <article
            className="markdown container article-content"
            dangerouslySetInnerHTML={{__html: resume.data.resume}}
          />}
      </section>
    );
  }
}
