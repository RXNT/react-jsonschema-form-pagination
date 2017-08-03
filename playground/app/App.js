import React from "react";
import applyPagination from "../../src/index";
import applyRules, {
  SimplifiedRuleEngineFactory,
} from "react-jsonschema-form-conditionals";
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
    "ui:tabID": "0",
  },
  lastName: {
    classNames: "col-md-4 col-xs-4",
    "ui:tabID": "0",
  },
  age: {
    classNames: "col-md-4 col-xs-4",
    "ui:widget": "updown",
    "ui:title": "Age of person",
    "ui:tabID": "1",
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
    "ui:tabID": "2",
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

let FormWithPagination = applyRules(applyPagination(Form));

export function App() {
  return (
    <FormWithPagination
      tabData={tabData}
      liveValidate={false}
      safeRenderCompletion={true}
      noHtml5Validate={true}
      formData={formData}
      schema={schema}
      onChange={({ formData }) =>
        console.log(`FormData ${JSON.stringify(formData)}`)}
      rules={[]}
      rulesEngine={SimplifiedRuleEngineFactory}
      uiSchema={uiSchema}
    />
  );
}
