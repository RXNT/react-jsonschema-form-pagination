import React from "react";
import Form from "react-jsonschema-form";
import applyPagination from "../../src";
import renderer from "react-test-renderer";

const schema = {
  type: "object",
  title: "Encounter",
  required: [],
  properties: {
    encounter: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    age: { type: "integer" },
    nickName: { type: "string" },
    bio: { type: "string" },
    password: { type: "string" },
    telephone: { type: "string" },
  },
};

const uiSchema = {
  firstNameAlias: {
    "ui:tabID": ["0", "lastName"],
  },
  lastName: {
    "ui:tabID": ["0", "lastName"],
  },
  age: {
    "ui:tabID": ["0", "firstName", "age"],
  },
  nickName: {
    "ui:tabID": ["0", "firstName", "nickName"],
  },
  bio: {
    "ui:tabID": "1",
  },
  password: {
    "ui:tabID": ["2"],
  },
  telephone: {
    "ui:tabID": "2",
  },
  "ui:tabAlias": {
    firstName: "firstNameAlias",
  },
};

test("encounter title only once", () => {
  let ResForm = applyPagination(Form);
  const component = renderer.create(
    <ResForm schema={schema} uiSchema={uiSchema} />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
