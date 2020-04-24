const {QueryExpression} = require('../');
describe('QueryExpression', () => {
    it('should create instance', () => {
        const query = new QueryExpression()
            .select('EmployeeID', 'FirstName', 'LastName').from('Employees');
        expect(Object.assign({ },query)).toEqual({
            "$select": {
                "Employees": [
                    "EmployeeID",
                    "FirstName",
                    "LastName"
                ]
            }
        });
        expect(query).toBeTruthy();
    });
    it('should use QueryExpression.equal()', () => {
        const query = new QueryExpression()
            .select('EmployeeID', 'FirstName', 'LastName').from('Employees')
            .where('EmployeeID').equal(2);
        expect(Object.assign({ },query)).toEqual({
            "$select": {
                "Employees": [
                    "EmployeeID",
                    "FirstName",
                    "LastName"
                ]
            },
            "$where": {
                "EmployeeID": 2
            }
        });
        expect(query).toBeTruthy();
    });

    it('should use QueryExpression.getMonth()', () => {
        const query = new QueryExpression()
            .select('OrderID', 'Customer', 'Employee').from('Orders')
            .where('OrderDate').getMonth().equal(2);
        expect(Object.assign({ },query)).toEqual({
            "$select": {
                "Orders": [
                    "OrderID",
                    "Customer",
                    "Employee"
                ]
            },
            "$where": {
                "OrderDate": {
                    "$month": 2
                }
            }
            // todo:validate $expr
            /*
            "$where": {
                $expr: [
                    $eq: [
                        { 
                            $month: '$OrderDate' 
                        }, 
                        2 
                    ]
                ]
            }
            */
        });
        expect(query).toBeTruthy();
    });

});