'use strict';
class CPModel {
    constructor(schema) {
        this.schema = schema || {};
//        Object.assign(this._constructTemplateObject(this, this.schema), this);
    }
    _constructTemplateObject(base, schema) {
        // loop through and remove all values;
        for(let prop in schema) {
            if (typeof prop !== 'object' && !!base[prop]) {
//                console.log('prop',base);
                console.log('****', base)
                base[prop] = null;
            } else if (!!base[prop]) {
                //console.log('***',prop)
                return this._constructTemplateObject(base[prop], schema[prop]);
            }
        }

    }
    create(data) {
        Object.assign(this, data);
    }
    prop(propName, propValue) {
        if (!propValue) return this._getProp(propName);
        else this._setProp(propName, propValue);
    }
    _setProp(propName, propValue) {
        if (this._existsInSchemaWithType(this.schema, propName, propValue) && this._isCorrectType(propName,propValue)) {
            // recursive set
            Object.assign(this._setValue(this, propName, propValue), this);
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
    _getProp(propName) {
        return this[propName];
    }
    _existsInSchemaWithType(obj, key, value) {
        let exploded = key.split('.');
        if (exploded.length === 1) {
            return !!obj[key] && typeof value === obj[key];
        }
        else if (obj[exploded[0]]) {
            // add first prop el to obj
            let newObj = obj[exploded[0]];
            // remove first prop el
            exploded.shift();
            return this._existsInSchemaWithType(newObj, exploded.join('.'), value);
        }
    }

    _isCorrectType(propName, propValue) {
        // find in schema
        // parse schema value
        // index of parsed schema value exists in typeof propValue
        return true;
    }

    // CRUD
    //save(){}
    //remove(){}
}
module.exports = CPModel;
