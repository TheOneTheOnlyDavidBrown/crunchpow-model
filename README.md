# crunchpow-model
[![travis build](https://img.shields.io/travis/TheOneTheOnlyDavidBrown/crunchpow-model.svg)](https://travis-ci.org/TheOneTheOnlyDavidBrown/crunchpow-model/)
![MIT License](https://img.shields.io/github/license/TheOneTheOnlyDavidBrown/crunchpow-model.svg)
![version](https://img.shields.io/npm/v/crunchpow-model.svg)

This is a microlibrary for better handling of models with schemas

## Model Usage:
- Import package `const CPModel = require('crunchpow-model')`
- Set up schema as `const schema = {myProp: 'string', multipleTypes: 'string|number', user: {name:'string'}}`. Type can be string|number|array|boolean
- `let myModel = new CPModel('myModelName' schema);`
- `myModel.create([dataObj])`. dataObj must be in a format that validates against the schema. This is for getting a model from the back-end and casting it as a crunchpow-model.
- Use `myModel.prop('myProp','new value')` to set. Nested properties can be set by `myModel.prop('user.name','new value')
- Use `myModel.myProp` to get

## HTTP usage
- using myModel.save() saves the current model
- using myModel.destroy(id) destroys a model based on the passed in id. Probably will update this to have the id optional and delete the current model.
- using myModel.fetch([id]) gets the model if id is passed in. Otherwise, it returns a list of all models 'myModel'.
