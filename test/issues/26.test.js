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
  "ui:order": [
    "encounter",
    "firstName",
    "lastName",
    "age",
    "nickName",
    "bio",
    "password",
    "telephone",
  ],
  firstNameAlias: {
    nav: ["0", "lastName"],
  },
  lastName: {
    nav: ["0", "lastName"],
  },
  age: {
    nav: ["0", "firstName", "age"],
  },
  nickName: {
    nav: ["0", "firstName", "nickName"],
  },
  bio: {
    nav: "1",
  },
  password: {
    nav: ["2"],
  },
  telephone: {
    nav: "2",
  },
  navConf: {
    navs: [{ nav: "0", name: "First One To Be", icon: "fa fa-search" }],
    aliases: {
      firstName: "firstNameAlias",
    },
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
