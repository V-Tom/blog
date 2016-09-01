'use strict';

/**
 * index page
 */
exports.renderIndexView = function *(config) {
  this.body = yield this.render('index', config);
}

/**
 * admin page
 */
exports.renderAdminView = function *() {
  this.body = yield this.render('admin', {})
}

exports.renderAuthLoginView = function *(platformUser) {
  this.body = yield this.render('auth', { platformUser })
}
