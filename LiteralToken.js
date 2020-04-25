const {Token} = require("./Token");

/**
 * @class
 */
class LiteralToken extends Token {

    static get LiteralType() 
    {
        return {
            Null: 'Null',
            String: 'String',
            Boolean: 'Boolean',
            Single: 'Single',
            Double: 'Double',
            Decimal: 'Decimal',
            Int: 'Int',
            Long: 'Long',
            Binary: 'Binary',
            DateTime: 'DateTime',
            Guid: 'Guid',
            Duration: 'Duration'
        }
    }
    
    static get StringType() {
        return {
            None: 'None',
            Binary: 'Binary',
            DateTime: 'DateTime',
            Guid: 'Guid',
            Time: 'Time',
            DateTimeOffset: 'DateTimeOffset'
        };
    }

    static get PositiveInfinity() { 
        return new LiteralToken(NaN, LiteralToken.LiteralType.Double);
    } 
    static get NegativeInfinity() { 
        return new LiteralToken(NaN, LiteralToken.LiteralType.Double);
    } 
    static get NaN() { 
        return new LiteralToken(NaN, LiteralToken.LiteralType.Double);
    } 
    static get True() { 
        return new LiteralToken(true, LiteralToken.LiteralType.Boolean);
    } 
    static get False() { 
        return new LiteralToken(false, LiteralToken.LiteralType.Boolean);
    } 
    static get Null() { 
        return new LiteralToken(null, LiteralToken.LiteralType.Null);
    } 

    /**
     * @param {*} value
     * @param {string} literalType
     * @constructor
     */
    constructor(value, literalType) {
        super(Token.TokenType.Literal);
        this.value = value;
        this.literalType = literalType;
    }
}

module.exports = {
    LiteralToken
};