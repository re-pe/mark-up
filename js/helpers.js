export function splitPathName() {
  const pathName = window.location.pathname;
  const pathArray = pathName.split('/');
  const fileName = pathArray.pop();
  const path = pathArray.join('/');
  return { path, fileName };
}

export default { splitPathName };