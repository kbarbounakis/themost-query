const {SqlFormatter} = require('../');
describe('SqlFormatter', () => {
    it('should format where $eq', () => {
        const formatter = new SqlFormatter();
        let sql = formatter.formatWhere({
                "EmployeeID": 2
            });
        expect(sql).toBe('(EmployeeID=2)');
        sql = formatter.formatWhere({
                "EmployeeID": {
                    "$eq": 1
                }
            });
        expect(sql).toBe('(EmployeeID=1)');

        sql = formatter.escape({
                $eq: [
                    '$EmployeeID',
                    1
                ]
            });
        expect(sql).toBe('EmployeeID=1');

        sql = formatter.formatWhere({
                $expr: {
                    $eq: [
                        '$EmployeeID',
                        1
                    ]
                }
            });
    });
});