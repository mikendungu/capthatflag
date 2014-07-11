'use strict';

var _ = require('lodash')
    , utils = require('./utils')
    , EntityAttributes;

/**
 * Entity attributes class.
 * @class shared.EntityAttributes
 * @classdesc Utility class for managing entity attributes.
 * @property {object} _attributes - Internal attributes object literal.
 */
EntityAttributes = utils.inherit(null, {
    _attributes: null
    /**
     * Creates a new set of entity attributes.
     * @constructor
     * @param {object} attrs - Initial attributes.
     */
    , constructor: function(attrs) {
        this._attributes = attrs || {};
    }
    /**
     * Returns all, multiple or a single value from these attributes.
     * @method shared.EntityAttributes#get
     * @param {string|array} name - Attribute(s) to get, omit to get all.
     * @return {string|array} Attribute value(s).
     */
    , get: function(name) {
        if (typeof name === 'string') {
            return this._attributes[name];
        } else if (name instanceof Array) {
            return _.pick(this._attributes, name);
        } else {
            return _.clone(this._attributes);
        }
    }
    /**
     * Sets multiple or a single value for these attributes.
     * @method shared.EntityAttributes#set
     * @param {array|string} name - Attribute(s) to set.
     * @param {string} value - Attribute value, omit if when multiple values
     */
    , set: function(name, value) {
        if (typeof name === 'string') {
            this._attributes[name] = value;
        } else {
            _.extend(this._attributes, name);
        }
    }
});

module.exports = EntityAttributes;
