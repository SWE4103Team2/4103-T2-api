// Validates Students File
const validateStudents = (file) => {
  const header = [
    "Student_ID", 
    "Fname-Lname", 
    "Email", 
    "Program", 
    "Campus", 
    "Start_Date"
  ];

  const check = header.every(val => file.includes(val));

  if (!check) {
    throw 'StudentFileException'
  }
};

// Validates Courses File
const validateCourses = (file) => {
  const header = [
    "Student_ID", 
    "Term", 
    "Course", 
    "Title", 
    "Grade", 
    "Credit_Hrs", 
    "Grade_Pts", 
    "Section",
    "Notes_Codes"
  ];

  const check = header.every(val => file.includes(val));

  if (!check) {
    throw 'CourseFileException'
  }
};

// Validates Transfers File
const validateTransfers = (file) => {
  const header = [
    "Student_ID", 
    "Course", 
    "Title", 
    "Credit_Hrs", 
    "Transfer_Date"
  ];

  const check = header.every(val => file.includes(val));

  if (!check) {
    throw 'TransferFileException'
  }
};

module.exports = { validateCourses, validateStudents, validateTransfers };