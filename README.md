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

- In the `uiSchema` object, use the new `nav` and `ui:tabAliases` property to associate each field with a tab
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
    "nav": "main"
  },
  lastName: {
    "nav": "main"
  },
  age: {
    "nav": "main"
  },
  phone: {
    "nav": "main"
  },
  nickName: {
    "nav": "other"
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
    "nav": "main"
  },
  lastName: {
    "nav": [ "main", "general" ]
  },
  age: {
    "nav": [ "main", "general" ]
  },
  phone: {
    "nav": [ "main", "other" ]
  },
  nickName: {
    "nav": "other"
  }
};
```

When rendered this configuration will show 2 tabs 
- `main` tab with `firstName`, and 2 sub tabs
    - `general` with `lastName` and `age` fields
    - `other` with `phone` field
- `other` tab with `nickName` field

### Default level

When you don't specify `nav`, the field will be shown above the tabs.

For example, if we go back to single level example, but we want to always see `firstName` shown above the tab navigation.
Here is how we can do this:

```js
const uiSchema = {
  firstName: {},
  lastName: {
    "nav": "main"
  },
  age: {
    "nav": "main"
  },
  phone: {
    "nav": "main"
  },
  nickName: {
    "nav": "other"
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
    "nav": "main"
  },
  firsNameAlias: {
    "nav": "other"
  },
  lastName: {
    "nav": "main"
  },
  age: {
    "nav": "main"
  },
  phone: {
    "nav": "main"
  },
  nickName: {
    "nav": "other"
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

## Configuring tab names

By default tab names are the same as tabID, since it's a string and you can use any string as tab name.

If you want to override this and use custom names instead, you can do this, by providing `tabData` as a form property. 
`tabData` consists of an array of objects with `tabID` and `name`, `name` will be used as tab name instead of tabID, for example: 

```js
const tabData = [
  {
    tabID: "first",
    name: "First tab"
  }
]
```

## Custom tabs

If you want to have a custom tabs instead of `nav-pills` used by default, you can provide `Tabs` component, when you call 
`applyPagination`

```js
import applyPagination from "react-jsonschema-form-pagination";
import Form from "react-jsonschema-form";
import CustomTabs from CustomNav;

...

let FormWithPagination = applyPagination(Form, CustomTabs);

render((
  <FormWithPagination
    ...
  />
), document.getElementById("app"));
```

CustomTabs will receive 3 properties 
- `activeTab` - currently active tab
- `tabs` - list of tabs (generated from tabID and tabData)
- `onTabChange` - callback on tab selection  

Look at pagination for more details.

## Tab ordering

By default all tabs rendered in order they appear in uiSchema, since it's a primary source of layer reference, 
however it's not reliable way to do so. You can override natural ordering with `ui:tabOrder` property in `uiSchema`, consisting of ordered array of tabID's.
It works the same way as [`ui:order`](https://github.com/mozilla-services/react-jsonschema-form#object-fields-ordering) in mozilla project.


For example, in order to have 
```js
const uiSchema = {
  "ui:tabOrder": [ "main", "sub", "other" ]
  age: {
    "nav": "sub"
  },
  phone: {
    "nav": "main"
  },
  firstName: {
    "nav": "main"
  },
  lastName: {
    "nav": "main"
  },
  nickName: {
    "nav": "other"
  },
};
```

In this configuration, although `sub` tab appears first in `uiSchema`, `main` will be the first tab available for selection.  

## Contribute

- Issue Tracker: github.com/RxNT/react-jsonschema-form-pagination/issues
- Source Code: github.com/RxNT/react-jsonschema-form-pagination

## Support

If you are having issues, please let us know.

## License

The project is licensed under the Apache-2.0 license.


