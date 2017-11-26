'use strict';
export default async () => {
  const marked = await import(/*webpackChunkName:'Marked.lib'*/ '../../lib/markdown/marked');

  window.Marked ||
    Object.defineProperty(window, 'Marked', {
      value: marked.__esModule ? marked.default : marked,
      configurable: false,
      enumerable: false,
      writable: false,
    });

  return Marked;
};
