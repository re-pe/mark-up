import './lib/bliss.js';
import './lib/prism.js';
import './lib/prism-live.js';

const { splitPathName } = await import("./helpers.js");
const fileName = splitPathName().fileName;

if ( fileName === 'index.html') {
  import('./md-block.js')
} else if ( fileName === 'index-adoc.html') {
  import('./ascii-doc.js');
  console.log('./ascii-doc.js');
} else if ( fileName === 'index-mrkd.html') {
  import('./demo.js');
}