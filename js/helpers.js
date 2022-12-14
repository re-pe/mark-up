// Fix indentation
export function deIndent(text) {
  let indent = text.match(/^[\r\n]*([\t ]+)/);

  if (indent) {
    indent = indent[1];

    text = text.replace(RegExp("^" + indent, "gm"), "");
  }

  return text;
}


export async function require(path) {
  let _module = window.module;
  window.module = {};
  await import(path);
  let exports = module.exports;
  window.module = _module; // restore global
  return exports;
}

export function splitPathName() {
  const pathName = window.location.pathname;
  const pathArray = pathName.split('/');
  const fileName = pathArray.pop();
  const path = pathArray.join('/');
  return { path, fileName };
}

export default { deIndent, require, splitPathName };