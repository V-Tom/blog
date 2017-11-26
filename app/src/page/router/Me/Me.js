'use strict';

/**
 * @official
 */
import React from 'react';
import {MyResumeApi} from '../../../api';

/**
 * @inject
 */
import './Me.M.less';

export default class Me extends React.PureComponent {
  constructor(props) {
    super(props);
    const resume = null;
    this.state = {resume};
  }

  componentDidMount() {
    this.__fetchResume();
  }

  /**
   * get my resume
   * @returns {*}
   * @private
   */
  __fetchResume() {
    window.Spinner.show();
    window.Header.show();

    return MyResumeApi.getMyResume().then(({data}) => {
      window.Spinner.hide();
      this.setState({resume: data});
    });
  }

  render() {
    const {resume} = this.state;

    return (
      <main className="blog-me-page container">
        {resume &&
          <article
            className="markdown"
            dangerouslySetInnerHTML={{__html: Marked(resume.resume)}}
          />}
      </main>
    );
  }
}
