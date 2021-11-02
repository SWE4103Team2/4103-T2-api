const { splitByTab, splitByNewLine, getDataObj } = require("./fileUtil");
const { validateStudents, validateCourses, validateTransfers } = require("./fileValidators");

/** 
 * Formatting the Student data file
*/
const formatStudentData = (data, fileName) => {
  const lines = splitByNewLine(data);
  const keys = splitByTab(lines[0]);

  validateStudents(keys);

  keys[1] = 'Name';
  lines.shift();

  const studentData = getDataObj(keys, lines, fileName);

  return studentData;
};


/** 
 * Formatting the Course data file
*/
const formatCourseData = (data, fileName) => {
  const lines = splitByNewLine(data);
  const keys = splitByTab(lines[0]);

  validateCourses(keys);

  lines.shift();

  const courseData = getDataObj(keys, lines, fileName);

  return courseData;
};

/**
 * Formatting the transfer data file
 * Requires a bit of extra work because some fields are blank that are needed in the enrollment table
 */
const formatTransferData = (data, fileName) => {
  const lines = splitByNewLine(data);
  const keys = splitByTab(lines[0]);

  validateTransfers(keys);

  lines.shift();

  const transferData = getDataObj(keys, lines, fileName);

  let stuID, count;                               //the current student id, used below and the number of 

  transferData.forEach(line => {
    line.Grade = "CR";
    line.Term = "TRANSFR";
    line.Section = "UNKWN";
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
        if(line.Title.contains("SCIENCE")){
          line.Course = 'SCI*T' + count;
        }
        else if(line.Title.contains("OPEN")){
          line.Course = 'OPEN*T' + count;
        }
        else if(line.Title.contains("TECHNICAL")){
          line.Course = 'TE*T' + count;
        }
        else if(line.Title.contains("STUDIES")){
          line.Course = 'CSE*T' + count;
        }
        else{
          line.Course = 'UNKN*T' + count;              
        }
      }
    }
  });
  return transferData;
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
  "U/A COMPUTER SCIENCE 1ST YR":    '~CS*TRFR',
  "UNASSIGNED PHYSICS 1ST YR":      '~PHYS*TRF',
  "UNASSIGNED ARTS 1ST YR":         '~ARTS*TRF',
  "U/A OPEN ARTS":                  'ARTS*TRNF',
  "COMPLIMENTARY STUDIES ELECTIVE": 'CSE2*TRNF',
  "UNASSIGNED SCIENCE ELECTIVE":    'SCI3*TRNF',
  "BLOCK TRANSFER":                 'BLCK*TRNF',
  "U/A BASIC SCIENCE":              'SCI4*TRNF'
};

module.exports = { formatStudentData, formatCourseData, formatTransferData };