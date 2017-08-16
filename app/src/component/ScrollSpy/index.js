'use strict';
import DynamicLoader from '../DynamicLoader';

export default DynamicLoader({
  loader: () =>
    import(/*webpackChunkName:'ScrollSpy.Component'*/ './ScrollSpy'),
});
