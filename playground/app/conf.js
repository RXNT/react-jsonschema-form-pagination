import { SimplifiedRuleEngineFactory } from "react-jsonschema-form-conditionals";

const schema = {
  type: "object",
  required: [],
  properties: {
    encounter: {
      type: "string",
      title: "Encounter",
    },
    firstName: {
      type: "string",
      title: "First name",
    },
    lastName: {
      type: "string",
      title: "Last name",
    },
    age: {
      type: "integer",
      title: "Age",
    },
    bio: {
      type: "string",
      title: "Bio",
    },
    password: {
      type: "string",
      title: "Password",
      minLength: 3,
    },
    telephone: {
      type: "string",
      title: "Telephone",
      minLength: 10,
    },
  },
};

const uiSchema = {
  encounter: {
    classNames: "col-md-12",
  },
  firstName: {
    classNames: "col-md-4 col-xs-4 success",
    "ui:autofocus": true,
    "ui:emptyValue": "",
    "ui:tabID": ["0", "firstName"],
  },
  lastName: {
    classNames: "col-md-4 col-xs-4",
    "ui:tabID": ["0", "lastName"],
  },
  age: {
    classNames: "col-md-4 col-xs-4",
    "ui:widget": "updown",
    "ui:title": "Age of person",
    "ui:tabID": ["0", "firstName", "age"],
  },
  bio: {
    "ui:widget": "textarea",
    classNames: "col-md-12",
    "ui:tabID": "1",
  },
  password: {
    classNames: "col-md-6 col-xs-6",
    "ui:widget": "password",
    "ui:help": "Hint: Make it strong!",
    "ui:tabID": ["2"],
  },
  telephone: {
    classNames: "col-md-6 col-xs-6",
    "ui:options": {
      inputType: "tel",
    },
    "ui:tabID": "2",
  },
};

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

const formData = {
  lastName: "",
  firstName: "",
  age: 20,
};

let rules = [
  {
    conditions: {
      firstName: { not: "empty" },
    },
    event: {
      type: "require",
      params: {
        field: "lastName",
      },
    },
  },
  {
    conditions: {
      firstName: { not: "empty" },
    },
    event: {
      type: "incAge",
    },
  },
];

const extraActions = {
  incAge: function(params, schema, uiSchema, formData) {
    if (!formData.age) {
      formData.age = 0;
    }
    formData.age = formData.age + 1;
  },
};

export default {
  schema,
  uiSchema,
  formData,
  tabData,
  rules,
  extraActions,
  rulesEngine: SimplifiedRuleEngineFactory,
};
