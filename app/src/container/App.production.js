'use strict';
/**
 * @official
 */
import React from 'react';
import {Router, browserHistory} from 'react-router';

/**
 * sw
 */
import '../sw.register';

/**
 * @inject
 */
import routes from '../config/routes';

export default () => <Router history={browserHistory} routes={routes} />;
