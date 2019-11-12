const rewire = require('rewire');
const path = require('path');

const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');

// Consolidate chunk files instead
config.optimization.splitChunks = {
  cacheGroups: {
    default: false
  }
};
// Move runtime into bundle instead of separate file
config.optimization.runtimeChunk = false;

// JS
config.output.filename = 'gallery.js';

// CSS. "5" is MiniCssPlugin
config.plugins[5].options.filename = 'gallery.css';

config.devtool = false;
