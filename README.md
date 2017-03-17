# crunchpow-model

![travis build](https://img.shields.io/travis/TheOneTheOnlyDavidBrown/crunchpow-model.svg)
![MIT License](https://img.shields.io/github/license/TheOneTheOnlyDavidBrown/crunchpow-model.svg)
![version](https://img.shields.io/npm/v/crunchpow-model.svg)


This is a microlibrary for better handling of models with schemas

## Usage:
- Import package `CPModel = require('../src/index.js')`
- Set up schema as `const schema = {myProp: 'string', multipleTypes: 'string|number', user: {name:'string'}}`. Type can be string|number|array|boolean
- `let myModel = new CPModel('myModelName' schema);`
- `myModel.create([dataObj])`. dataObj must be in a format that validates against the schema. This is for getting a model from the back-end and casting it as a crunchpow-model.
- Use `myModel.prop('myProp','new value')` to set. Nested properties can be set by `myModel.prop('user.name','new value')
- Use `myModel.myProp` to get

## TODO:
- Use modelName for generating CRUD on a RESTful api (e.g. `myModel.save()` should save myModel to the back-end with a standardized endpoint)
