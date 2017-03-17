'use strict';
class CPModel {
    constructor(schema) {
        this.schema = schema;
    }
    create(data) {
        Object.assign(this, data);
    }
    prop(propName, propValue) {
        if (!propValue) return this._getProp(propName);
        else this._setProp(propName, propValue);
    }
    _setProp(propName, propValue) {
        if (this[propName] !== undefined && typeof this[propName] === typeof propValue) {
            this[propName] = propValue;
        }
    }
    _getProp(propName) {
        return this[propName];
    }
    _isInSchema() {

    }
    _isCorrectType(propName, propValue) {
        // find in schema
        // parse schema value
        // index of parsed schema value exists in typeof propValue
    }

    // CRUD
    //save(){}
    //remove(){}
}
module.exports = CPModel;
