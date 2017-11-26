/**
 * marked required
 */
import marked from './marked.base';
import Prism from './prism';

/**
 * marked style
 */

import '../../less/markdown/markdown.less';
import '../../less/markdown/prism.light.css';

/**
 * prism plugins
 */

const defaultLanguage = 'javascript';

/**
 * exports
 */
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  emoji: true,
  smartypants: false,
  highlight: function(code, lang = defaultLanguage) {
    return Prism.highlight(
      code,
      Prism.languages[lang] || Prism.languages[defaultLanguage],
    );
  },
  langPrefix: 'lang-',
});

export default marked;
