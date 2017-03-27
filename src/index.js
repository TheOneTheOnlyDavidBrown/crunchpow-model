'use strict';
const Promise = require('promise');
const request = require('superagent');

class CrunchPowModel {
    constructor(modelName, schema) {
        this._schema = schema || {};
        Object.assign(this, this._constructTemplateObject(this, this._schema));
        this._modelName = modelName;
        this.setBaseEndpoint(`api/${this._modelName}`);
    }
    create(data, path) {
        path = path || [];
        let prop;
        for (prop in data) {
            path.push(prop);
            if (typeof data[prop] === 'object' && !Array.isArray(data[prop])) {
                // recurse
                this.create(data[prop], path);
            } else {
                // set property
                this.prop(path.join('.'), data[prop]);
            }
            path.pop();
        }
    }
    prop(propName, propValue) {
        this._setProp(propName, propValue);
    }
    setBaseEndpoint(baseEndpoint) {
        this._baseEndpoint = baseEndpoint;
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
    _setProp(propName, propValue) {
        if (this._existsInSchemaWithType(this._schema, propName, propValue)) {
            Object.assign(this, this._setValue(this, propName, propValue));
        }
    }
    _setValue(obj, key, value) {
        let exploded = key.split('.');
        if (exploded.length === 1) {
            obj[key] = value;;
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
        if (objKey === '*') return true;
        return  objKey.split('|').find((key) => {
            if (key === 'array') return Array.isArray(value);
            return key === typeof value;
        });
    }
    _callApi(method, id) {
        id = id || '';
        let url = `/${this._baseEndpoint}/${id}`;
        // promise that sends the object (without schema) to the backend
        return new Promise((resolve, reject) => request[method](url, this)
            .then((response) => resolve(response), (error) => reject(error)), (error) => {});
    }
    save() {
        return this._callApi('post');
    }

    destroy(id) {
        return this._callApi('del', id);
    }

    // uses GET to get one (if id is present) or all of the model
    fetch(id) {
        return this._callApi('get', id);
    }
}

module.exports = CrunchPowModel;
