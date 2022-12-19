const { loadModules, require } = await import("./helpers.js")

const MarkdownIt = (await import('./lib/markdown-it/markdown-it.bundle.js')).default;

const moduleDataList = [
  { name: 'FrontMatter', path: "./lib/markdown-it/markdown-it-front-matter.bundle.js", import: 'default' },
  // { name: 'Metadata', path: "./lib/markdown-it/markdown-it-metadata-block.bundle.js", import: 'default' },
  { name: 'Replacements', path: "./lib/markdown-it/markdown-it-replacements.bundle.js", import: 'default' },
  { name: 'Sub', path: "./lib/markdown-it/markdown-it-sub.bundle.js", import: 'default' },
  { name: 'Sup', path: "./lib/markdown-it/markdown-it-sup.bundle.js", import: 'default' },
  { name: 'Footnote', path: "./lib/markdown-it/markdown-it-footnote.bundle.js", import: 'default' },
  { name: 'Deflist', path: "./lib/markdown-it/markdown-it-deflist.bundle.js", import: 'default' },
  { name: 'Abbr', path: "./lib/markdown-it/markdown-it-abbr.bundle.js", import: 'default' },
  { name: 'Emoji', path: "./lib/markdown-it/markdown-it-emoji.bundle.js", import: 'default' },
  { name: 'Container', path: "./lib/markdown-it/markdown-it-bracketed-spans.bundle.js", import: 'default' },
  { name: 'BracketSpan', path: "./lib/markdown-it/markdown-it-container.bundle.js", import: 'default' },
  { name: 'Insert', path: "./lib/markdown-it/markdown-it-ins.bundle.js", import: 'default' },
  { name: 'Mark', path: "./lib/markdown-it/markdown-it-mark.bundle.js", import: 'default' },
  { name: 'Admon', path: "./lib/markdown-it/markdown-it-admon.bundle.js", import: 'default' },
  { name: 'GridTable', path: "./lib/markdown-it/markdown-it-gridtables.bundle.js", import: 'default' },
  { name: 'MmdTable', path: "./lib/markdown-it/markdown-it-multimd-table.bundle.js", import: 'default' },
  { name: 'YamlTable', path: "./lib/markdown-it/markdown-it-complex-table.bundle.js", import: 'default' },
  { name: 'Attrs', path: "./lib/markdown-it/markdown-it-attr.bundle.js", import: 'default' },
  { name: 'Aside', path: "./lib/markdown-it/markdown-it-markua-aside.bundle.js", import: 'asidePlugin' },
  { name: 'Anchor', path: "./lib/markdown-it/markdown-it-anchor.bundle.js", import: 'default' },
  { name: 'Slugify', path: "./lib/markdown-it/slugify.bundle.js", import: 'default' },
  { name: 'Toc', path: "./lib/markdown-it/markdown-it-table-of-contents.bundle.js", import: 'default' },
  { name: 'YAML', path: "./lib/markdown-it/yaml.bundle.js", import: 'default' },
  // TocDoneRight
]

export const modules = await loadModules(moduleDataList)

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
    if (modulesOptions[moduleData.name]) {
      if (modulesOptions[moduleData.name].defer) {
        return;
      }
      mdParser.use(modules[moduleData.name], modulesOptions[moduleData.name])
    } else {
      mdParser.use(modules[moduleData.name])
    }
  })

  return mdParser;
}

export default { loadParser, modules };