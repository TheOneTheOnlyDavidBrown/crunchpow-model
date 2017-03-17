'use strict';
class CPModel {
    constructor(schema) {
        this.schema = schema || {};
        Object.assign(this, this._constructTemplateObject(this, schema));
    }
    _constructTemplateObject(base, schema) {
        let rtn = {};
        // loop through and remove all values;
        for(let prop in schema) {
            if (typeof schema[prop] === 'object') {
                rtn[prop] = this._constructTemplateObject({}, schema[prop]);
            } else {
                rtn[prop] = null;
            }
        }
        return rtn;
    }
    create(data) {
        // TODO: recursively set the data via _setValue so that type is correct
        Object.assign(this, data);
    }
    prop(propName, propValue) {
        this._setProp(propName, propValue);
    }
    _setProp(propName, propValue) {
        if (this._existsInSchemaWithType(this.schema, propName, propValue)) {
            // recursive set
            Object.assign(this, this._setValue(this, propName, propValue));
        }
    }
    _setValue(obj, key, value) {
        let exploded = key.split('.');
        if (exploded.length === 1) {
            return obj[key] = value;;
        }
        else if (obj[exploded[0]]) {
            // add first prop el to obj
            let newObj = obj[exploded[0]];
            // remove first prop el
            exploded.shift();
            return this._setValue(newObj, exploded.join('.'), value);
        }

    }
    _existsInSchemaWithType(obj, key, value) {
        let exploded = key.split('.');
        if (exploded.length === 1) {
            return (!!obj[key] || obj[key] === null) && this._validType(value, obj[key]);
        }
        else if (obj[exploded[0]]) {
            // add first prop el to obj
            let newObj = obj[exploded[0]];
            // remove first prop el
            exploded.shift();
            return this._existsInSchemaWithType(newObj, exploded.join('.'), value);
        }
    }
    _validType(value, objKey) {
        return  objKey.split('|').find((key) => {
            if (key === 'array') return Array.isArray(value);
            return key === typeof value;
        });
    }

    // CRUD
    // save(){}
    // remove(){}
}
module.exports = CPModel;
