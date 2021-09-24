import { invalidData, courseData, personData, transferData } from "../config/fileTypes";

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

// Get these from sample files.
const courseDataHeading = "";
const personDataHeading = "";
const transferDataHeading = "";

export const checkFileType = (string) => {
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