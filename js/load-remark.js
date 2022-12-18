
const { remark } = await import('./lib/remark/remark.bundle.js');
export const h = (await import('./lib/remark/hastscript.bundle.js')).h;

const moduleDataList = [
  { name: 'remarkGfm', path: "./lib/remark/remark-gfm.bundle.js", import: 'default' },
  { name: 'remarkToc', path: "./lib/remark/remark-toc.bundle.js", import: 'default' },
  { name: 'remarkRehype', path: "./lib/remark/remark-rehype.bundle.js", import: 'default' },
  { name: 'rehypeSlug', path: "./lib/remark/rehype-slug.bundle.js", import: 'default' },
  { name: 'rehypeShiftHeading', path: "./lib/remark/rehype-shift-heading.bundle.js", import: 'default' },
  { name: 'rehypeAutolinkHeadings', path: "./lib/remark/rehype-autolink-headings.bundle.js", import: 'default' },
  { name: 'rehypeSanitize', path: "./lib/remark/rehype-sanitize.bundle.js", import: 'default' },
  { name: 'rehypeStringify', path: "./lib/remark/rehype-stringify.bundle.js", import: 'default' },
]

const { loadModules } = await import("./helpers.js")

export const modules = await loadModules(moduleDataList)

export const modulesOptions = {
  rehypeShiftHeading: { defer: true },
  rehypeAutolinkHeadings: { defer: true },
  rehypeSanitize: { defer: true },
  rehypeStringify: { defer: true },
}

export async function loadParser() {

  const mdParser = await remark()
    .data('settings', { fragment: true });

  moduleDataList.forEach(moduleData => {
    if (modulesOptions[moduleData.name]) {
      if (modulesOptions[moduleData.name].defer) {
        return;
      }
      mdParser.use(modules[moduleData.name], modulesOptions[moduleData.name] ?? {})
    } else {
      mdParser.use(modules[moduleData.name])
    }
  })

  return mdParser;
}

export default { h, loadParser, modules }