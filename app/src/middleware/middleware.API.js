'use strict';

import {BlogApi, ArticleApi, ToolsApi, MyResumeApi} from '../api';
import Notification from '../component/Notification';
import Spinner from '../component/Spinner';

window.CALL_API = Symbol('CALL_API');

/**
 * nextAction
 * @param action
 * @param content
 * @returns {{}}
 */
const nextAction = (action, content) => {
  const finalAction = {...action, ...content};
  delete finalAction[window.CALL_API];
  return finalAction;
};
/**
 * middleware
 * @param store
 */
export default store => next => action => {
  const {CALL_API, type} = action;

  if (!CALL_API) return next(action);

  /**
   * CALL_API
   */
  const {
    resource,
    path,
    payload,
    notification,
    spinner,
    finalDealWith,
  } = CALL_API;

  spinner && Spinner.show();

  /**
   * API resource
   */
  return resource
    [path](payload)
    .then(content => {
      spinner && Spinner.remove();
      content =
        typeof finalDealWith === 'function' ? finalDealWith(content) : content;
      return content;
    })
    .then(content => {
      next(nextAction(action, content));
    })
    .catch(err => {
      err.interceptor && Notification.err(notification);
    });
};
