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

- In the uiSchema object, use the new ui:tabID property to associate each field with a tab.

```jsx
const uiSchema = {
  "ui:tabID": "TAB_ID_HERE",
};
```
- Pass in an additional tabData array in props, alongside uiSchema, schema, etc.

```js
const tabData = [
  {
    tabID: "0",
    name: "Tab 1",
  },
  {
    tabID: "1",
    name: "Tab 2",
  },
  {
    tabID: "2",
    name: "Tab 3",
  },
];
```
### Example:

In this example each field is placed into a separate tab.

```jsx

import FormWithPagination from "react-jsonschema-form-pagination";

let schema = {
  title: "A registration form",
  description: "A simple form example.",
  type: "object",
  properties: {
    firstName: {
      type: "string",
      title: "First name"
    },
    lastName: {
      type: "string",
      title: "Last name"
    },
    age: {
      type: "integer",
      title: "Age",
    }
  }
}

const uiSchema = {
  firstName: {
    "ui:tabID": "0"
  },
  lastName: {
    "ui:tabID": "1"
  },
  age: {
    "ui:tabID": "2"
  }
};

let tabData = [
  {
    tabID: "0",
    name: "Tab 1",
  },
  {
    tabID: "1",
    name: "Tab 2",
  },
  {
    tabID: "2",
    name: "Tab 3",
  },
];

render((
  <FormWithPagination
    schema={schema}
    uiSchema={uiSchema}
    tabData={tabData}
  />
), document.getElementById("app"));
```

### One level of tabs

### Multi tabs levels

### Field aliases in different tabs

## Contribute

- Issue Tracker: github.com/RxNT/react-jsonschema-form-pagination/issues
- Source Code: github.com/RxNT/react-jsonschema-form-pagination

## Support

If you are having issues, please let us know.

## License

The project is licensed under the Apache-2.0 license.


