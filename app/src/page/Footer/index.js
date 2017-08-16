'use strict';

import DynamicLoader from '../../component/DynamicLoader';

export default DynamicLoader({
  loader: () => import(/*webpackChunkName:'Footer.Component'*/ './Footer'),
});
