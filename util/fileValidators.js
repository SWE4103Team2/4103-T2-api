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

const validateCourses = (file) => {
  const header = [
    "Student_ID", 
    "Term", 
    "Course", 
    "Title", 
    "Grade", 
    "Credit_Hrs", 
    "Grade_Pts", 
    "Section"
  ];

  const check = header.every(val => file.includes(val));

  if (!check) {
    throw 'CourseFileException'
  }
};

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