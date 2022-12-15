import './lib/bliss.js';
import './lib/prism.js';
import './lib/prism-live.js';

const { splitPathName } = await import("./helpers.js");
const fileName = splitPathName().fileName;

if (fileName === 'index.html') {
  import('./md-block.js')
} else if (fileName === 'index-mrkd.html') {
  import('./demo.js');
} else if (fileName === 'index-rmrk.html') {
  import('./demo-rmrk.js');
}