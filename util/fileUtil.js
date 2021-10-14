const FileReader = require('filereader');

const readFile = (file) => {
  const data = file.buffer.toString('utf-8');

  return data;
}

const splitByNewLine = (string) => {
  return string.split('\n').filter((x) => x)
};

const splitByTab = (string) => {
  const text = string.replace('\r', '');
  return text.split('\t');
}

module.exports = { readFile, splitByNewLine, splitByTab };