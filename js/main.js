import './lib/bliss.js';
import './lib/prism.js';
import './lib/prism-live.js';

const scriptList = {
  'index': './md-block.js',
  'demo-marked': './demo-marked.js',
  'demo-markdown-it': './demo-markdown-it.js',
  'demo-remark': './demo-remark.js',
  'demo-asciidoc': './ascii-doc.js',
};

const { getApplicationName } = await import("./helpers.js");
const applicationName = getApplicationName();

if (scriptList[applicationName]) {
  await import(`${scriptList[applicationName]}`);
} else {
  alert(`Error!
    Either your html file has no tag
    '<meta name="application-name" content="..." />'
    or content value of the tag 
    is not included to the script list!`
  );
}
