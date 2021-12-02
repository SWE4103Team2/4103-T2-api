//const { not } = require('sequelize/types/lib/operators');
const fileVal = require('./fileValidators');

describe("test fileValidators",()=>{
    //validateStudents
    test("test validateStudents no input error", () => {
        let test1;
        test1 = [""];
        expect(()=> {
            fileVal.validateStudents(test1);
        }).toThrow('StudentFileException');
    });
    test("test validateStudents correct input error", () => {
        let test1;
        test1 = ["Student_ID", "Fname-Lname","Email","Program","Campus","Start_Date"];
        expect(()=> {
            fileVal.validateStudents(test1);
        }).not.toThrow('StudentFileException');
    });
    test("test validateStudents invalid input", () => {
        let test1;
        test1 = ["Student_ID", "Fname-Lname","Program","Campus","Start_Date"];
        expect(()=> {
            fileVal.validateStudents(test1);
        }).toThrow('StudentFileException');
    });
    //validateCourses
    test("test validateCourses no input", () => {
        let test1;
        test1 = [""];
        expect(()=> {
            fileVal.validateCourses(test1);
        }).toThrow('CourseFileException');
    });
    test("test validateCourses correct input", () => {
        let test1;
        test1 = ["Student_ID", "Term","Course","Title","Grade","Credit_Hrs","Grade_Pts","Section","Notes_Codes"];
        expect(()=> {
            fileVal.validateCourses(test1);
        }).not.toThrow('CourseFileException');
    });
    test("test validateCourses invalid input", () => {
        let test1;
        test1 = ["Student_ID","Course","Title","Grade","Credit_Hrs","Grade_Pts","Section","Notes_Codes"];
        expect(()=> {
            fileVal.validateCourses(test1);
        }).toThrow('CourseFileException');
    });
    //validateTransfers
    test("test validateTransfers no input", () => {
        let test1;
        test1 = [""];
        expect(()=> {
            fileVal.validateTransfers(test1);
        }).toThrow('TransferFileException');
    })
    test("test validateTransfers correct input", () => {
        let test1;
        test1 = ["Student_ID","Course","Title","Credit_Hrs","Transfer_Date"];
        expect(()=> {
            fileVal.validateTransfers(test1);
        }).not.toThrow('TransferFileException');
    });
    test("test validateTransfers invalid input", () => {
        let test1;
        test1 = ["Student_ID","Title","Credit_Hrs","Transfer_Date"];
        expect(()=> {
            fileVal.validateTransfers(test1);
        }).toThrow('TransferFileException');
    });
})