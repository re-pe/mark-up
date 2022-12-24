
const { remark } = await import('./lib/remark/remark.bundle.js');
export const h = (await import('./lib/remark/hastscript.bundle.js')).h;

// const moduleDataList = [
//   { name: 'remarkGfm', path: "./lib/remark/remark-gfm.bundle.js", import: 'default' },
//   { name: 'remarkToc', path: "./lib/remark/remark-toc.bundle.js", import: 'default' },
//   { name: 'remarkRehype', path: "./lib/remark/remark-rehype.bundle.js", import: 'default' },
//   { name: 'rehypeSlug', path: "./lib/remark/rehype-slug.bundle.js", import: 'default' },
//   { name: 'rehypeShiftHeading', path: "./lib/remark/rehype-shift-heading.bundle.js", import: 'default' },
//   { name: 'rehypeAutolinkHeadings', path: "./lib/remark/rehype-autolink-headings.bundle.js", import: 'default' },
//   { name: 'rehypeSanitize', path: "./lib/remark/rehype-sanitize.bundle.js", import: 'default' },
//   { name: 'rehypeStringify', path: "./lib/remark/rehype-stringify.bundle.js", import: 'default' },
// ]

const moduleDataList = [
  [ 'remarkGfm', (await import("./lib/remark/remark-gfm.bundle.js")).default ],
  [ 'remarkToc', (await import("./lib/remark/remark-toc.bundle.js")).default ],
  [ 'remarkRehype', (await import("./lib/remark/remark-rehype.bundle.js")).default ],
  [ 'rehypeSlug', (await import("./lib/remark/rehype-slug.bundle.js")).default ],
  [ 'rehypeShiftHeading', (await import("./lib/remark/rehype-shift-heading.bundle.js")).default ],
  [ 'rehypeAutolinkHeadings', (await import("./lib/remark/rehype-autolink-headings.bundle.js")).default ],
  [ 'rehypeSanitize', (await import("./lib/remark/rehype-sanitize.bundle.js")).default ],
  [ 'rehypeStringify', (await import("./lib/remark/rehype-stringify.bundle.js")).default ],
]

export const modules = Object.fromEntries(moduleDataList)

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
    if (modulesOptions[moduleData[0]]) {
      if (modulesOptions[moduleData[0]].defer) {
        return;
      }
      mdParser.use(modules[moduleData[0]], modulesOptions[moduleData[0]] ?? {})
    } else {
      mdParser.use(modules[moduleData[0]])
    }
  })

  return mdParser;
}

export default { h, loadParser, modules }