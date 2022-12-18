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

export async function loadModules(moduleData) {
  const moduleDataToImport = Object.values(moduleData.filter(module => module.type !== 'cjs'));
  const moduleDataToRequire = Object.values(moduleData.filter(module => module.type === 'cjs'));

  const moduleNamesToImport = moduleDataToImport.map(module => module.name);
  const moduleNamesToRequire = moduleDataToRequire.map(module => module.name);

  const importPromises = moduleDataToImport.map((module) => import(module.url).then(module.f));
  const requirePromises = moduleDataToRequire.map((module) => require(module.url));

  const importModuleData = await Promise.all(importPromises);
  const requireModuleData = await Promise.all(requirePromises);

  const importModules = Object.fromEntries(moduleNamesToImport.map((_, i) => [moduleNamesToImport[i], importModuleData[i]]));
  const requireModules = Object.fromEntries(moduleNamesToRequire.map((_, i) => [moduleNamesToRequire[i], requireModuleData[i]]));

  return Object.assign({}, importModules, requireModules);
}

export function splitPathName() {
  const pathName = window.location.pathname;
  const pathArray = pathName.split('/');
  const fileName = pathArray.pop();
  const path = pathArray.join('/');
  return { path, fileName };
}

export default { deIndent, getApplicationName, loadModules, require, splitPathName };
