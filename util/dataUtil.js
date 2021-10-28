const { splitByTab, splitByNewLine, getDataObj } = require("./fileUtil");
const { validateStudents, validateCourses, validateTransfers } = require("./fileValidators");

const formatStudentData = (data, fileName) => {
  const lines = splitByNewLine(data);
  const keys = splitByTab(lines[0]);

  validateStudents(keys);

  keys[1] = 'Name';
  lines.shift();

  const studentData = getDataObj(keys, lines, fileName);

  return studentData;
};

const formatCourseData = (data, fileName) => {
  const lines = splitByNewLine(data);
  const keys = splitByTab(lines[0]);

  validateCourses(keys);

  lines.shift();

  const courseData = getDataObj(keys, lines, fileName);

  return courseData;
};

const formatTransferData = (data, fileName) => {
  const lines = splitByNewLine(data);
  const keys = splitByTab(lines[0]);

  validateTransfers(keys);

  lines.shift();

  // Not Implemented Yet
};

module.exports = { formatStudentData, formatCourseData, formatTransferData };