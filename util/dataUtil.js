const { splitByNewLine, getDataObj } = require("./fileUtil");

const formatStudentData = (data, fileName) => {
  const lines = splitByNewLine(data);
  const keys = splitByTab(lines[0]);

  keys[1] = 'Name';
  lines.shift();

  const studentData = getDataObj(keys, lines, fileName);

  return studentData;
};

const formatCourseData = (data, fileName) => {
  const lines = splitByNewLine(data);
  const keys = splitByTab(lines[0]);

  lines.shift();

  const courseData = getDataObj(keys, lines, fileName);

  return courseData;
};

const formatTransferData = (data, fileName) => {

};

module.exports = { formatStudentData, formatCourseData, formatTransferData };