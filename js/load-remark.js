
const { remark } = await import('./lib/remark/remark.bundle.js');
export const h = (await import('./lib/remark/hastscript.bundle.js')).h;

const moduleData = [
  { name: 'remarkGfm', url: "./lib/remark/remark-gfm.bundle.js", f: m => m.default },
  { name: 'remarkToc', url: "./lib/remark/remark-toc.bundle.js", f: m => m.default },
  { name: 'remarkRehype', url: "./lib/remark/remark-rehype.bundle.js", f: m => m.default },
  { name: 'rehypeSlug', url: "./lib/remark/rehype-slug.bundle.js", f: m => m.default },
  { name: 'rehypeSanitize', url: "./lib/remark/rehype-sanitize.bundle.js", f: m => m.default },
  { name: 'rehypeStringify', url: "./lib/remark/rehype-stringify.bundle.js", f: m => m.default },
  { name: 'rehypeShiftHeading', url: "./lib/remark/rehype-shift-heading.bundle.js", f: m => m.default },
  { name: 'rehypeAutolinkHeadings', url: "./lib/remark/rehype-autolink-headings.bundle.js", f: m => m.default },
]

const { loadModules } = await import("./helpers.js")

export const modules = await loadModules(moduleData)

export async function loadParser() {

  const mdParser = await remark()
    .data('settings', { fragment: true })
    .use(modules.remarkGfm)
    .use(modules.remarkToc)
    .use(modules.remarkRehype)
    .use(modules.rehypeSlug);

  return mdParser;

}

export default { h, loadParser, modules }