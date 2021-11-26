const index = require('./index');

describe("test index", () => {
    test("test config", () => {
        expect(index.sequelize.config.host).toBe('themis.xn--9xa.network');
    }),
    test("test models", () => {
        expect(typeof index.sequelize.models).toBe("object");
        expect(Object.keys(index.sequelize.models)).toEqual(["Student", "Enrollment", "FileTime", "CoreCourse"]);
    })
})