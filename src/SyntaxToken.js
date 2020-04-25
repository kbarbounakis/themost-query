/**
 * MOST Web Framework 3.0 Codename Zero Gravity
 * Copyright (c) 2014-2019, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
const {Token} = require('./Token');
/**
 * @class
 * @param {String} chr
 * @constructor
 */
class SyntaxToken extends Token {

    static get ParenOpen() {
        return new SyntaxToken('(');
    }

    static get ParenClose() {
        return new SyntaxToken(')');
    }

    static get Slash() {
        return new SyntaxToken('/');
    }

    static get Comma() {
        return new SyntaxToken(',');
    }
    
    static get Negative() {
        return new SyntaxToken('-');
    }
    
    constructor(chr) {
        super(Token.TokenType.Syntax);
        this.syntax = chr;
    }

    valueOf() {
        return this.syntax;
    }
}

module.exports = {
    SyntaxToken
};