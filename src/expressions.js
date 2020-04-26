/**
 * MOST Web Framework 3.0 Codename Zero Gravity
 * Copyright (c) 2014-2019, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
/**
 * @class
 * @param {*=} p0 The left operand
 * @param {string=} oper The operator
 * @param {*=} p1 The right operand
 * @constructor
 */
class ArithmeticExpression {
    constructor(p0, oper, p1) {
        this.left = p0;
        this.operator = oper || '$add';
        this.right = p1;
    }

    exprOf() {
        if (this.left == null) {
            throw new Error('Expected left operand');
        }
        if (this.operator == null)
            throw new Error('Expected arithmetic operator.');
        if (this.operator.match(ArithmeticExpression.OperatorRegEx) == null) {
            throw new Error('Invalid arithmetic operator.');
        }
        //build right operand e.g. { $add:[ 5 ] }
        const result = { };
        Object.defineProperty(result, this.operator, {
            value: [ this.left.exprOf(), this.right.exprOf() ],
            enumerable: true,
            configurable: true
        });
        if (this.right == null) {
            result[this.operator]=[null];
        }
        //return query expression
        return result;
    }
}

ArithmeticExpression.OperatorRegEx = /^(\$add|\$subtract|\$multiply|\$divide|\$mod|\$bit)$/g;

/**
 * @class
 * @param {String} name The name of the current member
 * @constructor
 */
class MemberExpression {
    constructor(name) {
        this.name = name;
    }

    exprOf() {
        return `$${this.name}`;
    }
}

/**
 * @class
 * @constructor
 * @param {string} oper
 * @param {*} args
 */
class LogicalExpression {
    constructor(oper, args) {
        this.operator = oper || '$and' ;
        this.args = args || [];
    }

    exprOf() {
        if (this.operator.match(LogicalExpression.OperatorRegEx)===null)
            throw new Error('Invalid logical operator.');
        if (Array.isArray(this.args) === false)
            throw new Error('Logical expression arguments cannot be null at this context.');
        if (this.args.length===0)
            throw new Error('Logical expression arguments cannot be empty.');
        const p = {};
        p[this.operator] = [];
        for (let i = 0; i < this.args.length; i++) {
            const arg = this.args[i];
            if (typeof arg === 'undefined' || arg===null)
                p[this.operator].push(null);
            else if (typeof arg.exprOf === 'function')
                p[this.operator].push(arg.exprOf());
            else
                p[this.operator].push(arg);
        }
        return p;
    }
}

LogicalExpression.OperatorRegEx = /^(\$and|\$or|\$not|\$nor)$/g;

/**
 * @class
 * @param {*} value The literal value
 * @constructor
 */
class LiteralExpression {
    constructor(value) {
        this.value = value;
    }

    exprOf() {
        if (typeof this.value === 'undefined')
            return null;
        return this.value;
    }
}

/**
 * @class
 * @param {*} left
 * @param {string=} op
 * @param {*=} right
 * @constructor
 */
class ComparisonExpression {
    constructor(left, op, right) {
        this.left = left;
        this.operator = op || '$eq';
        this.right = right;
    }

    exprOf() {
        if (typeof this.operator === 'undefined' || this.operator===null)
            throw new Error('Expected comparison operator.');

        let p;
        if ((this.left instanceof MethodCallExpression) ||
            (this.left instanceof ArithmeticExpression))
        {
            p = {};
            p[this.operator] = [];
            p[this.operator].push(this.left.exprOf());
            if (this.right && typeof this.right.exprOf === 'function')
            {
                p[this.operator].push(this.right.exprOf());
            }
            else
            {
                p[this.operator].push(this.right == null ? null : this.right);
                
            }
            return p;
        }
        else if (this.left instanceof MemberExpression) {
            p = { };
            Object.defineProperty(p, this.left.name, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: {}
            });
            if (this.right && typeof this.right.exprOf === 'function')
            {
                p[this.left.name][this.operator] = this.right.exprOf();
            }
            else
            {
                p[this.left.name][this.operator] = (this.right == null ? null : this.right);
            }
            return p;
        }
        throw new Error('Comparison expression has an invalid left operand. Expected a method call, an arithmetic or a member expression.');
    }
}

ComparisonExpression.OperatorRegEx = /^(\$eq|\$ne|\$lte|\$lt|\$gte|\$gt|\$in|\$nin)$/g;

/**
 * Creates a method call expression
 * @class
 */
class MethodCallExpression {
    constructor(name, args) {
        /**
         * Gets or sets the name of this method
         * @type {String}
         */
        this.name = name;
        /**
         * Gets or sets an array that represents the method arguments
         * @type {Array}
         */
        this.args = [];
        if (Array.isArray(args))
            this.args = args;
    }

    /**
     * Converts the current method to the equivalent query expression e.g. { orderDate: { $year: [] } } which is equivalent with year(orderDate)
     * @returns {*}
     */
    exprOf() {
        const method = {};
        const name = '$'.concat(this.name);
        //set arguments array
        if (this.args.length===0)
            throw new Error('Unsupported method expression. Method arguments cannot be empty.');
        if (this.args.length === 1) {
            const arg = this.args[0];
            if (arg == null) {
                throw new Error('Method call argument cannot be null at this context.');
            }
            method[name] = arg.exprOf();
        }
        else {
            method[name] = this.args.map(value => {
                if (value == null) {
                    return null;
                }
                if (typeof value.exprOf === 'function') {
                    return value.exprOf();
                }
                return value;
            })
        }
        return method;
    }
}

class SequenceExpression {
    constructor() {
        //
        this.value = [];
    }

    exprOf() {
        // eslint-disable-next-line no-empty-pattern
        return this.value.reduce((previousValue, currentValue, currentIndex) => {
            if (currentValue instanceof MemberExpression) {
                Object.defineProperty(previousValue, currentValue.name, {
                    value: 1,
                    enumerable: true,
                    configurable: true
                });
                return previousValue;
            }
            else if (currentValue instanceof MethodCallExpression) {
                // validate method name e.g. Math.floor and get only the last part
                const name = currentValue.name.split('.');
                Object.defineProperty(previousValue, `${name[name.length-1]}${currentIndex}`, {
                    value: currentValue.exprOf(),
                    enumerable: true,
                    configurable: true
                });
                return previousValue;
            }
            throw new Error('Sequence expression is invalid or has a member which its type has not implemented yet');
        }, {});
    }

}

class ObjectExpression {
    constructor() {
        //
    }
    exprOf() {
        const finalResult = { };
        Object.keys(this).forEach( key => {
            if (typeof this[key].exprOf === 'function') {
                Object.defineProperty(finalResult, key, {
                    value: this[key].exprOf(),
                    enumerable: true,
                    configurable: true
                });
                return;
            }
            throw new Error('Object expression is invalid or has a member which its type has not implemented yet');
        });
        return finalResult;
    }
}

/**
 * @enum
 */
class Operators {
    static get Not() {
        return '$not';
    }
    static get Mul() {
        return '$multiply';
    }
    static get Div() {
        return '$divide';
    }
    static get Mod() {
        return '$mod';
    }
    static get Add() {
        return '$add';
    }
    static get Sub() {
        return '$subtract';
    }
    static get Lt() {
        return '$lt';
    }
    static get Gt() {
        return '$gt';
    }
    static get Le() {
        return '$lte';
    }
    static get Ge() {
        return '$gte';
    }
    static get Eq() {
        return '$eq';
    }
    static get Ne() {
        return '$ne';
    }
    static get In() {
        return '$in';
    }
    static get NotIn() {
        return '$nin';
    }
    static get And() {
        return '$and';
    }
    static get Or() {
        return '$or';
    }
    static get BitAnd() {
        return '$bit';
    }
}

/**
* @param {*=} left The left operand
* @param {string=} operator The operator
* @param {*=} right The right operand
* @returns ArithmeticExpression
*/
function createArithmeticExpression(left, operator, right) {
    return new ArithmeticExpression(left, operator, right);
}
/**
* @param {*=} left The left operand
* @param {string=} operator The operator
* @param {*=} right The right operand
* @returns ComparisonExpression
*/
function createComparisonExpression(left, operator, right) {
    return new ComparisonExpression(left, operator, right);
}
/**
* @param {string=} name A string that represents the member's name
* @returns MemberExpression
*/
function createMemberExpression (name) {
    return new MemberExpression(name);
}
/**
* @param {*=} value The literal value
* @returns LiteralExpression
*/
function createLiteralExpression(value) {
    return new LiteralExpression(value);
}
/**
* Creates a method call expression of the given name with an array of arguments
* @param {String} name
* @param {Array} args
* @returns {MethodCallExpression}
*/
function createMethodCallExpression(name, args) {
    return new MethodCallExpression(name, args);
}
/**
* Creates a logical expression
* @param {string} operator The logical operator
* @param {Array=} args An array that represents the expression's arguments
* @returns {LogicalExpression}
*/
function createLogicalExpression(operator, args) {
    return new LogicalExpression(operator, args);
}
/**
* Gets a boolean value that indicates whether or not the given object is an ArithmeticExpression instance.
* @param {*} obj
* @returns boolean
*/
function isArithmeticExpression(obj) {
    return obj instanceof ArithmeticExpression;
}
/**
* Gets a boolean value that indicates whether or not the given operator is an arithmetic operator.
* @param {string} op
*/
function isArithmeticOperator(op) {
    if (typeof op === 'string')
        return (op.match(ArithmeticExpression.OperatorRegEx)!==null);
    return false;
}
/**
* Gets a boolean value that indicates whether or not the given operator is an arithmetic operator.
* @param {string} op
* @returns boolean
*/
function isComparisonOperator(op) {
    if (typeof op === 'string')
        return (op.match(ComparisonExpression.OperatorRegEx)!==null);
    return false;
}
/**
* Gets a boolean value that indicates whether or not the given operator is a logical operator.
* @param {string} op
* @returns boolean
*/
function isLogicalOperator(op) {
    if (typeof op === 'string')
        return (op.match(LogicalExpression.OperatorRegEx)!==null);
    return false;
}
/**
* Gets a boolean value that indicates whether or not the given object is an LogicalExpression instance.
* @param {*} obj
* @returns boolean
*/
function isLogicalExpression(obj) {
    return obj instanceof LogicalExpression;
}
/**
* Gets a boolean value that indicates whether or not the given object is an ComparisonExpression instance.
* @param {*} obj
* @returns boolean
*/
function isComparisonExpression(obj) {
    return obj instanceof ComparisonExpression;
}
/**
* Gets a boolean value that indicates whether or not the given object is an MemberExpression instance.
* @param {*} obj
* @returns boolean
*/
function isMemberExpression(obj) {
    return obj instanceof MemberExpression;
}
/**
* Gets a boolean value that indicates whether or not the given object is an LiteralExpression instance.
* @param {*} obj
* @returns boolean
*/
function isLiteralExpression(obj) {
    return obj instanceof LiteralExpression;
}
/**
* Gets a boolean value that indicates whether or not the given object is an MemberExpression instance.
* @param {*} obj
* @returns boolean
*/
function isMethodCallExpression(obj) {
    return obj instanceof MethodCallExpression;
}

export {
    ArithmeticExpression,
    MemberExpression,
    LogicalExpression,
    LiteralExpression,
    ComparisonExpression,
    MethodCallExpression,
    SequenceExpression,
    ObjectExpression,
    Operators,
    createArithmeticExpression,
    createComparisonExpression,
    createMemberExpression,
    createLiteralExpression,
    createMethodCallExpression,
    createLogicalExpression,
    isArithmeticExpression,
    isArithmeticOperator,
    isComparisonOperator,
    isLogicalOperator,
    isLogicalExpression,
    isComparisonExpression,
    isMemberExpression,
    isLiteralExpression,
    isMethodCallExpression 
}