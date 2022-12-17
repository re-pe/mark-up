const MarkdownIt = (await import('./lib/markdown-it/markdown-it.bundle.js')).default;

const moduleData = [
  { name: 'FrontMatter', url: "./lib/markdown-it/markdown-it-front-matter.bundle.js", f: m => m.default },
  { name: 'Metadata', url: "./lib/markdown-it/markdown-it-metadata-block.bundle.js", f: m => m.default },
  { name: 'Sub', url: "./lib/markdown-it/markdown-it-sub.bundle.js", f: m => m.default },
  { name: 'Sup', url: "./lib/markdown-it/markdown-it-sup.bundle.js", f: m => m.default },
  { name: 'Footnote', url: "./lib/markdown-it/markdown-it-footnote.bundle.js", f: m => m.default },
  { name: 'Deflist', url: "./lib/markdown-it/markdown-it-deflist.bundle.js", f: m => m.default },
  { name: 'Abbr', url: "./lib/markdown-it/markdown-it-abbr.bundle.js", f: m => m.default },
  { name: 'Emoji', url: "./lib/markdown-it/markdown-it-emoji.bundle.js", f: m => m.default },
  { name: 'Container', url: "./lib/markdown-it/markdown-it-bracketed-spans.bundle.js", f: m => m.default },
  { name: 'BracketSpan', url: "./lib/markdown-it/markdown-it-container.bundle.js", f: m => m.default },
  { name: 'Insert', url: "./lib/markdown-it/markdown-it-ins.bundle.js", f: m => m.default },
  { name: 'Mark', url: "./lib/markdown-it/markdown-it-mark.bundle.js", f: m => m.default },
  { name: 'Admon', url: "./lib/markdown-it/markdown-it-admon.bundle.js", f: m => m.default },
  { name: 'MmdTable', url: "./lib/markdown-it/markdown-it-multimd-table.bundle.js", f: m => m.default },
  { name: 'YamlTable', url: "./lib/markdown-it/markdown-it-complex-table.bundle.js", f: m => m.default },
  { name: 'GridTable', url: "./lib/markdown-it/markdown-it-gridtables.bundle.js", f: m => m.default },
  { name: 'Attrs', url: "./lib/markdown-it/markdown-it-attr.bundle.js", f: m => m.default },
  { name: 'Aside', url: "./lib/markdown-it/markdown-it-markua-aside.bundle.js", f: m => m.asidePlugin },
  { name: 'Anchor', url: "./lib/markdown-it/markdown-it-anchor.bundle.js", f: m => m.default },
  { name: 'Toc', url: "./lib/markdown-it/markdown-it-table-of-contents.bundle.js", f: m => m.default },
  { name: 'Replacements', url: "./lib/markdown-it/markdown-it-replacements.bundle.js", f: m => m.default },
  { name: 'YAML', url: "./lib/markdown-it/yaml.bundle.js", f: m => m.default },
]

const { loadModules } = await import("./helpers.js")

const modules = await loadModules(moduleData)

modules.Replacements.replacements.push({
  name: 'allcaps',
  re: /^Bandymas$/g,
  sub: function (s) { return '# ' + meta.title; },
  default: true
});

export const mdParser = new MarkdownIt({
  html: true,        // Enable HTML tags in source
  xhtmlOut: true,
  linkify: true,
  typography: true,
})
  .use(modules.FrontMatter, {
    callback: (fm, token, state) => {
      mdParser.yaml = '';
      if (fm) {
        const yaml = modules.YAML.parse(fm);
        console.log(`FrontMatter:\n`, yaml, yaml.title, yaml.b, yaml.tags);
        mdParser.yaml = yaml;
      }
    }
  })
  // .use(Metadata, {
  //   // parseMetadata: YAML.parse,
  //   parseMetadata: YAML.load,
  //   meta
  // })
  .use(modules.Replacements)
  .use(modules.Sub)
  .use(modules.Sup)
  .use(modules.Footnote)
  .use(modules.Deflist)
  .use(modules.Abbr)
  .use(modules.Emoji)
  .use(modules.Container, "spoiler")
  .use(modules.BracketSpan)
  .use(modules.Insert)
  .use(modules.Mark)
  .use(modules.Admon)
  .use(modules.GridTable)
  .use(modules.MmdTable, {
    multiline: true,
    rowspan: true,
    headerless: true,
    multibody: true,
    autolabel: true,
  })
  .use(modules.YamlTable)
  .use(modules.Attrs)
  .use(modules.Aside)
  .use(modules.Anchor, {
    permalink: modules.Anchor.permalink.linkInsideHeader({
      symbol: '$',
      placement: 'before'
    })
  })
  .use(modules.Toc)
  .disable('anchor');
// .use(TocDoneRight)

export default { mdParser };