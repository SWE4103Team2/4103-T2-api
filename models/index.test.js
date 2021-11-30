const index = require('./index');

describe("test index", () => {
    test("test config", () => {
        expect(typeof index.sequelize.config).toBe("object");
        expect(index.sequelize.config.host).toBe('swe4103t2bruh.mysql.database.azure.com');
        //expect(index.sequelize.config.dialect).toEqual('mariadb');
        //expect(index.sequelize.config.logging).toBe(false);
        //expect(Object.keys(index.sequelize.config)).toEqual(['themis.xn--9xa.network', 'mariadb']);

    }),
    test("test models", () => {
        expect(typeof index.sequelize.models).toBe("object");
        expect(Object.keys(index.sequelize.models)).toEqual(["Student", "Enrollment", "FileTime", "CoreCourse", "CourseGroups", "CoursePrereqs", "CourseReplacements", "CourseTypes"]);
    })
})
