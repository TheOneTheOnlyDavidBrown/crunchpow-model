'use strict';
let chai = require('chai'),
  expect = chai.expect,
  CPModel = require('../src/index.js'),
  should = chai.should();

// Set up Chai matchers
//chai.should();

describe('Cruch Pow Model', () => {
  let model;
  let schema = {
    single: 'string',
    favoriteNumber: 'number|string',
    user: {
      id: 'number',
      name: 'string',
      address: 'string',
      profile: {
        favoriteColor: 'string',
        favoriteFood: 'string'
      }
    },
    isDetective: 'boolean',
    programmingLanguages: 'array'
  };
  let data = {
    single: 'from schema',
    favoriteNumber: 7,
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
    model = new CPModel(schema);
//    console.log('(*(*(*(', model);
//    expect(model.user.name).to.equal(null);
    model.create(data);
  });

  xit('should have properties set to null on init', () => {
  });

  xit('should allow merging of new data', () => {
  });

  it('should get single level elements', () => {
    expect(model.single).to.equal('from schema');
  });

  it('should get nested elements', () => {
    expect(model.user.id).to.equal(12345);
    expect(model.user.name).to.equal('Sherlock Holmes');
    expect(model.user.profile.favoriteColor).to.equal('green');
  });

  it('should get all elements by calling the root', () => {
    expect(model).to.have.keys('schema', 'single', 'favoriteNumber', 'user', 'isDetective', 'programmingLanguages');
    expect(model.user).to.have.keys('id', 'name', 'address', 'profile');
  });

  it('should allow setting of nested properties in schema', () => {
    model.prop('user.id', 321);
    expect(model.user.id).to.equal(321);
  });

  it('should catch if element is not in schema', () => {
    model.prop('doesntexist', 'value');
    expect(model.doesntexist).to.equal(undefined);
  });

  it('should catch if element is nested and not in schema', () => {
    model.prop('user.doesntexist', 'value');
    expect(model.user.doesntexist).to.equal(undefined);
  });

  it('should catch if element is not on the correct type', () => {
    model.prop('single', 123);
    expect(model.single).to.be.equal('from schema');
    model.prop('single', {obj:'string'});
    expect(model.single).to.be.equal('from schema');
    model.prop('single', true);
    expect(model.single).to.be.equal('from schema');
    model.prop('single', null);
    expect(model.single).to.be.equal('from schema');
  });

  xit('should allow multiple types', () => {
  });

  //mock api calls
  xit('should send an ajax call of type POST on save with default data', () => {
    expect('this test to fail').to.be.true
  });
  xit('should send an ajax call of type POST on update with default data', () => {
    expect('this test to fail').to.be.true
  });
  xit('should send an ajax call of type DELETE on delete with default data', () => {
    expect('this test to fail').to.be.true
  });
  xit('should send an ajax call of type GET on fetch with default data', () => {
    expect('this test to fail').to.be.true
  });
});
