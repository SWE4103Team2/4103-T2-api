const FileReader = require('filereader');

// Reads and returns file data.
const readFile = (file) => {
  if (file) {
    const data = file.buffer.toString('utf-8');

    return data;
  } else {
    throw 'NullFileException';
  }
};

// Splits a string by each new line - filter removes empty lines.
const splitByNewLine = (string) => {
  return string.split('\n').filter((x) => x)
};

// Splits a string by tabs - replace removes special character '\r'.
const splitByTab = (string) => {
  const text = string.replace('\r', '');
  return text.split('\t');
};

// Converts lines array to object using keys from header.
const getDataObj = (keys, linesArr, fileName) => {
  const objArr = linesArr.map(line => {
    const split = splitByTab(line);
    const obj = { fileID: fileName };

    keys.forEach((key, i) => {
      if (split.length > i && split[i]) {
        obj[key] = split[i];
      }
    });

    return obj;
  });

  return objArr;
};

module.exports = { readFile, splitByNewLine, splitByTab, getDataObj };