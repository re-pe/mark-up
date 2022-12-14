const MarkdownIt = (await import('https://cdn.jsdelivr.net/npm/markdown-it/+esm')).default;

const moduleData = [
  { name: 'FrontMatter', url: "https://cdn.jsdelivr.net/npm/@gerhobbelt/markdown-it-front-matter/+esm", f: m => m.default },
  { name: 'Metadata', url: "https://cdn.jsdelivr.net/npm/markdown-it-metadata-block@1.0.2/dist/index.js", f: m => m.default },
  { name: 'Sub', url: "https://cdn.jsdelivr.net/npm/markdown-it-sub/+esm", f: m => m.default },
  { name: 'Sup', url: "https://cdn.jsdelivr.net/npm/markdown-it-sup/+esm", f: m => m.default },
  { name: 'Footnote', url: "https://cdn.jsdelivr.net/npm/markdown-it-footnote/+esm", f: m => m.default },
  { name: 'Deflist', url: "https://cdn.jsdelivr.net/npm/markdown-it-deflist/+esm", f: m => m.default },
  { name: 'Abbr', url: "https://cdn.jsdelivr.net/npm/markdown-it-abbr/+esm", f: m => m.default },
  { name: 'Emoji', url: "https://cdn.jsdelivr.net/npm/markdown-it-emoji/+esm", f: m => m.default },
  { name: 'Container', url: "https://cdn.jsdelivr.net/npm/markdown-it-bracketed-spans/+esm", f: m => m.default },
  { name: 'BracketSpan', url: "https://cdn.jsdelivr.net/npm/markdown-it-container/+esm", f: m => m.default },
  { name: 'Insert', url: "https://cdn.jsdelivr.net/npm/markdown-it-ins/+esm", f: m => m.default },
  { name: 'Mark', url: "https://cdn.jsdelivr.net/npm/markdown-it-mark/+esm", f: m => m.default },
  { name: 'Admon', url: "https://cdn.jsdelivr.net/npm/markdown-it-admon/+esm", f: m => m.default },
  { name: 'MmdTable', url: "https://cdn.jsdelivr.net/npm/markdown-it-multimd-table/+esm", f: m => m.default },
  { name: 'YamlTable', url: "https://cdn.jsdelivr.net/npm/markdown-it-complex-table/+esm", f: m => m.default.default },
  { name: 'GridTable', url: "https://cdn.jsdelivr.net/npm/markdown-it-gridtables/+esm", f: m => m.default.default },
  { name: 'Attrs', url: "https://cdn.jsdelivr.net/npm/@sup39/markdown-it-attr/+esm", f: m => m.default },
  { name: 'Aside', url: "https://cdn.jsdelivr.net/npm/@humanwhocodes/markdown-it-markua-aside/+esm", f: m => m.asidePlugin },
  { name: 'Anchor', url: "https://cdn.jsdelivr.net/npm/markdown-it-anchor/+esm", f: m => m.default },
  { name: 'Toc', url: "https://cdn.jsdelivr.net/npm/markdown-it-table-of-contents/+esm", f: m => m.default },
  // { name: 'TocDoneRight', url: "https://cdn.jsdelivr.net/npm/markdown-it-toc-done-right/+esm", f: m => m.default },
  { name: 'Replacements', url: "https://cdn.jsdelivr.net/npm/markdown-it-replacements/+esm", f: m => m.default },
  // { name: 'Replacements', url: "https://cdn.jsdelivr.net/npm/markdown-it-replacements@1.0.2/index.js", type: "cjs" },
  { name: 'YAML', url: "https://cdn.jsdelivr.net/npm/yaml@2.1.3/browser/index.js", f: m => m.default },
  // { name: 'YAML', url: "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.mjs", f: m => m },
]

const moduleDataToImport = Object.values(moduleData.filter(module => module.type !== 'cjs'))
const moduleNamesToImport = moduleDataToImport.map(module => module.name)

const importPromises = moduleDataToImport.map((module) => import(module.url).then(module.f))
const importModuleData = await Promise.all(importPromises)

const importModules = Object.fromEntries(moduleNamesToImport.map((_, i) => [moduleNamesToImport[i], importModuleData[i]]))

const moduleDataToRequire = Object.values(moduleData.filter(module => module.type === 'cjs'))
const moduleNamesToRequire = moduleDataToRequire.map(module => module.name)

const { require } = await import("./helpers.js");

const requirePromises = moduleDataToRequire.map((module) => require(module.url))
const requireModuleData = await Promise.all(requirePromises)

const requireModules = Object.fromEntries(moduleNamesToRequire.map((_, i) => [moduleNamesToRequire[i], requireModuleData[i]]))

const modules = Object.assign({}, importModules, requireModules)

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
// .use(TocDoneRight)

export default { mdParser };