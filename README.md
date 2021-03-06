# crunchpow-model
[![travis build](https://img.shields.io/travis/TheOneTheOnlyDavidBrown/crunchpow-model.svg)](https://travis-ci.org/TheOneTheOnlyDavidBrown/crunchpow-model/)
![MIT License](https://img.shields.io/github/license/TheOneTheOnlyDavidBrown/crunchpow-model.svg)
[![version](https://img.shields.io/npm/v/crunchpow-model.svg)](https://www.npmjs.com/package/crunchpow-model)

This is a microlibrary for better handling of models with schemas. Includes CRUD functions to alter the model on the backend without having to write the CRUD functions (promise returned) in your service.

## Installation
`npm install --save --save-exact crunchpow-model`

or

`yarn add -E crunchpow-model`

or

Use a CDN: `https://npmcdn.com/crunchpow-model/dist/index.umd.min.js` but it's best to go to this in the browser and copy what it directs to because it will keep the correct version for you.

## Model Usage:
- Import package `require('crunchpow-model')`.
- Set up schema as `const schema = {myProp: 'string', multipleTypes: 'string|number', user: {name:'string'}}`. Type can be `string|number|array|boolean`.
- `let myModel = new CrunchPowModel('myModelName', schema);`.
- `myModel.create([dataObj])`. dataObj must be in a format that validates against the schema. This is for getting a model from the back-end and casting it as a crunchpow-model.
- Use `myModel.prop('myProp','new value')` to set. Nested properties can be set by `myModel.prop('user.name', 'new value').
- Use `myModel.myProp` to get property.

## HTTP usage:
- Default endpoints mimic the default Ruby on Rails routes.
- Using myModel.save() saves the current model
- Using myModel.destroy(id) destroys a model based on the passed in id. Probably will update this to have the id optional and delete the current model.
- Using myModel.fetch([id]) gets the model if id is passed in. Otherwise, it returns a list of all models 'myModel'.
- By using `myModel.setBaseEndpoint(newBaseEndpoint)` you can change the root endpoint. Default: `/api/:modelName`.
