/**
 * @official
 */
import React from 'react';
import ReactDOM from 'react-dom';

export default class Portal extends React.Component {
  constructor() {
    super();
    this.state = {mounted: false};
  }

  componentDidMount() {
    this.setState({mounted: true});
  }

  componentWillUnmount() {
    if (this.target) {
      this.target.parentNode.removeChild(this.target);
    }
  }

  getTarget() {
    if (!this.target) {
      const portal = document.getElementById('portal');

      if (portal && portal.nodeType === 1) {
        this.target = portal;
      } else {
        this.target = document.createElement('div');
        document.body.appendChild(this.target);
      }
    }
    return this.target;
  }

  render() {
    if (!this.state.mounted) {
      return null;
    }

    return ReactDOM.createPortal(this.props.children, this.getTarget());
  }
}
