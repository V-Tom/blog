//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
//
//

'use strict';

/**
 * @official
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

/**
 * @Third-part
 */
/**
 * @inject
 */
export default ({
  loader = () => new Promise(),
  chunkName = 'unKnown',
  loadingComponent = null,
  delay = 0,
}) => {
  let outSideIsLoading = false;
  let outSideError = null;

  return class DynamicLoader extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
      super(props);

      const isLoading = true;
      const Component = null;
      const isSuccess = false;
      const pastDelay = false;

      this.state = {isLoading, Component, isSuccess, pastDelay};

      this.__mounted = false;
      this.__timeout = null;
    }

    componentWillMount() {
      this.__mounted = true;

      if (this.state.component) {
        return;
      }

      this.__timeout = setTimeout(() => {
        this.setState({pastDelay: true});
      }, delay);

      loader()
        .then(component => {
          outSideIsLoading = false;
          this.setState({
            Component:
              component && component.__esModule ? component.default : component,
            pastDelay: false,
          });
        })
        .catch(error => {
          outSideIsLoading = false;
          outSideError = error;
          this.setState({
            pastDelay: false,
            Component: null,
          });
        });
    }

    componentDidMount() {}

    componentWillUnmount() {
      this.__mounted = false;
      clearTimeout(this.__timeout);
    }

    render() {
      const {pastDelay, Component} = this.state;

      if (outSideIsLoading) {
        return loadingComponent
          ? <loadingComponent
              isLoading={outSideIsLoading}
              pastDelay={pastDelay}
              error={outSideError}
            />
          : null;
      } else {
        return Component ? <Component {...this.props} /> : null;
      }
    }
  };
};
