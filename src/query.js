/**
 * MOST Web Framework 3.0 Codename Zero Gravity
 * Copyright (c) 2014-2019, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import {hasOwnProperty} from './has-own-property';
// eslint-disable-next-line no-unused-vars
//noinspection JSUnusedLocalSymbols

const REFERENCE_REGEXP = /^\$/;

// noinspection JSUnusedGlobalSymbols
/**
 * Returns a string which represents the name of the first property of an object
 * @param {*} any
 * @returns {*}
 */
function getOwnPropertyName(any) {
    if (any) {
        // noinspection LoopStatementThatDoesntLoopJS
        for(let key in any) {
            if  (hasOwnProperty(any, key)) {
                return key;
            }
        }
    }
}

// noinspection JSUnusedGlobalSymbols
/**
 * Returns true if the specified string is a method (e.g. $concat) or name reference (e.g. $dateCreated)
 * @param {string} str
 * @returns {*}
 */
function isMethodOrNameReference(str) {
    return REFERENCE_REGEXP.test(str)
}

// noinspection JSUnusedGlobalSymbols
/**
 * Returns a string which indicates that the given string is following name reference format.
 * @param {string} str
 * @returns {string}
 */
function hasNameReference(str) {
    if (str) {
        if (REFERENCE_REGEXP.test(str)) {
            return str.substr(1);
        }
    }
}

// noinspection JSUnusedGlobalSymbols
/**
 * Returns a string which indicates that the given object has a property with a name reference
 * e.g. $UserTable, $name etc.
 * @param {*} any
 * @returns {string|*}
 */
function getOwnPropertyWithNameRef(any) {
    if (any) {
        // noinspection LoopStatementThatDoesntLoopJS
        for(let key in any) {
            if (Object.prototype.hasOwnProperty.call(any, key) && REFERENCE_REGEXP.test(key)) {
                return key;
            }
            break;
        }
    }
}

export {
    REFERENCE_REGEXP,
    getOwnPropertyName,
    isMethodOrNameReference,
    hasNameReference,
    getOwnPropertyWithNameRef
};