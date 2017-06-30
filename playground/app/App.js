import React from "react";
import applyPagination from "../../src/index";
import Form from "react-jsonschema-form";

const schema = {
  title: "A registration form",
  type: "object",
  required: ["firstName", "lastName"],
  properties: {
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
  firstName: {
    classNames: "col-md-4 col-xs-4 success",
    "ui:autofocus": true,
    "ui:emptyValue": "",
  },
  lastName: {
    classNames: "col-md-4 col-xs-4",
  },
  age: {
    classNames: "col-md-4 col-xs-4",
    "ui:widget": "updown",
    "ui:title": "Age of person",
  },
  bio: {
    "ui:widget": "textarea",
    classNames: "col-md-12",
  },
  password: {
    classNames: "col-md-6 col-xs-6",
    "ui:widget": "password",
    "ui:help": "Hint: Make it strong!",
  },
  date: {
    classNames: "col-md-6 col-xs-6",
    "ui:widget": "alt-datetime",
  },
  telephone: {
    classNames: "col-md-6 col-xs-6",
    "ui:options": {
      inputType: "tel",
    },
  },
};

var tabData = [
  {
    schemaID: "0",
    name: "Tab 1",
  },
  {
    schemaID: "1",
    name: "Tab 2",
  },
  {
    schemaID: "2",
    name: "Tab 3",
  },
];

const formData = {
  lastName: "",
  firstName: "",
  age: 20,
};

let FormWithPagination = applyPagination(Form);

export function App() {
  return (
    <FormWithPagination
      tabData={tabData}
      liveValidate={false}
      safeRenderCompletion={true}
      noHtml5Validate={true}
      formData={formData}
      schema={schema}
      uiSchema={uiSchema}
    />
  );
}
