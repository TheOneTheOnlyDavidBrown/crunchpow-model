/*globals describe, beforeEach, it, require*/
/*jslint node: true */
'use strict';
let chai = require('chai'),
    expect = chai.expect,
    CPModel = require('../src/index'),
    should = chai.should(),
    chaiAsPromised = require("chai-as-promised"),
    nock = require('nock');

chai.use(chaiAsPromised);

describe('Cruch Pow Model', () => {
    describe('With schema', () => {
        let model;
        let schema = {
            shallow: 'string',
            favoriteNumber: 'number|string',
            wildcard: '*',
            nestedArray: {
                arr: 'array'
            },
            user: {
                id: 'number',
                name: 'string',
                address: 'string',
                profile: {
                    favoriteColor: 'string',
                    favoriteFood: 'string'
                }
            },
            aString: 'string',
            isDetective: 'boolean',
            programmingLanguages: 'array'
        };
        let data = {
            shallow: 'from schema',
            user: {
                id: 12345,
                name: 'Sherlock Holmes',
                address: '221b Baker Street',
                profile: {
                    favoriteColor: 'green',
                    favoriteFood: 'indian'
                }
            },
            isDetective: true,
            programmingLanguages: ['javascript', 'ruby']
        };

        beforeEach(() => {
            model = new CPModel('mymodel', schema);
        });

        it('should not init with the wrong data type', () => {
            // if property has a value of a certain type .create() with the property of some other type should not work

            model.create({
                isDetective: 'yes'
            });
            expect(model.isDetective).to.equal(null);
        });

        it('should have properties set to null on init', () => {
            expect(model.user.id).to.equal(null);
        });

        it('should handle booleans', () => {
            model.create(data);
            model.prop('isDetective', true);
            expect(model.isDetective).to.equal(true);
            model.prop('isDetective', false);
            expect(model.isDetective).to.equal(false);
            model.prop('isDetective', 'yes');
            expect(model.isDetective).to.equal(false);
        });

        it('should allow adding properties that are in the schema but not the init model', () => {
            model.create(data);
            model.prop('aString', 'a string');
            expect(model.aString).to.equal('a string');
            model.prop('aString', 99999999);
            expect(model.aString).to.equal('a string');
        });

        it('should allow merging of partial object of new data', () => {
            model.create({
                shallow: 'property'
            });
            expect(model.shallow).to.equal('property');
            expect(model.aString).to.equal(null);
        });

        it('should retain array data', () => {
            model.create(data);
            expect(model.programmingLanguages[0]).to.equal('javascript');
        });

        it('should allow us to update array data', () => {
            model.create(data);
            model.prop('programmingLanguages', ['java', 'dart']);
            expect(model.programmingLanguages[0]).to.equal('java');
        });

        it('should get shallow level elements', () => {
            model.create(data);
            expect(model.shallow).to.equal('from schema');
        });

        it('should get nested elements', () => {
            model.create(data);
            expect(model.user.id).to.equal(12345);
            expect(model.user.name).to.equal('Sherlock Holmes');
            expect(model.user.profile.favoriteColor).to.equal('green');
        });

        it('should get all elements by calling the root', () => {
            model.create(data);
            expect(model).to.include.keys('_schema', '_baseEndpoint', '_modelName', 'shallow', 'favoriteNumber', 'user', 'aString', 'isDetective', 'nestedArray', 'programmingLanguages');
            expect(model.user).to.have.keys('id', 'name', 'address', 'profile');
        });

        it('should allow setting of nested properties in schema', () => {
            model.create(data);
            model.prop('user.id', 321);
            expect(model.user.id).to.equal(321);
        });

        it('should catch if element is not in schema', () => {
            model.create(data);
            model.prop('doesntexist', 'value');
            expect(model.doesntexist).to.equal(undefined);
        });

        it('should catch if element is nested and not in schema', () => {
            model.create(data);
            model.prop('user.doesntexist', 'value');
            expect(model.user.doesntexist).to.equal(undefined);
        });

        it('should catch if element is not on the correct type', () => {
            model.create(data);
            model.prop('shallow', 123);
            expect(model.shallow).to.be.equal('from schema');
            model.prop('shallow', {
                obj: 'string'
            });
            expect(model.shallow).to.be.equal('from schema');
            model.prop('shallow', true);
            expect(model.shallow).to.be.equal('from schema');
            model.prop('shallow', null);
            expect(model.shallow).to.be.equal('from schema');
        });

        it('should allow multiple types', () => {
            model.create(data);
            model.prop('favoriteNumber', 'seven');
            expect(model.favoriteNumber).to.equal('seven');
            model.prop('favoriteNumber', 7);
            expect(model.favoriteNumber).to.equal(7);
            model.prop('favoriteNumber', true);
            expect(model.favoriteNumber).to.equal(7);
        });

        it('should * as a type', () => {
            model.create(data);
            model.prop('wildcard', 'seven');
            expect(model.wildcard).to.equal('seven');
            model.prop('wildcard', 7);
            expect(model.wildcard).to.equal(7);
            model.prop('wildcard', true);
            expect(model.wildcard).to.equal(true);
        });
    });

    describe('CRUD endpoints', () => {
        let data;
        let schema;
        let model;
        beforeEach(() => {
            schema = {
                user: {
                    id: 'number'
                }
            };
            data = {
                user: {
                    id: 1234
                }
            };
            model = new CPModel('mymodel', schema);
            model.create(data);
        });
        it('should allow the changing of base url', () => {
            expect(model._baseEndpoint).to.not.include('v2');
            model.setBaseEndpoint('/api/v2/');
            expect(model._baseEndpoint).to.include('v2');
        });
        it('should send an ajax call of type POST on save model object', () => {
            var s = nock('http://localhost/api')
            .post('/mymodel/', model)
            .reply(200, model);
            model.save().then((response) => {
                expect(response.body.user.id).to.exists;
                expect(response.body.user.id).to.equal(model.user.id);
            });
        });
        it('should send an ajax call of type DELETE on delete ID', () => {
            var s = nock('http://localhost/api')
            .delete(`/mymodel/${model.user.id}`)
            .reply(204);
            model.destroy(model.user.id).then((response) => {
                expect(response.status).to.equal(204);
                expect(response.body).to.be.empty;
            });
        });
        it('should send an ajax call of type GET to fetch one item', () => {
            var s = nock('http://localhost/api')
            .get(`/mymodel/${model.user.id}`)
            .reply(200, model);
            model.fetch(model.user.id).then((response) => {
                expect(response.body.user.id).to.exists;
                expect(response.body.user.id).to.equal(model.user.id);
            });
        });
        it('should send an ajax call of type GET to fetch an array of all models', () => {
            // TODO: make response an array of models
            let model2 = new CPModel('mymodel', schema);
            model2.create(data);
            model2.prop('user.id', 788);
            var s = nock('http://localhost/api')
            .get(`/mymodel/`)
            .reply(200, [model, model2]);
            model.fetch().then((response) => {
                expect(response.body[0].user.id).to.exists;
                expect(response.body[0].user.id).to.equal(model.user.id);
                expect(response.body[1].user.id).to.equal(model2.user.id);
            });
        });
    });
});
