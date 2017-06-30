# react-jsonschema-form-pagination

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
    classNames: "col-md-4 col-xs-4 success",
    "ui:autofocus": true,
    "ui:emptyValue": "",
    "ui:tabID": "0"
  },
  lastName: {
    classNames: "col-md-4 col-xs-4",
    "ui:tabID": "1"
  },
  age: {
    classNames: "col-md-4 col-xs-4",
    "ui:widget": "updown",
    "ui:title": "Age of person",
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
