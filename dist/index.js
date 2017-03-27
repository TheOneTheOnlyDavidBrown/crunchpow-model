'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promise = require('promise');
var request = require('superagent');

var CPModel = function () {
    function CPModel(modelName, schema) {
        _classCallCheck(this, CPModel);

        this._schema = schema || {};
        Object.assign(this, this._constructTemplateObject(this, this._schema));
        this._modelName = modelName;
        this.setBaseEndpoint('api/' + this._modelName);
    }

    _createClass(CPModel, [{
        key: 'create',
        value: function create(data, path) {
            path = path || [];
            var prop = void 0;
            for (prop in data) {
                path.push(prop);
                if (_typeof(data[prop]) === 'object' && !Array.isArray(data[prop])) {
                    // recurse
                    this.create(data[prop], path);
                } else {
                    // set property
                    this.prop(path.join('.'), data[prop]);
                }
                path.pop();
            }
        }
    }, {
        key: 'prop',
        value: function prop(propName, propValue) {
            this._setProp(propName, propValue);
        }
    }, {
        key: 'setBaseEndpoint',
        value: function setBaseEndpoint(baseEndpoint) {
            this._baseEndpoint = baseEndpoint;
        }
    }, {
        key: '_constructTemplateObject',
        value: function _constructTemplateObject(base, schema) {
            var rtn = {};
            // loop through and remove all values;
            for (var prop in schema) {
                if (_typeof(schema[prop]) === 'object') {
                    rtn[prop] = this._constructTemplateObject({}, schema[prop]);
                } else {
                    rtn[prop] = null;
                }
            }
            return rtn;
        }
    }, {
        key: '_setProp',
        value: function _setProp(propName, propValue) {
            if (this._existsInSchemaWithType(this._schema, propName, propValue)) {
                Object.assign(this, this._setValue(this, propName, propValue));
            }
        }
    }, {
        key: '_setValue',
        value: function _setValue(obj, key, value) {
            var exploded = key.split('.');
            if (exploded.length === 1) {
                obj[key] = value;;
            } else if (obj[exploded[0]]) {
                // add first prop el to obj
                var newObj = obj[exploded[0]];
                // remove first prop el
                exploded.shift();
                return this._setValue(newObj, exploded.join('.'), value);
            }
        }
    }, {
        key: '_existsInSchemaWithType',
        value: function _existsInSchemaWithType(obj, key, value) {
            var exploded = key.split('.');
            if (exploded.length === 1) {
                return (!!obj[key] || obj[key] === null) && this._validType(value, obj[key]);
            } else if (obj[exploded[0]]) {
                // add first prop el to obj
                var newObj = obj[exploded[0]];
                // remove first prop el
                exploded.shift();
                return this._existsInSchemaWithType(newObj, exploded.join('.'), value);
            }
        }
    }, {
        key: '_validType',
        value: function _validType(value, objKey) {
            if (objKey === '*') return true;
            return objKey.split('|').find(function (key) {
                if (key === 'array') return Array.isArray(value);
                return key === (typeof value === 'undefined' ? 'undefined' : _typeof(value));
            });
        }
    }, {
        key: '_callApi',
        value: function _callApi(method, id) {
            var _this = this;

            id = id || '';
            var url = '/' + this._baseEndpoint + '/' + id;
            // promise that sends the object (without schema) to the backend
            return new Promise(function (resolve, reject) {
                return request[method](url, _this).then(function (response) {
                    return resolve(response);
                }, function (error) {
                    return reject(error);
                });
            }, function (error) {});
        }
    }, {
        key: 'save',
        value: function save() {
            return this._callApi('post');
        }
    }, {
        key: 'destroy',
        value: function destroy(id) {
            return this._callApi('del', id);
        }

        // uses GET to get one (if id is present) or all of the model

    }, {
        key: 'fetch',
        value: function fetch(id) {
            return this._callApi('get', id);
        }
    }]);

    return CPModel;
}();

module.exports = CPModel;