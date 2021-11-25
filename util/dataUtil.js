const { splitByTab, splitByNewLine, getDataObj } = require("./fileUtil");
const { validateStudents, validateCourses, validateTransfers } = require("./fileValidators");

// Formats Student File's Data
const formatStudentData = (data, fileName) => {
  const lines = splitByNewLine(data);
  const keys = splitByTab(lines[0]);

  validateStudents(keys);

  keys[1] = 'Name';
  lines.shift();

  const studentData = getDataObj(keys, lines, fileName);

  return studentData;
};


// Formats Course File's Data
const formatCourseData = (data, fileName) => {
  const lines = splitByNewLine(data);
  const keys = splitByTab(lines[0]);

  validateCourses(keys);

  lines.shift();

  const courseData = getDataObj(keys, lines, fileName);

  return courseData;
};

// Formats Transfer File's Data
const formatTransferData = (data, fileName, program) => {
  const lines = splitByNewLine(data);
  const keys = splitByTab(lines[0]);

  validateTransfers(keys);

  lines.shift();

  const transferData = getDataObj(keys, lines, fileName);

  let stuID, count, prog;                               //the current student id, used below and the number of 

  if(program === "MULTI"){
    prog = "";
  }
  else{
    prog = "BS" + program;
  }

  const transferDataCleaned = transferData.filter(line => {
      return line.Transfer_Degrees.includes(prog)
    }).map(line => {
      line.Grade = "CR";
      line.Term = "0000/00";
      line.Section = "N/A";

      if(!line.Course){                             //Some courses dont have a Course ID assigned to them off the bat
        line.Course = courseIDReference[line.Title] //Grab some IDs from a list (this contains all the examples in the transferdata.txt file), this should be unique for each student, the credit hours are added together i think
        if(!line.Course){                           //If it gets past that, check for some basic words, we could probably check for more (IE other languages like the french thats in the file)
          if(stuID === line.Student_ID){            //using a counter to generate unique course ids for each unknown course, to a max of 100 total
            count++;
          }
          else{
            stuID = line.Student_ID;
            count = 0;
          }
          if(line.Title.includes("SCIENCE")){
            line.Course = 'SCI*T' + count;
          }
          else if(line.Title.includes("HUM")){
            line.Course = 'HUM*T' + count;
          }
          else if(line.Title.includes("OPEN")){
            line.Course = 'OPEN*T' + count;
          }
          else if(line.Title.includes("TECHNICAL")){
            line.Course = 'TE*T' + count;
          }
          else if(line.Title.includes("STUDIES")){
            line.Course = 'CSE*T' + count;
          }
          else if(line.Title.includes("BLOCK")){
            line.Course = 'BLCK*T' + count;
          }
          else{
            line.Course = 'UNKN*T' + count;              
          }
        }
      }
      return line;
    });

  return transferDataCleaned;
};

const courseIDReference = {
  "A-LEVEL PHYSICS":                'PHYS*TRNF',
  "U/A FRENCH":                     'FR*TRNF',
  "UNASSIGNED HUMANITIES":          'HUM*TRNF',
  "COMPLEMENTARY STUDIES ELECTIVE": 'CSE1*TRNF',
  "UNASSIGNED OPEN ELECTIVE":       'OPEN*TRNF',
  "U/A SCIENCE ELECTIVE":           'SCI1*TRNF',
  "UNASSIGNED SCIENCE":             'SCI2*TRNF',
  "UNASSIGNED TECHNICAL ELECTIVE":  'TE*TRNF',
  "U/A COMPUTER SCIENCE 1ST YR":    '~CS*TRNF',
  "UNASSIGNED PHYSICS 1ST YR":      '~PHYS*TRF',
  "UNASSIGNED ARTS 1ST YR":         '~ARTS*TRF',
  "U/A OPEN ARTS":                  'ARTS*TRNF',
  "COMPLIMENTARY STUDIES ELECTIVE": 'CSE2*TRNF',
  "UNASSIGNED SCIENCE ELECTIVE":    'SCI3*TRNF',
  "BLOCK TRANSFER":                 'BLCK*TRNF',
  "U/A BASIC SCIENCE":              'SCI4*TRNF'
};

module.exports = { formatStudentData, formatCourseData, formatTransferData };