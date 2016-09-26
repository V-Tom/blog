'use strict';

/**
 * index page
 */
exports.renderIndexView = function *(config) {
  this.body = yield this.render('index', config);
}
