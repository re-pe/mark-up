// Fix indentation
export function deIndent(text) {
  let indent = text.match(/^[\r\n]*([\t ]+)/);

  if (indent) {
    indent = indent[1];

    text = text.replace(RegExp("^" + indent, "gm"), "");
  }

  return text;
}

export function getApplicationName() {
  const meta = document.querySelector('meta[name="application-name"]');
  return meta.getAttribute('content');
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

export default { deIndent, getApplicationName, require, splitPathName };
