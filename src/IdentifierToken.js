const {Token} = require("./Token");
/**
 * @class IdentifierToken
 * @param {string} name The identifier's name
 * @constructor
 */
class IdentifierToken extends Token {
    constructor(name) {
        super(Token.TokenType.Identifier);
        this.identifier = name;
    }

    valueOf() {
        return this.identifier;
    }
}
module.exports = {
    IdentifierToken
};
