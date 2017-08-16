'use strict';
import CSSModules from 'react-css-modules';

export default function(styles) {
  return Component => {
    return CSSModules(Component, styles, {allowMultiple: true});
  };
}
