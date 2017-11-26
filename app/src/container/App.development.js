'use strict';

/**
 * @official
 */
import React from 'react';
import ReactDOM from 'react-dom';

import {Router, browserHistory} from 'react-router';

// import '../sw.register'

/**
 * @inject
 */
import routes from '../config/routes';

export default () => <Router history={browserHistory} routes={routes} />;
