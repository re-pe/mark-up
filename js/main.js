import './lib/bliss.js';
import './lib/prism.js';
import './lib/prism-live.js';

const scriptList = {
  'index': './md-block.js',
  'demo-marked': './demo.js',
  'demo-remark': './remark-doc.js',
};

const { getApplicationName } = await import("./helpers.js");
const applicationName = getApplicationName();

await import(`${scriptList[applicationName]}`);
