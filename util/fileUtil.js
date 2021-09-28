const FileReader = require('filereader');
const { invalidData, courseData, personData, transferData } = require('../config/fileTypes');

const readFile = (file) => {
  const data = file.buffer.toString('utf-8');

  return data;
}

const splitByNewLine = (string) => {
  return string.split('\n');
};

const splitByTab = (string) => {
  return string.split('\t');
}

// Get these from sample files.
const courseDataHeading = "";
const personDataHeading = "";
const transferDataHeading = "";

const checkFileType = (string) => {
  if (string === courseDataHeading) {
    return courseData;
  } else if (string === personDataHeading) {
    return personData;
  } else if (string === transferDataHeading) {
    return transferData;
  } else {
    return invalidData;
  }
}

module.exports = { readFile, splitByNewLine, splitByTab, checkFileType };