'use strict';

/**
 * index page
 */
exports.renderIndexView = function *(CONFIG) {
  this.body = yield this.render('index', CONFIG);
}
