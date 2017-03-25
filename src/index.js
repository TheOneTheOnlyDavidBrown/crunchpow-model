'use strict';
const Promise = require('bluebird');
const request = require('superagent');

class CPModel {
    constructor(modelName, schema) {
        this._schema = schema || {};
        Object.assign(this, this._constructTemplateObject(this, this._schema));
        this._modelName = modelName;
    }
    create(data, path) {
        path = path || [];
        // TODO: recursively set the data via _setValue so that type is correct
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
        //console.log(this);
        //Object.assign(this, data);
    }
    prop(propName, propValue) {
        this._setProp(propName, propValue);
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
        return  objKey.split('|').find((key) => {
            if (key === 'array') return Array.isArray(value);
            return key === typeof value;
        });
    }

    _baseEndpoint() {
        return `api/${this._modelName}`;
    }
    _callApi(method, id) {
        id = id || '';
        // if this.id exists, use patch/put
        // else use post
        let url = `/${this._baseEndpoint()}/${id}`;
        // promise that sends the object (without schema) to the backend
        return new Promise((resolve, reject) => {
            return request[method](url, this)
                //.use(status())
                .then((response) => {
                    resolve(response);
                }, (error) => {
                    //console.log('http error', error);
                    reject(error);
                });
        }, (error) => {});
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

module.exports = CPModel;
