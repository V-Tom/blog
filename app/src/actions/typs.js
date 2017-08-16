'use strict';
import keyMirror from 'keymirror';

/**
 * RouterBlog
 */
export const RouterBlog = keyMirror({
  GET_ARTICLE_LIST: null,
  LOAD_MORE: null,
  SET_TAG_NAME: null,
  TOGGLE_DATA_BUSY: null,
  CLEAR_BLOG_LIST_STATE: null,
});

/**
 * RouterArticle
 */
export const RouterArticle = keyMirror({
  GET_ARTICLE_DETAIL: null,
  CLEAR_ARTICLE_DETAIL_STATE: null,
});

/**
 * Discuss
 * @type {{GET_ARTICLE_REPLY: string}}
 */
export const Discuss = keyMirror({
  GET_ARTICLE_REPLY: null,
});
