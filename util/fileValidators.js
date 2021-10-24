const validateStudents = (file) => {
  const header = [
    "Student_ID", 
    "Fname-Lname", 
    "Email", 
    "Program", 
    "Campus", 
    "Start_Date"
  ];

  if (file !== header) {
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

  if (file !== header) {
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

  if (file !== header) {
    throw 'TransferFileException'
  }
};

module.exports = { validateCourses, validateStudents, validateTransfers };