import {QueryExpression} from "./query";

/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
export declare class QueryUtils {
    /**
     *
     * @param {string=} entity
     * @returns {QueryExpression}
     */
    static query(entity?: string): QueryExpression;

    /**
     *
     * @param field
     * @returns {QueryExpression}
     */
    static select(...field: any[]): QueryExpression;

    /**
     *
     * @param obj
     * @returns {QueryExpression}
     */
    static insert(obj: any): QueryExpression;

    /**
     *
     * @param {string} entity
     * @returns {QueryExpression}
     */
    static update(entity: string): QueryExpression;

    /**
     *
     * @param {string} entity
     * @returns {QueryExpression}
     */
    static delete(entity: string): QueryExpression;
}

export declare class SqlUtils {
    /**
     *
     * @param {string} sql
     * @param values
     * @returns {string}
     */
    static format(sql: string, values: any): string

    /**
     *
     * @param val
     * @returns {string}
     */
    static escape(val: any): string
}

/**
 * Gets the first property name of an object.
 * @param any - The object to search
 * @returns {string} - A string which represents the name of the first property of the specified object
 */
export declare function getOwnPropertyName(any?: any): string;

/**
 * Checks if the given string is a method or name reference e.g. $dateCreated or $and etc.
 * @param {string} str - A string expression to validate
 * @returns {boolean}
 */
export declare function isMethodOrNameReference(str: string): boolean;
/**
 * Returns a string which indicates that the given object has a property with a name reference
 * e.g. $UserTable, $name etc.
 * @param {*} any
 * @returns {string}
 */
export declare function getOwnPropertyWithNameRef(any: any): string;
/**
 * Returns a string which indicates that the given string is following name reference format.
 * @param {string} str
 * @returns {string}
 */
export declare function hasNameReference(str: string): string;