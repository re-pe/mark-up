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

export async function loadModules(moduleDataList) {
  const moduleDataToImport = Object.values(moduleDataList.filter(moduleData => moduleData.type !== 'cjs'));
  const moduleDataToRequire = Object.values(moduleDataList.filter(moduleData => moduleData.type === 'cjs'));

  const moduleNamesToImport = moduleDataToImport.map(moduleData => moduleData.name);
  const moduleNamesToRequire = moduleDataToRequire.map(moduleData => moduleData.name);

  const importPromises = moduleDataToImport.map((moduleData) => import(moduleData.path).then(module => module[moduleData.import]));
  const requirePromises = moduleDataToRequire.map((moduleData) => require(moduleData.path));

  const importModuleList = await Promise.all(importPromises);
  const requireModuleList = await Promise.all(requirePromises);

  const importModules = Object.fromEntries(moduleNamesToImport.map((_, i) => [moduleNamesToImport[i], importModuleList[i]]));
  const requireModules = Object.fromEntries(moduleNamesToRequire.map((_, i) => [moduleNamesToRequire[i], requireModuleList[i]]));

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
