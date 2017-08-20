# react-jsonschema-form-pagination

[![Build Status](https://travis-ci.org/RxNT/react-jsonschema-form-pagination.svg?branch=master)](https://travis-ci.org/RxNT/react-jsonschema-form-pagination)
[![Coverage Status](https://coveralls.io/repos/github/RxNT/react-jsonschema-form-pagination/badge.svg)](https://coveralls.io/github/RxNT/react-jsonschema-form-pagination)
[![npm version](https://badge.fury.io/js/react-jsonschema-form-pagination.svg)](https://badge.fury.io/js/react-jsonschema-form-pagination)

## Features

- Separation of huge schemas into tabs
- Nested tabs - you can have any number of tabs nested inside your form 
- Repeated fields - you can use the same field in multiple tabs, filling it only once 
- Does not conflict with other extensions of Mozilla project 

## Installation

Install `react-jsonschema-form-pagination` by running:

```bash
npm install --s react-jsonschema-form-pagination
```

## Usage

FormWithPagination is a wrapper for Mozilla's JSON Schema Form that allows a schema to be displayed into multiple Bootstrap tabs. This allows users to see a subset of the schema on each tab.

Use this project as you would use Mozilla's JSON Schema Form (see their documentation), but to leverage the tab features just provide these extra parameters:

- In the `uiSchema` object, use the new `ui:tabID` and `ui:tabAliases` property to associate each field with a tab
- Pass in an additional `tabData` array in props, if you want to customize tab naming

To show case use of the pagination project, we'll be using following `schema` as a base
```js
const schema = {
  title: "A registration form",
  description: "A simple form example.",
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    age: { type: "integer" },
    phone: { type: "string" },
    nickName: { type: "string" }
  }
};
```

### One level of tabs

Let's say we have only 1 level of tabs `main` and `other`. We can do it like this: 

```js
import applyPagination from "react-jsonschema-form-pagination";
import Form from "react-jsonschema-form";

const uiSchema = {
  firstName: {
    "ui:tabID": "main"
  },
  lastName: {
    "ui:tabID": "main"
  },
  age: {
    "ui:tabID": "main"
  },
  phone: {
    "ui:tabID": "main"
  },
  nickName: {
    "ui:tabID": "other"
  },
};

let FormWithPagination = applyPagination(Form);

render((
  <FormWithPagination
    schema={schema}
    uiSchema={uiSchema}
  />
), document.getElementById("app"));
```

When rendered this configuration will show 2 tabs 
- `main` tab with `firstName`, `lastName`, `age` and `phone` fields
- `other` tab with `nickName` field

### Multi tabs levels

Let's say we now want to have `main` tab divided in 2 more tabs `general`(`lastName` and `age`) and `other` ( with `phone`). 
This is how `uiSchema` should look like in order to do that :
```js
const uiSchema = {
  firstName: {
    "ui:tabID": "main"
  },
  lastName: {
    "ui:tabID": [ "main", "general" ]
  },
  age: {
    "ui:tabID": [ "main", "general" ]
  },
  phone: {
    "ui:tabID": [ "main", "other" ]
  },
  nickName: {
    "ui:tabID": "other"
  }
};
```

When rendered this configuration will show 2 tabs 
- `main` tab with `firstName`, and 2 sub tabs
    - `general` with `lastName` and `age` fields
    - `other` with `phone` field
- `other` tab with `nickName` field

### Default level

When you don't specify `ui:tabID`, the field will be shown above the tabs.

For example, if we go back to single level example, but we want to always see `firstName` shown above the tab navigation.
Here is how we can do this:

```js
const uiSchema = {
  firstName: {},
  lastName: {
    "ui:tabID": "main"
  },
  age: {
    "ui:tabID": "main"
  },
  phone: {
    "ui:tabID": "main"
  },
  nickName: {
    "ui:tabID": "other"
  },
};
```

When rendered this configuration will show 2 tabs and `firstName` above the fields  
- `main` tab with `lastName`, `age` and `phone` fields
- `other` tab with `nickName` field

### Field aliases in different tabs

One of the requirements for this project was to support same field on different tabs, in order to do that you can specify field alias 
in `uiSchema`. Field `alias` is basically a field UI configuration, that will be used instead of original field in specified tab. 
Aliases can be nested as regular fields. 

For example, if we want to show `firstName` in both tabs `main` and `other`.  

```js
const uiSchema = {
  firstName: {
    "ui:tabID": "main"
  },
  firsNameAlias: {
    "ui:tabID": "other"
  },
  lastName: {
    "ui:tabID": "main"
  },
  age: {
    "ui:tabID": "main"
  },
  phone: {
    "ui:tabID": "main"
  },
  nickName: {
    "ui:tabID": "other"
  },
  "ui:tabAlias": {
    firstName: "firsNameAlias"
  }
};
```

With this configuration pagination will put `firstName` in both `main` and `other` tabs.

`ui:tabAlias` is a simple object with 
- keys - as original schema field names
- values - an alias name or an array of alias names

You can specify either single alias or as many aliases as you want with an array.

## Configure tab naming


## Contribute

- Issue Tracker: github.com/RxNT/react-jsonschema-form-pagination/issues
- Source Code: github.com/RxNT/react-jsonschema-form-pagination

## Support

If you are having issues, please let us know.

## License

The project is licensed under the Apache-2.0 license.


