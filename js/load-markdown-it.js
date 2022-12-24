const MarkdownIt = (await import('./lib/markdown-it/markdown-it.bundle.js')).default;

const moduleDataList = [
  [ 'FrontMatter', (await import("./lib/markdown-it/markdown-it-front-matter.bundle.js")).default ],
  // [ 'Metadata', (await import("./lib/markdown-it/markdown-it-metadata-block.bundle.js")).default ],
  [ 'Replacements', (await import("./lib/markdown-it/markdown-it-replacements.bundle.js")).default ],
  [ 'Sub', (await import("./lib/markdown-it/markdown-it-sub.bundle.js")).default ],
  [ 'Sup', (await import("./lib/markdown-it/markdown-it-sup.bundle.js")).default ],
  [ 'Footnote', (await import("./lib/markdown-it/markdown-it-footnote.bundle.js")).default ],
  [ 'Deflist', (await import("./lib/markdown-it/markdown-it-deflist.bundle.js")).default ],
  [ 'Abbr', (await import("./lib/markdown-it/markdown-it-abbr.bundle.js")).default ],
  [ 'Emoji', (await import("./lib/markdown-it/markdown-it-emoji.bundle.js")).default ],
  [ 'Container', (await import("./lib/markdown-it/markdown-it-bracketed-spans.bundle.js")).default ],
  [ 'BracketSpan', (await import("./lib/markdown-it/markdown-it-container.bundle.js")).default ],
  [ 'Insert', (await import("./lib/markdown-it/markdown-it-ins.bundle.js")).default ],
  [ 'Mark', (await import("./lib/markdown-it/markdown-it-mark.bundle.js")).default ],
  [ 'Admon', (await import("./lib/markdown-it/markdown-it-admon.bundle.js")).default ],
  [ 'MmdTable', (await import("./lib/markdown-it/markdown-it-multimd-table.bundle.js")).default ],
  [ 'YamlTable', (await import("./lib/markdown-it/markdown-it-complex-table.bundle.js")).default ],
  [ 'GridTable', (await import("./lib/markdown-it/markdown-it-gridtables.bundle.js")).default ],
  [ 'Attrs', (await import("./lib/markdown-it/markdown-it-attr.bundle.js")).default ],
  [ 'Aside', (await import("./lib/markdown-it/markdown-it-markua-aside.bundle.js")).asidePlugin ],
  [ 'Anchor', (await import("./lib/markdown-it/markdown-it-anchor.bundle.js")).default ],
  [ 'Slugify', (await import("./lib/markdown-it/slugify.bundle.js")).default ],
  [ 'Toc', (await import("./lib/markdown-it/markdown-it-table-of-contents.bundle.js")).default ],
  [ 'Replacements', (await import("./lib/markdown-it/markdown-it-replacements.bundle.js")).default ],
  [ 'YAML', (await import("./lib/markdown-it/yaml.bundle.js")).default ],
  // TocDoneRight
];

export const modules = Object.fromEntries(moduleDataList);

const YAML = modules.YAML;
const Slugify = modules.Slugify;

export const modulesOptions = {
  MarkdownIt: { html: true, xhtmlOut: true, linkify: true, typography: true },
  FrontMatter: { callback: (fm, token, state) => { 
      mdParser.yaml = '';
      if (fm) {
        const yaml = YAML.parse(fm);
        console.log(`FrontMatter:\n`, yaml, yaml.title, yaml.b, yaml.tags);
        mdParser.yaml = yaml;
      }
    }
  },
  // Metadata: { parseMetadata: YAML.load, meta },
  Container: "spoiler",
  MmdTable : { multiline: true, rowspan: true, headerless: true, multibody: true, autolabel: true },
  Anchor: { slugify: s => Slugify(s) },
  // Anchor: { permalink: modules.Anchor.permalink.headerLink() },
  // Anchor: { permalink: modules.Anchor.permalink.linkInsideHeader({ symbol: '$', placement: 'before' }) },
  Slugify: { defer: true },
  YAML: { defer: true },
}

modules.Replacements.replacements.push({
  name: 'allcaps',
  re: /^Bandymas$/g,
  sub: function (s) { return '# ' + meta.title; },
  default: true
});

export function loadParser() {

  const mdParser = new MarkdownIt({
    html: true,        // Enable HTML tags in source
    xhtmlOut: true,
    linkify: true,
    typography: true,
  })

  moduleDataList.forEach(moduleData => {
    if (modulesOptions[moduleData[0]]) {
      if (modulesOptions[moduleData[0]].defer) {
        return;
      }
      mdParser.use(modules[moduleData[0]], modulesOptions[moduleData[0]])
    } else {
      mdParser.use(modules[moduleData[0]])
    }
  })

  return mdParser;
}

export default { loadParser, modules };