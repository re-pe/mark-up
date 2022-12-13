import './bliss.js';
import './prism.js';
import './prism-live.js';

const { splitPathName } = await import("./helpers.js");
const fileName = splitPathName().fileName;

if ( fileName === 'index.html') {
  import('./md-block.js')
} else if ( fileName === 'index-mrkd.html') {
  import('./demo.js');
}