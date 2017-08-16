'use strict';

/**
 * @official
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import './ScollSpy.stylus';

/**
 * @inject
 */
export default class ScrollSpy extends React.Component {
  constructor(props) {
    super(props);
    let navigation = [];
    let ScrollSpyReady = false;
    this.state = {navigation, ScrollSpyReady};
  }

  static propTypes = {
    ready: PropTypes.bool.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.ready) {
      return;
    }
    if (nextProps.ready && !this.state.ScrollSpyReady) {
      this.__getScrollSpyData();
    }
  }

  componentDidMount() {}

  __getScrollSpyData() {
    const {$container} = this.props;
    let ScrollSpyReady = true;
    const navigation = [];

    Array.from($container.querySelectorAll('[data-level]')).forEach(item => {
      const id = item.getAttribute('id').replace(/^#/, ''),
        level = item.getAttribute('data-level'),
        textContext = item.textContent || item.innerHTML;
      if (id && level) {
        navigation.push({
          id,
          level,
          textContext,
        });
      }
    });
    this.setState({navigation, ScrollSpyReady});
  }

  render() {
    const {ready} = this.props;
    const {navigation} = this.state;

    if (ready) {
      return (
        <div className="article-scrollSpy">
          <ul>
            {navigation.map((item, i) =>
              <li key={i} className={`level-${item.level}`}>
                <a href={`#${item.id}`} title={item.textContext}>
                  {item.textContext}
                </a>
              </li>,
            )}
          </ul>
        </div>
      );
    } else {
      return null;
    }
  }
}
