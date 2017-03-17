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
/*
  let schema = {
    single: {type: 'string', value: 'from schema'},
    user: {type: 'object', value:
      {
        id: {type: 'number', value:12345},
        name: {type: 'string', value:'Sherlock Holmes'},
        address: {type: 'string', value:'221b Baker Street'},
        profile: {type: 'object', value: {
          favorite_color: {type: 'string', value: 'green'},
          favorite_food: {type: 'string', value: 'indian'}
        }}
      },
    },
    programming_languages: {type:'array', value: ['javascript', 'ruby']}
  }
*/
  beforeEach(() => {
    model = new CPModel(schema);
    model.create(data);
  });

  it('should get single level elements with get(param)', () => {
    model.single.should.equal('from schema');
  });

  it('should get nested elements with prop(param)', () => {
    model.user.id.should.equal(12345);
    model.user.name.should.equal('Sherlock Holmes');
    model.user.profile.favoriteColor.should.equal('green');
  });

  it('should get all elements by calling the root', () => {
    expect(model).to.have.keys('schema', 'single', 'favoriteNumber', 'user', 'isDetective', 'programmingLanguages');
    expect(model.user).to.have.keys('id', 'name', 'address', 'profile');
  });

  it('should catch if element is not in schema', () => {
    model.prop('doesntexist', 'value');
    expect(model.doesntexist).should.equal('undefined');
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

// allow merge in of new data
// allow multiple types 'number|string'

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
