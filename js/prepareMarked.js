export const mdParser = (await import("./lib/marked/marked.esm.js")).marked;

mdParser.setOptions({
  gfm: true,
  smartypants: true,
  langPrefix: "language-",
});

export default { mdParser };