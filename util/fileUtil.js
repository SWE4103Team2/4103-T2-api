const FileReader = require('filereader');
const { invalidData, courseData, personData, transferData } = require('../config/fileTypes');

const readFile = (file) => {
  // May not need this -- depends if we find a way to send files to api.
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