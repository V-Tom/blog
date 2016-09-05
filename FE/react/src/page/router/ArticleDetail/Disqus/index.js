import React, {Component, PropTypes}from 'react'
export default class Disqus extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const detail = "(function() {var d = document, s = d.createElement('script');s.src = '//toms-blog-1.disqus.com/embed.js';s.setAttribute('data-timestamp', +new Date());(d.head || d.body).appendChild(s);})()"
    const script = document.createElement("script");

    script.innerHTML = detail;

    document.body.appendChild(script);
  }

  render() {
    return (
      <div id="disqus_thread"></div>
    )
  }
}