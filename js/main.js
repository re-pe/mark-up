import './lib/bliss.js';
import './lib/prism.js';
import './lib/prism-live.js';

const scriptList = {
  'index': './md-block.js',
  'demo-marked': './demo.js',
  'demo-markdown-it': './demo-markdown-it.js',
};

const { getApplicationName } = await import("./helpers.js");
const applicationName = getApplicationName();

await import(`${scriptList[applicationName]}`);
