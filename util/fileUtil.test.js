const fileUtil = require('./fileUtil');

describe("test fileUtil", () => {
    //readFile
    test("test readFile no input", () => {
        expect(()=> {
            fileUtil.readFile();
        }).toThrow('NullFileException');
    });
    /*test("test readFile input", () => {
        let test1;
        test1 = "test to string";
        expect(fileUtil.readFile(test1)).toEqual("test to string");
    });*/
    //splitByNewLine
    test("test splitByNewLine with no newline", () => {
        let test1;
        test1 = "this is my test";
        expect(fileUtil.splitByNewLine(test1)).toEqual(["this is my test"]);
    });
    test("test splitByNewLine with one newline", () => {
        let test1;
        test1 = "this is \n my test";
        expect(fileUtil.splitByNewLine(test1)).toEqual(["this is "," my test"]);
    });
    test("test splitByNewLine with no param", () => {
        let test1;
        test1 = "";
        expect(fileUtil.splitByNewLine(test1)).toEqual([]);
    });
    //splitByTab
    test("test splitByTab with no tab", () => {
        let test1;
        test1 = "this is my test";
        expect(fileUtil.splitByTab(test1)).toEqual(["this is my test"]);
    });
    test("test splitByTab with one tab", () => {
        let test1;
        test1 = "this is \r my test";
        expect(fileUtil.splitByTab(test1)).toEqual(["this is  my test"]);
    });
    test("test splitByTab with no param", () => {
        let test1;
        test1 = "";
        expect(fileUtil.splitByTab(test1)).toEqual([""]);
    });
    //getDataObj
    test("test getDataObj", () =>{
        let keys;
        keys = [1]
        let linesArr;
        linesArr = ["here is my file"];
        let filename;
        filename = "File";
        expect(fileUtil.getDataObj(keys,linesArr,filename)).toEqual([{"1":"here is my file","fileID":"File"}]);
    });
})