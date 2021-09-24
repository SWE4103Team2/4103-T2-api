export const readFile = (file) => {
  const reader = new FileReader();
  let data = null;

  reader.onload = e => {
    data = e.target.value
  }
  reader.readAsText(file);

  return data;
}

export const splitByNewLine = (string) => {
  return string.split('\n');
};

export const splitByTab = (string) => {
  return string.split('\t');
}