'use strict';
/**
 * @official
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Disqus extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const detail =
      "(function() {var d = document, s = d.createElement('script');s.src = '//toms-blog-1.disqus.com/embed.js';s.setAttribute('data-timestamp', +new Date());(d.head || d.body).appendChild(s);})()";
    const script = document.createElement('script');
    script.id = 'disqus';
    script.innerHTML = detail;

    document.body.appendChild(script);
  }

  componentWillUnmount() {
    let iframe = document.querySelectorAll('iframe');
    document.body.removeChild(document.getElementById('disqus'));
    iframe &&
      [].slice.call(iframe).forEach(item => {
        item.nodeType === 1 && item.parentNode.removeChild(item);
      });
  }

  render() {
    return (
      <div
        id="disqus_thread"
        className="container"
        style={{
          minHeight: '1rem',
          margin: '10px auto',
        }}
      />
    );
  }
}
