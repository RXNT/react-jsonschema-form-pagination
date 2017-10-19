# react-jsonschema-form-pagination

[![Build Status](https://travis-ci.org/RxNT/react-jsonschema-form-pagination.svg?branch=master)](https://travis-ci.org/RxNT/react-jsonschema-form-pagination)
[![Coverage Status](https://coveralls.io/repos/github/RxNT/react-jsonschema-form-pagination/badge.svg)](https://coveralls.io/github/RxNT/react-jsonschema-form-pagination)
[![npm version](https://badge.fury.io/js/react-jsonschema-form-pagination.svg)](https://badge.fury.io/js/react-jsonschema-form-pagination)

## Features

- Separation of huge schemas into navs
- Nested nav - you can have any number of navs nested inside your form 
- Repeated fields - you can use the same field in multiple navs, filling it only once 
- Does not conflict with other extensions of Mozilla project 

## Installation

Install `react-jsonschema-form-pagination` by running:

```bash
npm install --s react-jsonschema-form-pagination
```

or 
```bash
yarn add react-jsonschema-form-pagination
```

## Usage

FormWithPagination is a wrapper for Mozilla's JSON Schema Form that allows a schema to be displayed into multiple Bootstrap navs. This allows users to see a subset of the schema on each nav.

Use this project as you would use Mozilla's JSON Schema Form (see their documentation), but to leverage the nav features just provide these extra parameters:

- In the `uiSchema` object, use the new `nav` and `navConf` property for additional nav customization

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

### Single level

Let's say we have only 1 level of tabs `main` and `other`. We can do it like this: 

```js
import applyNavs from "react-jsonschema-form-pagination";
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

let FormWithPagination = applyNavs(Form);

render((
  <FormWithPagination
    schema={schema}
    uiSchema={uiSchema}
  />
), document.getElementById("app"));
```

When rendered this configuration will show 2 tabs 
- `main` nav with `firstName`, `lastName`, `age` and `phone` fields
- `other` nav with `nickName` field

### Multi nav levels

Let's say we now want to have `main` nav divided in 2 more tabs `general`(`lastName` and `age`) and `other` ( with `phone`). 
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
- `main` nav with `firstName`, and 2 sub navs
    - `general` with `lastName` and `age` fields
    - `other` with `phone` field
- `other` nav with `nickName` field

### Default level

When you don't specify `nav`, the field will be shown above the navs.

For example, if we go back to single level example, but we want to always see `firstName` shown above the nav navigation.
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

When rendered this configuration will show 2 navs and `firstName` above the fields  
- `main` nav with `lastName`, `age` and `phone` fields
- `other` nav with `nickName` field

### Field aliases in different tabs

One of the requirements for this project was to support same field on different tabs, in order to do that you can specify field alias 
in `uiSchema`. Field `alias` is basically a field UI configuration, that will be used instead of original field in specified nav. 
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
  navConf: {
      aliases: {
        firstName: "firsNameAlias"
      }
  }
};
```

With this configuration pagination will put `firstName` in both `main` and `other` tabs.

`navConf.aliases` is a simple object with 
- keys - as original schema field names
- values - a string, or an array of strings, with uiSchema alias names

You can specify either single alias or as many aliases as you wish with an array.

## Configuring nav presentation

### Default presentation

By default `nav` names are the same as `nav` in uiSchema.

For example:
```js
const uiSchema = {
  firstName: {
    "nav": "General"
  },
  lastName: {
    "nav": "General"
  },
  age: {
    "nav": "General"
  },
  phone: {
    "nav": "General"
  },
  nickName: {
    "nav": "General"
  },
};
```

This schema would have a single nav `General`, which might be good enough for your case.

Let's say you want different name and also add an icon to the `nav`, here is how you can do that 

```js
const uiSchema = {
    firstName: {
      "nav": "g"
    },
    lastName: {
      "nav": "General"
    },
    age: {
      "nav": "General"
    },
    phone: {
      "nav": "General"
    },
    nickName: {
      "nav": "General"
    },
    navConf:{
        navs: [
          {
            nav: "General",
            name: "User",
            icon: "glyphicons glyphicons-users"
          } 
        ]
    }
}
```

In this case there will be a `User` nav with `glyphicons-users` icon.

By default name and icon are the only configuration for nav presentation, but you can customize Nav presentation as you wish with CustomNavs.

You can also 

## Custom navs

If you want to have a custom navs instead of `nav-pills` used by default, you can provide `Navs` component, when you call 
`applyPagination`

```js
import applyPagination from "react-jsonschema-form-pagination";
import Form from "react-jsonschema-form";
import CustomNavs from "./CustomNavs";


let FormWithPagination = applyPagination(Form, CustomNavs);
```

CustomNavs will receive 3 properties 
- `navs` available navs at the layer
    - `links` all available nav links (which is `navConf.navs` configurations and `isActive` flag)
- `onNavChange` - callback on nav selection change  

Look at pagination for more details.

## Nav ordering

By default all tabs rendered in order they appear in uiSchema, since it's a primary source of layer reference, 
however it's not reliable way to do so. You can override natural ordering with `navConf.order` property in `uiSchema`, consisting of ordered array of nav's.
It works the same way as [`ui:order`](https://github.com/mozilla-services/react-jsonschema-form#object-fields-ordering) in mozilla project.

For example, in order to have 
```js
const uiSchema = {
  navConf: {
    order: [ "main", "sub", "other" ]
  },
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

In this configuration, although `sub` nav appears first in `uiSchema`, `main` will be the first nav available for selection.  

## Handling errors

To allow proper error management navigation component adds `activeNav` to all the errors, so that you can add navigation to invalid data on validation errors.

You can use activeNav in errors in 2 ways
- `transformErrors`, that would append `activeNav` to error `message`, `stack` or both
- `ErrorList` that will get `errors` after transformation. 

## Migration

     - From 0.3 - Navs can only be oriented horizontally, vertical orientation was removed to support better error handling

## Contribute

- Issue Tracker: github.com/RxNT/react-jsonschema-form-pagination/issues
- Source Code: github.com/RxNT/react-jsonschema-form-pagination

## Support

If you are having issues, please let us know.

## License

The project is licensed under the Apache-2.0 license.


